const mongoose = require('mongoose');

// Variantlar schema
const optionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    isCorrect: { type: Boolean, required: true }
});

// Savollar schema
const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: [optionSchema], // Variantlar
    correctAnswer: { type: String, required: true }, // To'g'ri javob
    subject: { 
        type: mongoose.Schema.Types.ObjectId, // Fan ID'sini qabul qiladi
        ref: 'Subject', // Fanlar modeliga havola qilamiz
        required: true
    }
});

// Savollar modelini yaratish
const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
