const express = require('express');
const jwt = require('jsonwebtoken');
const Subject = require('../Model/Fanlar'); // Fanlar modeli
const router = express.Router();
require('dotenv').config()

// Admin uchun biriktirilgan fanlar ro'yxatini olish
router.get('/subjects', async (req, res) => {
  try {
    // Tokenni request header'dan olish
    const token = req.headers.authorization.split(' ')[1];
// console.log(token)
    if (!token) {
      return res.status(401).json({ message: 'Token taqdim etilmagan.' });
    }

    // Tokenni decode qilish
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Decoded'dan adminning ID sini olish
    const adminId = decoded.id;

    // Subject modelidan admin IDga mos keladigan fanlarni izlash
    const subjects = await Subject.find({ admin: adminId });

    if (!subjects) {
      return res.status(404).json({ message: 'Fanlar topilmadi.' });
    }

    // Topilgan fanlarni adminga qaytarish
    res.json({ subjects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Serverda xatolik yuz berdi.' });
  }
});

module.exports = router;
