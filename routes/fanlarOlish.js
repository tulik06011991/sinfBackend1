const express = require('express');
const router = express.Router();
const { getSubjects } = require('../admin/FanlarniOlish');

// Barcha fanlarni yoki adminId bo'yicha fanlarni olish
router.get('/subjects', getSubjects);

router.get('/subjects/:id', getSubjects);// adminId ixtiyoriy

module.exports = router;
