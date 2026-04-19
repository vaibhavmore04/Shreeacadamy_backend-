/**
 * Optional API protection: requires Authorization: Bearer <token>
 * Use on routes that should only run for logged-in clients (token must be sent from the browser).
 *
 * Example in server.js:
 *   const { requireBearer } = require('./middleware/requireAuth');
 *   app.get('/api/me', requireBearer, (req, res) => res.json({ ok: true }));
 */

function findUserByUsername(name, db) {
  const n = String(name || '').toLowerCase();
  return db.users.find(u => u.username.toLowerCase() === n);
}

function getSessionUser(req, db) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return null;
  const raw = auth.slice(7).trim();
  try {
    const decoded = Buffer.from(raw, 'base64').toString('utf8');
    const i = decoded.lastIndexOf(':');
    if (i <= 0) return null;
    const username = decoded.slice(0, i);
    const role = decoded.slice(i + 1);
    const user = findUserByUsername(username, db);
    if (!user || user.role !== role) return null;
    return user;
  } catch {
    return null;
  }
}

function requireBearer(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || typeof auth !== 'string' || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Login required' });
  }
  const token = auth.slice(7).trim();
  if (!token) {
    return res.status(401).json({ message: 'Login required' });
  }
  next();
}

/**
 * Role-based access control middleware
 * Usage: app.get('/api/admin', requireRole('Admin'), handler);
 */
function requireRole(role) {
  return (req, res, next) => {
    // This would need access to the db - for now, we'll implement in the route handlers
    // In a real implementation, you'd pass the db or use a session store
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const token = auth.slice(7).trim();
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf8');
      const i = decoded.lastIndexOf(':');
      if (i <= 0) {
        return res.status(401).json({ error: 'Invalid token' });
      }
      const userRole = decoded.slice(i + 1);
      
      if (userRole.toLowerCase() !== role.toLowerCase()) {
        return res.status(403).json({ error: `${role} access required` });
      }
      
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
}

module.exports = { 
  requireBearer, 
  requireRole,
  getSessionUser,
  findUserByUsername
};
