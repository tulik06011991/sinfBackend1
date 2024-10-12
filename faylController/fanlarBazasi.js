const Subject = require('../Model/Fanlar'); // Fanlar modeli

// Barcha fanlarni olish funksiyasi
const getAllSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find(); // Barcha fanlarni bazadan olamiz
        res.status(200).json(subjects); // Fanlarni JSON formatda qaytaramiz
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving subjects', error });
    }
};

// Tanlangan fanning savollarini olish funksiyasi
const getQuestionsBySubject = async (req, res) => {
    const { subjectName } = req.params; // Tanlangan fan nomini olish
    try {
        const questions = await Question.find({ subject: subjectName }); // Tanlangan fan bo'yicha savollarni olish
        res.status(200).json(questions); // Savollarni JSON formatda qaytaramiz
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving questions', error });
    }
};

module.exports = {
    getAllSubjects,
    getQuestionsBySubject,
};
