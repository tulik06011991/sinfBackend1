const Subject = require('../Model/Fanlar'); // Fan modelini chaqiramiz

// Fan yaratish
 // Fan modelini chaqiramiz

// Fan yaratish
exports.createSubject = async (req, res) => {
    try {
        const { name, adminId } = req.body; // Fanning nomi va adminId ni olish

        // Fan nomi mavjudligini tekshirish
        const existingSubject = await Subject.findOne({ name });
        if (existingSubject) {
            return res.status(400).json({ message: 'Bu fan allaqachon mavjud!' });
        }

        // Yangi fan yaratish va adminId biriktirish
        const newSubject = new Subject({ name, adminId });
        await newSubject.save();

        res.status(201).json({ message: 'Fan muvaffaqiyatli yaratildi!', subject: newSubject });
    } catch (error) {
        res.status(500).json({ error: 'Fan yaratishda xato yuz berdi!' });
    }
};

// Fanlar ro'yxatini olish
exports.getAllSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find().populate('adminId', 'name'); // Fanlar bilan adminlarni ham qo'shish
        res.status(200).json(subjects);
    } catch (error) {
        res.status(500).json({ error: 'Fanlar ro\'yxatini olishda xato yuz berdi!' });
    }
};

// Fan o'chirish
exports.deleteSubject = async (req, res) => {
    try {
        const { id } = req.params; // URL parametrlaridan ID olish

        // Fan o'chirish
        const deletedSubject = await Subject.findByIdAndDelete(id);
        if (!deletedSubject) {
            return res.status(404).json({ message: 'Fan topilmadi!' });
        }

        res.status(200).json({ message: 'Fan muvaffaqiyatli o\'chirildi!' });
    } catch (error) {
        res.status(500).json({ error: 'Fan o\'chirishda xato yuz berdi!' });
    }
};
