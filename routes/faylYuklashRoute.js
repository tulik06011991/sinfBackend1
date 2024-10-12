const express = require('express');
const multer = require('multer');
const path = require('path');
const {uploadQuestions} = require('../faylController/faylYuklashTes'); // To'g'ridan-to'g'ri import
const router = express.Router();
const fs = require('fs');


// Multer konfiguratsiyasi
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, '/uploads');
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + path.extname(file.originalname)); // unique filename
//     }
// });


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = './uploads/';
        fs.mkdirSync(uploadPath, { recursive: true }); // Upload katalogi mavjud bo'lmasa yaratadi
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

 const upload = multer({ storage: storage });


// Word fayl yuklash va savollarni extract qilish
router.post('/upload', upload.single('file'), uploadQuestions); // Callback sifatida funksiya

module.exports = router;
