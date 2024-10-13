const Subject = require('../Model/Fanlar'); // Subject modelini import qilamiz
const Admin = require('../Model/adminlar'); // Admin modelini import qilamiz

// Fanlar ro'yxatini olish va fanId bo'yicha filtrlash
const getSubjects = async (req, res) => {
  const id  = req.body
  

  try {
    let subjects;
    if (id) {
      // fanId bo'yicha fanlarni olamiz
      subjects = await Subject.find({ _id: id }).select('name'); // Faqat fan nomini olamiz
    } else {
      return res.status(400).json({ message: 'FanId berilmagan!' });
    }

    res.status(200).json({ subjects }); // Fanlarni muvaffaqiyatli qaytarish
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fanlarni olishda xato yuz berdi!' });
  }
};
// const getSubject = async (req, res) => {
//   const { id } = req.params 
  // Paramsdan fanId ni olamiz
// console.log(id)

//   try {
//     let subjects;
//     if (id) {
//       // fanId bo'yicha fanlarni olamiz
//       subjects = await Subject.find().select('name'); // Faqat fan nomini olamiz
//     } else {
//       return res.status(400).json({ message: 'FanId berilmagan!' });
//     }

//     res.status(200).json({ subjects }); // Fanlarni muvaffaqiyatli qaytarish
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Fanlarni olishda xato yuz berdi!' });
//   }
// };

// Hamma fanlar ro'yxatini olish
const getSubject = async (req, res) => {
  try {
    // Hamma fanlarni olamiz
    const subjects = await Subject.find().select('name'); // Faqat fan nomlarini olamiz

    res.status(200).json({ subjects }); // Fanlarni muvaffaqiyatli qaytarish
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fanlarni olishda xato yuz berdi!' });
  }
};

module.exports = {
  getSubjects,
 
  getSubject
};
