require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Models
const Fee = require('./models/Fee');
const Notification = require('./models/Notification');
const Admission = require('./models/Admission'); // Use external model

// Routes
const admissionRoutes = require('./routes/admissionRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shree_academy';
console.log('DEBUG: Connecting to URI:', mongoURI.replace(/:([^:@]+)@/, ':****@')); // Mask password
mongoose.connect(mongoURI).then(async () => {
  console.log('Connected to MongoDB');
  
  // Add demo data if collection is empty
  const count = await Admission.countDocuments();
  if (count === 0) {
    const salt = await bcrypt.genSalt(10);
    const demoHashedPassword = await bcrypt.hash('student123', salt);
    
    const demoAdmissions = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        course: 'JEE Advanced',
        message: 'Interested in JEE coaching',
        password: demoHashedPassword,
        status: 'pending',
        createdAt: new Date()
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '0987654321',
        course: 'NEET',
        message: 'Need NEET coaching information',
        password: demoHashedPassword,
        status: 'pending',
        createdAt: new Date()
      }
    ];
    
    await Admission.insertMany(demoAdmissions);
    console.log('Demo admissions added to MongoDB');
  } else {
    console.log(`Found ${count} admissions in MongoDB`);
  }
}).catch(err => {
  console.log('MongoDB connection error:', err);
});

// Admission Schema moved to models/Admission.js

// Simple in-memory database
let users = [
  {
    id: 1,
    name: 'Test Student',
    email: 'student@test.com',
    password: 'student123',
    role: 'student'
  },
  {
    id: 2,
    name: 'Admin User',
    email: 'admin@test.com',
    password: 'admin123',
    role: 'admin',
    username: 'admin'
  }
];

let admissionInquiries = [
  {
    id: 1,
    name: 'Rahul Sharma',
    phone: '9876543210',
    email: 'rahul@gmail.com',
    currentClass: '12th Science',
    course: 'JEE Advanced',
    message: 'I am interested in JEE coaching. Please provide details.',
    createdAt: new Date('2024-01-15').toISOString()
  },
  {
    id: 2,
    name: 'Priya Patel',
    phone: '9123456789',
    email: 'priya@gmail.com',
    currentClass: '11th Science',
    course: 'NEET',
    message: 'Want to join NEET coaching batch.',
    createdAt: new Date('2024-01-16').toISOString()
  },
  {
    id: 3,
    name: 'Amit Kumar',
    phone: '9988776655',
    email: 'amit@gmail.com',
    currentClass: '12th Commerce',
    course: 'CA Foundation',
    message: 'Need information about CA Foundation course.',
    createdAt: new Date('2024-01-17').toISOString()
  },
  {
    id: 4,
    name: 'Sneha Reddy',
    phone: '9765432109',
    email: 'sneha@gmail.com',
    currentClass: '10th',
    course: 'Foundation Course',
    message: 'Looking for foundation course for 10th students.',
    createdAt: new Date('2024-01-18').toISOString()
  },
  {
    id: 5,
    name: 'Vikram Singh',
    phone: '9654321098',
    email: 'vikram@gmail.com',
    currentClass: '12th Science',
    course: 'IIT JEE',
    message: 'Interested in IIT JEE coaching program.',
    createdAt: new Date('2024-01-19').toISOString()
  },
  {
    id: 6,
    name: 'Anjali Desai',
    phone: '9543210987',
    email: 'anjali@gmail.com',
    currentClass: '11th Science',
    course: 'Medical',
    message: 'Want to join medical entrance coaching.',
    createdAt: new Date('2024-01-20').toISOString()
  },
  {
    id: 7,
    name: 'Rohit Verma',
    phone: '9432109876',
    email: 'rohit@gmail.com',
    currentClass: 'Diploma 1st Year',
    course: 'Engineering',
    message: 'Need engineering diploma coaching.',
    createdAt: new Date('2024-01-21').toISOString()
  },
  {
    id: 8,
    name: 'Kavita Menon',
    phone: '9321098765',
    email: 'kavita@gmail.com',
    currentClass: '12th Arts',
    course: 'General Studies',
    message: 'Looking for general studies coaching.',
    createdAt: new Date('2024-01-22').toISOString()
  },
  {
    id: 9,
    name: 'Nitin Gupta',
    phone: '9210987654',
    email: 'nitin@gmail.com',
    currentClass: '11th Commerce',
    course: 'CS Foundation',
    message: 'Interested in CS Foundation course.',
    createdAt: new Date('2024-01-23').toISOString()
  },
  {
    id: 10,
    name: 'Divya Nair',
    phone: '9109876543',
    email: 'divya@gmail.com',
    currentClass: '12th Science',
    course: 'NEET PG',
    message: 'Need NEET PG coaching information.',
    createdAt: new Date('2024-01-24').toISOString()
  },
  {
    id: 11,
    name: 'Arjun Rao',
    phone: '9098765432',
    email: 'arjun@gmail.com',
    currentClass: '10th',
    course: 'Math Foundation',
    message: 'Want to strengthen math foundation.',
    createdAt: new Date('2024-01-25').toISOString()
  },
  {
    id: 12,
    name: 'Pooja Sharma',
    phone: '8987654321',
    email: 'pooja@gmail.com',
    currentClass: '11th Science',
    course: 'Physics',
    message: 'Need physics coaching for 11th.',
    createdAt: new Date('2024-01-26').toISOString()
  },
  {
    id: 13,
    name: 'Karan Patel',
    phone: '8876543210',
    email: 'karan@gmail.com',
    currentClass: '12th Science',
    course: 'Chemistry',
    message: 'Looking for chemistry coaching.',
    createdAt: new Date('2024-01-27').toISOString()
  },
  {
    id: 14,
    name: 'Meera Joshi',
    phone: '8765432109',
    email: 'meera@gmail.com',
    currentClass: 'Diploma 2nd Year',
    course: 'Mechanical',
    message: 'Need mechanical engineering coaching.',
    createdAt: new Date('2024-01-28').toISOString()
  },
  {
    id: 15,
    name: 'Suresh Kumar',
    phone: '8654321098',
    email: 'suresh@gmail.com',
    currentClass: '11th Commerce',
    course: 'Accountancy',
    message: 'Interested in accountancy coaching.',
    createdAt: new Date('2024-01-29').toISOString()
  }
];

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://www.shreeacadamy.in',
  'https://shreeacadamy.in',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Admission Routes
