const Question = require('../Model/questionModel'); // Savollar modelini chaqiramiz

// Ma'lum bir fan bo'yicha savollarni olish
exports.getQuestionsBySubject = async (req, res) => {
    try {
        const { subject } = req.params; // URL parametrlardan fan nomini olish

        // Savollarni fan nomi bo'yicha filtrlaymiz
        const questions = await Question.find({ subject });

        if (!questions.length) {
            return res.status(404).json({ message: 'Savollar topilmadi!' });
        }

        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ error: 'Savollarni olishda xato yuz berdi!' });
    }
};

