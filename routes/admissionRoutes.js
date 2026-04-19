const express = require('express');
const router = express.Router();
const admissionController = require('../controllers/admissionController');

// All these routes will be prefixed with /api in server.js
router.post('/admission', admissionController.submitInquiry);
router.get('/verify-email/:token', admissionController.verifyEmail);
router.put('/admission/approve/:id', admissionController.approveAdmission);
router.put('/admission/reject/:id', admissionController.rejectAdmission);
router.get('/inquiries', admissionController.getInquiries);

module.exports = router;