app.use('/api', admissionRoutes);

// Backward compatibility or legacy routes (Redirect to new controller if needed)
const admissionController = require('./controllers/admissionController');
app.post('/api/admissions', admissionController.submitInquiry);
app.post('/api/admission', admissionController.submitInquiry); // Direct singular support
app.get('/api/admissions', admissionController.getInquiries);
app.get('/api/admission', admissionController.getInquiries); // Direct singular support
app.put('/api/admissions/approve/:id', admissionController.approveAdmission);
app.delete('/api/admissions/:id', async (req, res) => {
  try {
    const admissionId = parseInt(req.params.id);
    await Admission.findOneAndDelete({ id: admissionId });
    res.json({ message: 'Admission deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete admission' });
  }
});

// Helper functions
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function verifyPassword(password, hashedPassword) {
  return hashPassword(password) === hashedPassword;
}

// Login API
app.post('/api/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ error: 'Username, password and role are required.' });
    }

    if (role.toLowerCase() === 'student') {
      const admissionUser = await Admission.findOne({
        $or: [{ email: username }, { name: username }]
      });

      if (!admissionUser) {
        return res.status(401).json({ error: 'Invalid username or password.' });
      }

      if (admissionUser.admissionStatus !== 'approved') {
        return res.status(401).json({ error: 'Wait for admin approval' });
      }

      const isPasswordValid = await bcrypt.compare(password, admissionUser.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid username or password.' });
      }

      const userResponse = {
        id: admissionUser.id,
        name: admissionUser.name,
        email: admissionUser.email,
        role: 'student',
        username: admissionUser.email
      };

      return res.json({
        message: 'Login successful',
        user: userResponse,
        token: 'simple-token-' + Date.now()
      });
    }

    const user = users.find(u => 
      (u.email === username || u.name === username || u.username === username) && 
      u.role.toLowerCase() === role.toLowerCase()
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const isPasswordValid = password === user.password;
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      username: user.email
    };

    res.json({
      message: 'Login successful',
      user: userResponse,
      token: 'simple-token-' + Date.now()
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});


