const express = require('express');
const { verifyAdminToken, getSubjectDetails, deleteQuestion, deleteResult } = require('../admin/hammasi');
const {downloadUserResultsPDF} = require('../admin/pdf')
const router = express.Router();

// Admin tomonidan fan bo'yicha ma'lumotlarni olish
router.get('/subjects/:subjectId', verifyAdminToken, getSubjectDetails);
router.get('/subjects/:subjectId/results/pdf', verifyAdminToken, downloadUserResultsPDF);
router.delete('/subjects/:questionId', verifyAdminToken, deleteQuestion);

// Natijani o'chirish yo'li
router.delete('/users/:id', verifyAdminToken, deleteResult);


module.exports = router;
