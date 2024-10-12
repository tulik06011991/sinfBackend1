// pdfController.js
const fs = require('fs');
const PDFDocument = require('pdfkit');
const Results = require('../Model/pdf'); // Natijalar model

// Foydalanuvchilar natijalarini PDF formatida yuklab olish
const downloadUserResultsPDF = async (req, res) => {
    try {
        const subjectId = req.params.subjectId;

        // Natijalarni olish
        const results = await Results.find({ subjectId: subjectId })
            .populate('userId', 'name'); // Foydalanuvchi ismini olish

        const doc = new PDFDocument();
        const filePath = `results-${subjectId}.pdf`;
        doc.pipe(fs.createWriteStream(filePath));

        // PDFga yozish
        doc.fontSize(20).text(`Natijalar - Fan ID: ${subjectId}`, { align: 'center' });
        doc.moveDown();

        results.forEach(result => {
            doc.fontSize(12).text(`Foydalanuvchi: ${result.userId.name}`);
            doc.text(`To'g'ri javoblar soni: ${result.correctAnswersCount}`);
            doc.text(`Umumiy savollar soni: ${result.totalQuestions}`);
            doc.text(`To'g'ri javoblar foizi: ${result.correctPercentage}%`);
            doc.moveDown();
        });

        doc.end();

        // PDFni yuklash
        res.download(filePath, (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('PDFni yuklashda xatolik yuz berdi.');
            }
            // PDF faylini serverdan o'chirish
            fs.unlink(filePath, (err) => {
                if (err) console.error(err);
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Natijalarni PDF formatida olishda xatolik yuz berdi.' });
    }
};

module.exports = {
    downloadUserResultsPDF,
};