// Legacy admission routes removed as they are now handled by /api routes or compatibility redirects above

// --- FEE MANAGEMENT APIs ---

// GET /api/fees - Get all fee records with student details
app.get('/api/fees', async (req, res) => {
  try {
    const fees = await Fee.find();
    // Fetch student names from Admission collection
    const feesWithStudents = await Promise.all(fees.map(async (fee) => {
      const student = await Admission.findOne({ id: fee.studentId });
      return {
        ...fee._doc,
        studentName: student ? student.name : 'Unknown',
        studentEmail: student ? student.email : 'Unknown',
        course: student ? student.course : 'Unknown'
      };
    }));
    res.json(feesWithStudents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch fees' });
  }
});

// POST /api/fees - Create or Update fee plan
app.post('/api/fees', async (req, res) => {
  try {
    const { studentId, totalFees, paidAmount, dueDate } = req.body;
    
    let fee = await Fee.findOne({ studentId });
    if (fee) {
      fee.totalFees = totalFees;
      fee.paidAmount = paidAmount;
      fee.dueDate = dueDate;
      await fee.save();
    } else {
      fee = new Fee({ studentId, totalFees, paidAmount, dueDate });
      await fee.save();
    }
    
    res.status(201).json({ message: 'Fee plan updated successfully', fee });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update fee plan' });
  }
});

// POST /api/fees/update-payment - Update paid amount
app.post('/api/fees/update-payment', async (req, res) => {
  try {
    const { studentId, amount } = req.body;
    const fee = await Fee.findOne({ studentId });
    if (!fee) return res.status(404).json({ error: 'Fee plan not found' });
    
    fee.paidAmount += Number(amount);
    await fee.save();
    res.json({ message: 'Payment updated successfully', fee });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update payment' });
  }
});

// GET /api/fees/student/:id - Get fee info for specific student
app.get('/api/fees/student/:id', async (req, res) => {
  try {
    const studentId = parseInt(req.params.id);
    const fee = await Fee.findOne({ studentId });
    if (!fee) return res.status(404).json({ error: 'Fee plan not found' });
    res.json(fee);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch fee details' });
  }
});

// --- NOTIFICATION APIs ---

// POST /api/notifications - Create notification (Admin)
app.post('/api/notifications', async (req, res) => {
  try {
    const { studentId, title, message } = req.body;
    const notification = new Notification({ studentId, title, message });
    await notification.save();
    res.status(201).json({ message: 'Notification sent successfully', notification });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// GET /api/notifications/student/:id - Get notifications for student
app.get('/api/notifications/student/:id', async (req, res) => {
  try {
    const studentId = parseInt(req.params.id);
    const notifications = await Notification.find({ studentId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// PUT /api/notifications/read/:id - Mark as read
app.put('/api/notifications/read/:id', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// Contact API
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully'
    });

  } catch (error) {
    console.error('Contact error:', error);
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
});

// Admin APIs
app.get('/api/inquiry', (req, res) => {
  res.json(admissionInquiries);
});

app.get('/api/users', (req, res) => {
  const usersResponse = users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role
  }));
  res.json({ success: true, users: usersResponse });
});

app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const totalInquiries = await Admission.countDocuments();
    const pendingInquiries = await Admission.countDocuments({ 
      status: { $regex: /pending/i } 
    });
    
    // Calculate last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentInquiries = await Admission.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    res.json({
      success: true,
      stats: {
        admissions: {
          total: totalInquiries,
          pending: pendingInquiries,
          recent: recentInquiries
        },
        users: {
          total: users.length,
          students: users.filter(u => u.role === 'student').length,
          teachers: users.filter(u => u.role === 'teacher').length,
          admins: users.filter(u => u.role === 'admin').length
        }
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log('');
  console.log('📚 Available Test Accounts:');
  console.log('Student: student@test.com / student123');
  console.log('Admin: admin@test.com / admin123');
  console.log('');
  console.log('🌐 Access your project at: http://localhost:3000');
});
