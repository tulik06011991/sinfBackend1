const express = require('express');
const router = express.Router();
const { getSubjects, getSubject } = require('../admin/FanlarniOlish');
const middleware = require('../middleware/middleware')

// Barcha fanlarni yoki adminId bo'yicha fanlarni olish
// router.get('/subjects', getAllSubjects);
router.get('/subject', getSubject);

router.post('/subjects/:fanId', getSubjects);// adminId ixtiyoriy

module.exports = router;
