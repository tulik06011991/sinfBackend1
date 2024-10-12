const Admin = require('../Model/adminlar'); // Admin modelini chaqiramiz
const bcrypt = require('bcryptjs');

require('dotenv').config()

// Adminlarni yaratish
const jwt = require('jsonwebtoken');
 // Admin modelini import qilamiz

exports.createAdmin = async (req, res) => {
    try {
        const { name, email, password, subject } = req.body;

        // Yangi admin yaratish, role ni admin deb belgilaymiz
        const newAdmin = new Admin({
            name,
            email,
            password,
            subject,
            role: 'admin' // Admin roli
        });

        // Adminni saqlash
        await newAdmin.save();

        // Token yaratish
        const token = jwt.sign(
            {
                id: newAdmin._id,
                role: newAdmin.role
            },
            process.env.JWT_SECRET, // JWT kaliti
            { expiresIn: '1h' } // Tokenning amal qilish muddati 1 soat
        );

        // Javobda tokenni qaytarish
        res.status(201).json({ 
            message: 'Admin muvaffaqiyatli yaratildi!', 
            newAdmin,
            token // Tokenni qaytaramiz
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Admin yaratishda xato yuz berdi!' });
    }
};


// Barcha adminlarni olish
exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find();
        res.status(200).json(admins);
    } catch (error) {
        res.status(500).json({ error: 'Adminlarni olishda xato yuz berdi!' });
    }
};

// Adminni yangilash
exports.updateAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Agar yangilash jarayonida role maydoni berilgan bo'lsa, uni admin bo'lishiga ishonch hosil qilish
        if (updates.role && updates.role !== 'admin') {
            return res.status(400).json({ error: 'Admin roli faqat admin bo\'lishi mumkin!' });
        }

        // Adminni yangilash
        const updatedAdmin = await Admin.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedAdmin) {
            return res.status(404).json({ error: 'Admin topilmadi!' });
        }
        res.status(200).json({ message: 'Admin muvaffaqiyatli yangilandi!', updatedAdmin });
    } catch (error) {
        res.status(400).json({ error: 'Adminni yangilashda xato yuz berdi!' });
    }
};

// Adminni o'chirish
exports.deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedAdmin = await Admin.findByIdAndDelete(id);
        if (!deletedAdmin) {
            return res.status(404).json({ error: 'Admin topilmadi!' });
        }

        res.status(200).json({ message: 'Admin muvaffaqiyatli o\'chirildi!' });
    } catch (error) {
        res.status(500).json({ error: 'Adminni o\'chirishda xato yuz berdi!' });
    }
};
