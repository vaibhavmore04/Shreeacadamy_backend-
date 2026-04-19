const Admission = require('../models/Admission');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const emailService = require('../utils/emailService');

// Submit Admission Inquiry
exports.submitInquiry = async (req, res) => {
  console.log('DEBUG: Received Inquiry Request Body:', req.body);
  try {
    const { name, email, phone, currentClass, course, message, password } = req.body;

    // Validation
    if (!name || !email || !phone || !currentClass || !course || !password) {
      return res.status(400).json({ error: 'All required fields must be provided.' });
    }

    // Check if email already exists
    const existingInquiry = await Admission.findOne({ email });
    if (existingInquiry) {
      return res.status(400).json({ error: 'An inquiry with this email already exists.' });
    }

    // Get next ID (compatible with existing logic)
    const lastAdmission = await Admission.findOne().sort({ id: -1 });
    const nextId = lastAdmission ? lastAdmission.id + 1 : 1;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const newInquiry = new Admission({
      id: nextId,
      name,
      email,
      phone,
      currentClass,
      course,
      message,
      password: hashedPassword,
      verificationToken,
      admissionStatus: 'pending',
      emailVerified: false
    });

    await newInquiry.save();

    // Send verification email
    try {
      console.log(`DEBUG: Attempting to send verification email to ${email}...`);
      await emailService.sendVerificationEmail(email, name, verificationToken);
      console.log(`DEBUG: Verification email successfully sent to ${email}`);
    } catch (emailErr) {
      console.error(`ERROR: Email sending failed for ${email}:`, emailErr.message);
      // In production, you might want to handle this differently
    }

    res.status(201).json({
      message: 'Inquiry submitted successfully. Verification email sent. Please check your inbox.',
      admission: { id: nextId, name, email, course }
    });
  } catch (error) {
    console.error('Submit Inquiry Error:', error);
    res.status(500).json({ error: 'Failed to submit admission inquiry' });
  }
};

// Verify Email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const admission = await Admission.findOne({ verificationToken: token });

    if (!admission) {
      return res.status(400).json({ error: 'Invalid or expired verification token.' });
    }

    admission.emailVerified = true;
    admission.verificationToken = undefined; // Clear token after verification
    await admission.save();

    res.json({ success: true, message: 'Email verified successfully! You can now wait for admin approval.' });
  } catch (error) {
    console.error('Verify Email Error:', error);
    res.status(500).json({ error: 'Failed to verify email' });
  }
};

// Approve Admission
exports.approveAdmission = async (req, res) => {
  try {
    const admissionId = parseInt(req.params.id);
    const admission = await Admission.findOne({ id: admissionId });

    if (!admission) {
      return res.status(404).json({ error: 'Admission inquiry not found.' });
    }

    if (!admission.emailVerified) {
      return res.status(400).json({ error: 'Cannot approve an unverified email address.' });
    }

    admission.admissionStatus = 'approved';
    await admission.save();

    // Send confirmation email
    try {
      await emailService.sendConfirmationEmail(admission.email, admission.name);
    } catch (emailErr) {
       console.error('Confirmation email failed:', emailErr);
    }

    res.json({ message: 'Admission approved successfully.', admission });
  } catch (error) {
    console.error('Approve Admission Error:', error);
    res.status(500).json({ error: 'Failed to approve admission' });
  }
};

// Reject Admission
exports.rejectAdmission = async (req, res) => {
  try {
    const admissionId = parseInt(req.params.id);
    const admission = await Admission.findOne({ id: admissionId });

    if (!admission) {
      return res.status(404).json({ error: 'Admission inquiry not found.' });
    }

    admission.admissionStatus = 'rejected';
    await admission.save();

    // Send rejection email
    try {
      await emailService.sendRejectionEmail(admission.email, admission.name);
    } catch (emailErr) {
      console.error('Rejection email failed:', emailErr);
    }

    res.json({ message: 'Admission inquiry rejected successfully.' });
  } catch (error) {
    console.error('Reject Admission Error:', error);
    res.status(500).json({ error: 'Failed to reject admission' });
  }
};

// Get All Inquiries
exports.getInquiries = async (req, res) => {
  try {
    const inquiries = await Admission.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    console.error('Get Inquiries Error:', error);
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
};
