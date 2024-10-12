const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Admin Schema
const adminSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Admin ismi
    email: { type: String, required: true, unique: true }, // Login (email)
    password: { type: String, required: true }, // Parol
    subject: { type: String, required: true }, // Admin bog'langan fan nomi
    role: { type: String, default: 'admin' }, // Adminning roli, default 'admin'
    createdAt: { type: Date, default: Date.now }
});

// Parolni saqlashdan oldin hash qilish
adminSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Parolni tekshirish
adminSchema.methods.comparePassword = async function (inputPassword) {
    return await bcrypt.compare(inputPassword, this.password);
};

// Admin modelini eksport qilish
const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
