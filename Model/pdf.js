// Model/Results.js



const jwt = require('jsonwebtoken');
const Answer = require('../Model/Javoblar'); // Foydalanuvchilar natijalari model
const Question = require('../Model/questionModel'); // Savollar model

const Subject = require('../Model/Fanlar');
 const Option = require('../Model/hammasi');
 const Results = require('../Model/pdf');


// Admin tokenini tekshirish funksiyasi
const verifyAdminToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'Token topilmadi.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err || decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Sizda ushbu amalni bajarish huquqi yo\'q.' });
        }
        req.userId = decoded.id; // Admin ID
        next();
    });
};

// Fan bo'yicha ma'lumotlarni olish va natijalarni hisoblash
const getSubjectDetails  = async (req, res) => {
    try {
        const subjectId = req.params.subjectId; // URL'dan subjectId olindi
        console.log(subjectId);

        // subjectId bo'yicha foydalanuvchilarning javoblarini olish
        const answers = await Answer.find({ subjectId }) // Faqat subjectId bo'yicha javoblar olindi
            .populate('userId', 'name') // Foydalanuvchining ismi
            .populate('questionId'); // Javoblar bilan bog'liq savollarni olish

        // Agar javoblar topilmasa
        if (!answers.length) {
            return res.status(404).json({ message: 'Subject bo\'yicha javoblar topilmadi.' });
        }

        // Har bir foydalanuvchining natijalarini saqlash uchun array
        const userResults = [];

        // Foydalanuvchilarni takrorlanmas qilib olish (unique)
        const users = [...new Set(answers.map(answer => answer.userId._id.toString()))]; // Foydalanuvchilarning unique ro'yxati

        // Har bir foydalanuvchining javoblarini hisoblash
        for (let userId of users) {
            // Shu foydalanuvchining subjectId bo'yicha barcha javoblarini olish
            const userAnswers = answers.filter(answer => answer.userId._id.toString() === userId);

            let correctAnswersCount = 0;
            let questionsWithOptions = [];

            // Har bir foydalanuvchi javobini to'g'ri javob bilan solishtiramiz
            for (let userAnswer of userAnswers) {
                const question = userAnswer.questionId; // Savolni olamiz
                const selectedOption = userAnswer.selectedOption; // Foydalanuvchining tanlagan varianti
                const correctAnswer = question.correctAnswer; // To'g'ri javob

                // Savollar va ularning variantlarini yig'amiz
                questionsWithOptions.push({
                    questionId: question._id,
                    questionText: question.questionText,
                    options: question.options,
                    selectedOption: selectedOption,
                    correctAnswer: correctAnswer
                });

                // Agar tanlangan variant to'g'ri javobga mos kelsa, ball qo'shamiz
                if (selectedOption === correctAnswer) {
                    correctAnswersCount++;
                }
            }

            // Foydalanuvchi ma'lumotlarini yig'ish
            const totalQuestions = userAnswers.length; // Foydalanuvchi javob bergan savollar soni
            const correctPercentage = totalQuestions > 0 ? ((correctAnswersCount / totalQuestions) * 100).toFixed(2) : 0; // To'g'ri javoblar foizi

            userResults.push({
                userId: userAnswers[0].userId._id,
                userName: userAnswers[0].userId.name,
                totalQuestions,
                correctAnswersCount,
                correctPercentage,
                questionsWithOptions // Foydalanuvchi tanlagan savollar va variantlar
            });
        }

        // Foydalanuvchilarning natijalarini va savollar bilan qaytarish
        res.status(200).json({
            subjectId,
            userResults
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ma\'lumotlarni olishda xatolik yuz berdi.' });
    }
};


const deleteQuestion = async (req, res) => {
    const  {questionId}  = req.params;
console.log(questionId)

    try {
        const question = await Question.findByIdAndDelete(questionId);
        if (!question) {
            return res.status(404).json({ message: 'Savol topilmadi.' });
        }

        // Savolga tegishli javoblarni o'chirish (agar kerak bo'lsa)
        await Answer.deleteMany({ questionId });

        res.status(200).json({ message: 'Savol muvaffaqiyatli o\'chirildi.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Savolni o\'chirishda xatolik yuz berdi.' });
    }
}; 


const deleteResult = async (req, res) => {
    const { id } = req.params; // userId ni req.params dan olamiz
    console.log(id);

    try {
        // Natijani userId bo'yicha o'chirish
        const result = await Results.deleteMany({ userId: id }); // userId ga tegishli barcha natijalarni o'chiradi

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Natija topilmadi.' }); // 404 - Not Found, agar o'chiriladigan natija topilmasa
        }

        res.status(200).json({ message: 'Foydalanuvchiga tegishli barcha natijalar muvaffaqiyatli o\'chirildi.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'O\'chirishda xatolik yuz berdi.' });
    }
};




module.exports = {
    verifyAdminToken,
    getSubjectDetails,
    deleteQuestion,
    deleteResult,
};

























