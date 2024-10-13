const express = require('express');
const router = express.Router();
const { getSubjects, getAllSubjects } = require('../admin/FanlarniOlish');
const middleware = require('../middleware/middleware')

// Barcha fanlarni yoki adminId bo'yicha fanlarni olish
router.get('/subjects', getAllSubjects);

router.get('/subjects/:id', middleware, getSubjects);// adminId ixtiyoriy

module.exports = router;
