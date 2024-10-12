const express = require('express');
const router = express.Router();
const { registerController, loginController, getUsers,
    createUser,
    
    deleteUser } = require('../auth/auth');
const middleware = require('../middleware/middleware')


// Ro'yxatdan o'tish (POST /api/users/register)
router.post('/register',  registerController);

// Kirish (POST /api/users/login)
router.post('/login',  loginController);


// Foydalanuvchilar uchun marshrutlar
router.get('/dashboard', middleware,  getUsers); // Barcha foydalanuvchilarni olish
router.post('/dashboard', createUser); // Foydalanuvchini yaratish
 // Foydalanuvchini yangilash
router.delete('/users/:id', middleware, deleteUser); // Foydalanuvchini o'chirish




module.exports = router;
