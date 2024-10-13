const express = require('express');
const router = express.Router();
const { getSubjects, getAllSubjects } = require('../admin/FanlarniOlish');

// Barcha fanlarni yoki adminId bo'yicha fanlarni olish
router.get('/subjects', getAllSubjects);

router.get('/subjects/:id', getSubjects);// adminId ixtiyoriy

module.exports = router;
