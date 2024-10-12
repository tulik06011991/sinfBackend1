const express = require('express');
const router = express.Router();
const { getAllQuestions, getAllSubjects, getQuestionsBySubject } = require('../faylController/fanlarBazasi');

 // Controllerga mos ravishda yo'lni o'zgartiring

// Fanlarni olish
router.get('/subjects', getAllSubjects);

// Tanlangan fanning savollarini olish
router.get('/questions/:subjectName', getQuestionsBySubject);

// Barcha savollarni olish
router.get('/questions', getAllQuestions);

module.exports = router;
