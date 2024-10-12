const express = require('express');
const { getQuestionsBySubject } = require('../faylController/Savollar'); // Controller funksiyasini chaqirish

const router = express.Router();

// Ma'lum bir fan bo'yicha savollarni olish
router.get('/questions/subject/:subject', getQuestionsBySubject);

module.exports = router;
