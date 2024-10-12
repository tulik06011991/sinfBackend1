const express = require('express');
const { submitAnswers } = require('../admin/Javoblar');
const router = express.Router();

// Javoblarni yuborish yo'li (POST so'rovi)
router.post('/submit-answers', submitAnswers);

module.exports = router;
