const jwt = require('jsonwebtoken');
const Answer = require('../Model/Javoblar');
const Question = require('../Model/questionModel');
require('dotenv').config();

const submitAnswers = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token mavjud emas' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const { subjectId, answers, userName } = req.body;

        let savedAnswers = [];
        let correctAnswersCount = 0;
        const totalQuestions = answers.length;

        // Har bir savol uchun ma'lumotlarni saqlash
        for (let i = 0; i < answers.length; i++) {
            const { questionId, selectedOption } = answers[i];
            const question = await Question.findById(questionId);

            if (question) {
                // Tanlangan variantni tekshirish
                const selectedOptionObj = question.options.find(option => option.text === selectedOption);
                const isCorrect = selectedOptionObj?.isCorrect;

                if (isCorrect) {
                    correctAnswersCount++;
                }

                // Yangi javobni saqlash
                const answer = new Answer({
                    userId,
                    userName,
                    subjectId,
                    questionId,
                    selectedOption
                });

                await answer.save(); // Ma'lumotlar bazasiga saqlash
                savedAnswers.push(answer); // Saqlangan javoblarni massivga qo'shish
            }
        }

        // To'g'ri javoblarning foizini hisoblash
        const correctPercentage = (correctAnswersCount / totalQuestions) * 100;

        // Javoblar saqlandi deb qaytish
        return res.status(200).json({
            message: 'Javoblar saqlandi',
            correctAnswersCount,
            totalQuestions,
            correctPercentage,
            savedAnswers // Saqlangan javoblar qaytariladi
        });
    } catch (error) {
        console.error('Javoblarni yuborishda xato:', error);
        return res.status(500).json({ message: 'Serverda xato yuz berdi' });
    }
};

module.exports = { submitAnswers };
