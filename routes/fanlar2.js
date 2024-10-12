const express = require('express');
const router = express.Router();
const subjectController = require('../admin/Fanlar');
const middleware = require('../middleware/middleware') // Fan controllerini chaqiramiz

// Fan yaratish marshruti (faqat admin uchun)
router.post('/create', middleware, subjectController.createSubject);

// Barcha fanlarni olish
router.get('/subjects', middleware,  subjectController.getAllSubjects);

// Fan o'chirish (faqat admin uchun)
router.delete('/:id',  middleware, subjectController.deleteSubject)

module.exports = router;
