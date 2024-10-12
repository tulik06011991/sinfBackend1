const express = require('express'); // express'ni to'g'ri yozish
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const questionRoutes = require('./routes/faylYuklashRoute');
const quizRoutes = require('./routes/savollar');
const adminRoutes = require('./routes/adminlar')

const fanlar2 = require('./routes/fanlar2')
const fanOlish = require('./routes/fanlarOlish')
const auth  = require('./routes/auth')
const javob = require('./routes/Javoblar')
const adminFan = require('./routes/adminFan')
const hammasi = require('./routes/hammasi')// questionRoutes'ni import qilish
const cors = require("cors")
const path = require('path');




const privateCorsOptions = {
    origin: 'https://60-maktabsinf.netlify.app',
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'], // maxsus 'Authorization' talab qilinadi
};

const publicCorsOptions = {
    origin: 'https://60-maktabsinf.netlify.app',
    methods: 'GET, POST DELETE',
    allowedHeaders: ['Content-Type'], // faqat 'Content-Type'ga ruxsat beriladi
};

const oson = {
    origin: 'https://60-maktabsinf.netlify.app',
    methods: ' POST',
    // faqat 'Content-Type'ga ruxsat beriladi
};

app.use(express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', cors(publicCorsOptions), questionRoutes)
app.use('/api', cors(publicCorsOptions), quizRoutes);
app.use('/api', cors(privateCorsOptions), adminRoutes);

app.use('/api', cors(publicCorsOptions), fanlar2)
app.use('/api', cors(publicCorsOptions), fanOlish)
app.use('/api', cors(oson), auth)
app.use('/api', cors(publicCorsOptions), javob)
app.use('/admin', cors(publicCorsOptions), adminFan)
app.use('/admin', cors(publicCorsOptions), hammasi)
// MongoDB ga ulanish
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, );
        console.log('MongoDB Atlas bilan ulanish o\'rnatildi');
    } catch (error) {
        console.error('MongoDB Atlas bilan ulanishda xato:', error.message);
        process.exit(1); // Xato bo'lsa serverni to'xtatadi
    }
};

// MongoDB ulanishini chaqirish
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


