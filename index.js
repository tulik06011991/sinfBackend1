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




const corsOptions = {
    origin: 'https://60-maktabsinf.netlify.app', // Faqat shu URL ruxsat etilgan
    methods: 'GET, POST, PUT, DELETE', // kerakli HTTP metodlar
   // ruxsat etilgan headerlar
};


app.use(cors(corsOptions)); // CORSni sozlash

app.use(express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api',  questionRoutes)
app.use('/api',  quizRoutes);
app.use('/api',  adminRoutes);

app.use('/api',  fanlar2)
app.use('/api',  fanOlish)
app.use('/api',  auth)
app.use('/api',  javob)
app.use('/admin',  adminFan)
app.use('/admin',  hammasi)
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


