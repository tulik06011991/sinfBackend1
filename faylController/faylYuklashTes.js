const path = require('path');
const mammoth = require('mammoth');
const Question = require('../Model/questionModel');

// Fayldan savollar va variantlarni extract qilish va saqlash
const parseWordFile = async (filePath, subjectId) => {
    try {
        const data = await mammoth.extractRawText({ path: filePath });
        const content = data.value;
        const questions = extractQuestions(content);

        // Savollar ro'yxati bo'sh yoki noto'g'ri formatda bo'lsa, xatolikni qaytarish
        if (!questions || questions.length === 0) {
            throw new Error('No valid questions found in the Word file.');
        }

        // MongoDB ga savollarni saqlash
        for (let questionData of questions) {
            const newQuestion = new Question({
                question: questionData.question,
                options: questionData.options.map(option => ({
                    text: option.text.replace(/^\./, ''), // Nuqtani olib tashlaymiz
                    isCorrect: option.isCorrect
                })),
                correctAnswer: questionData.correctAnswer,
                subject: subjectId // Fan ID'sini kiritamiz
            });
            await newQuestion.save(); // Savollarni saqlash
        }

        return questions;
    } catch (error) {
        // console.error('Error parsing Word file:', error);
        throw new Error('Failed to process the Word file. Please check the format and try again.');
    }
};

// Savollar va variantlarni olish funksiyasi
const extractQuestions = (content) => {
    const lines = content.split('\n'); // Faylni qatorlar bo'yicha bo'lamiz
    let questions = [];
    let currentQuestion = {}; // Hozirgi savol

    lines.forEach((line) => {
        // Savolni olish: savol raqami bilan boshlanadi, masalan "1."
        const questionMatch = line.match(/^\d+\./);
        if (questionMatch) {
            // Agar oldingi savol mavjud bo'lsa, uni savollar ro'yxatiga qo'shamiz
            if (currentQuestion.question) {
                if (!currentQuestion.correctAnswer) {
                    // Agar to'g'ri javob aniqlanmagan bo'lsa, birinchi variantni tanlaymiz
                    currentQuestion.correctAnswer = currentQuestion.options.find(opt => opt.isCorrect)?.text || currentQuestion.options[0].text;
                }
                questions.push(currentQuestion);
            }
            // Yangi savolni boshlash
            currentQuestion = {
                question: line.trim(), // Savol matnini tozalaymiz
                options: [], // Variantlar ro'yxati
                correctAnswer: null // To'g'ri javobni aniqlash
            };
        }

        // Bir qator ichida bir nechta variantlar mavjud bo'lsa, ularni ajratib olish
        let optionRegex = /(\.?[A-D])[).]\s*([^A-D]*)/g; // "A)" yoki ".A)" ko'rinishdagi variantlarni qidirish
        let match;
        while ((match = optionRegex.exec(line)) !== null) {
            let optionLabel = match[1]; // A, B, C, D va ularning oldidagi nuqta
            let optionText = match[2].trim(); // Variantning matni

            // Agar variant oldida nuqta bo'lsa, uni to'g'ri variant deb belgilaymiz
            let isCorrect = optionLabel.startsWith('.');

            // Variantni qo'shamiz
            currentQuestion.options.push({
                text: optionText, // Variant matni
                isCorrect: isCorrect // To'g'ri javob bo'lsa belgilaymiz
            });

            // Agar to'g'ri variant bo'lsa, uni currentQuestion.correctAnswer ga o'rnatamiz
            if (isCorrect) {
                currentQuestion.correctAnswer = optionText; // To'g'ri javobni saqlaymiz
            }
        }
    });

    // Oxirgi savolni qo'shish, to'g'ri javob aniqlanmagan bo'lsa, birinchi variantni tanlaymiz
    if (currentQuestion.question) {
        if (!currentQuestion.correctAnswer) {
            currentQuestion.correctAnswer = currentQuestion.options.find(opt => opt.isCorrect)?.text || currentQuestion.options[0].text;
        }
        questions.push(currentQuestion);
    }

    return questions; // Barcha savollarni qaytaramiz
};

// Fayl yuklash va savollarni extract qilish
const uploadQuestions = async (req, res) => {
    try {
        const filePath = req.file.path;
        const { subjectId } = req.body; // Fan ID'sini request body'dan olamiz
        const questions = await parseWordFile(filePath, subjectId);
        res.json({ questions });
    } catch (error) {
        // console.error('Error extracting questions:', error.message);
        res.status(400).json({ message: 'Failed to extract questions from the file. Please check the file format.' });
    }
};

module.exports = {
    uploadQuestions
};
