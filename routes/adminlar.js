const express = require('express');
const router = express.Router();
const adminController = require('../admin/adminlar');
const middleware = require('../middleware/middleware')

// Adminlar CRUD yo'riqnomalari
router.post('/admin',  middleware, adminController.createAdmin); // Yangi admin yaratish
router.get('/admins', middleware, adminController.getAllAdmins); // Barcha adminlarni olish
router.put('/admin/:id', middleware, adminController.updateAdmin); // Adminni yangilash
router.delete('/admin/:id', middleware, adminController.deleteAdmin); // Adminni o'chirish
// router.post('/admin/login', adminController.loginAdmin); // Admin login qilish;

module.exports = router;
