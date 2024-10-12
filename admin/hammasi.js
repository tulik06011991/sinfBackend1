
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
const getSubjectDetails = async (req, res) => {
    try {
        const subjectId = req.params.subjectId; // URL'dan subjectId olindi

        // subjectId bo'yicha foydalanuvchilarning javoblarini olish
        const answers = await Answer.find({ subjectId })
            .populate('userId', 'name') // Foydalanuvchining ismi
            .populate({
                path: 'questionId',
                populate: {
                    path: 'subject', // Savolning fani haqida ham ma'lumot olamiz
                    model: 'Subject'
                }
            });

        // Agar javoblar topilmasa, `Question` modelidan savollarni olish
        if (!answers.length) {
            const questions = await Question.find({ subject: subjectId }) // Fanni bo'yicha savollarni olish
                .populate('subject'); // Fanning ma'lumotlari

            if (!questions.length) {
                return res.status(404).json({ message: 'Subject bo\'yicha savollar topilmadi.' });
            }

            // Savollarni variantlari bilan birga qaytarish
            const questionsWithOptions = questions.map((question) => ({
                questionId: question._id,
                questionText: question.question, // Savol matni
                options: question.options, // Variantlar
                subject: question.subject // Fanning ma'lumotlari
            }));

            return res.status(200).json({
                subjectId,
                userResults: [], // Foydalanuvchi natijalari yo'q
                questionsWithOptions // Faqat savollar va ularning variantlari qaytariladi
            });
        }

        // Har bir foydalanuvchining natijalarini saqlash uchun array
        const userResults = [];
        const allQuestionsWithOptions = []; // Barcha savollar va variantlar
        const addedQuestionIds = new Set(); // Takrorlanishni oldini olish uchun savol ID'larni saqlash

        // Foydalanuvchilarni takrorlanmas qilib olish (unique)
        const users = [...new Set(answers.map(answer => answer.userId._id.toString()))]; // Foydalanuvchilarning unique ro'yxati

        // Har bir foydalanuvchining javoblarini hisoblash
        for (let userId of users) {
            const userAnswers = answers.filter(answer => answer.userId._id.toString() === userId);

            let correctAnswersCount = 0;

            for (let userAnswer of userAnswers) {
                const question = userAnswer.questionId;
                const selectedOption = userAnswer.selectedOption;
                const correctAnswer = question.correctAnswer;

                // Agar savol ID allaqachon to'plamga qo'shilmagan bo'lsa, uni qo'shamiz
                if (!addedQuestionIds.has(question._id.toString())) {
                    allQuestionsWithOptions.push({
                        questionId: question._id,
                        questionText: question.question,
                        options: question.options,
                        selectedOption: selectedOption,
                        correctAnswer: correctAnswer,
                        subject: question.subject
                    });
                    addedQuestionIds.add(question._id.toString());
                }

                // Agar tanlangan variant to'g'ri javobga mos kelsa, ball qo'shamiz
                if (selectedOption === correctAnswer) {
                    correctAnswersCount++;
                }
            }

            const totalQuestions = userAnswers.length;
            const correctPercentage = totalQuestions > 0 ? ((correctAnswersCount / totalQuestions) * 100).toFixed(2) : 0;

            userResults.push({
                userId: userAnswers[0].userId._id,
                userName: userAnswers[0].userId.name,
                totalQuestions,
                correctAnswersCount,
                correctPercentage
            });
        }

        // Foydalanuvchilarning natijalari va savollarni qaytarish
        res.status(200).json({
            subjectId,
            userResults, // Foydalanuvchilar natijalari
            questionsWithOptions: allQuestionsWithOptions // Savollar va ularning variantlari
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ma\'lumotlarni olishda xatolik yuz berdi.' });
    }
};




const deleteQuestion = async (req, res) => {
    const  {questionId}  = req.params;
// console.log(questionId)

    try {
        const question = await Question.findByIdAndDelete(questionId);
        if (!question) {
            return res.status(404).json({ message: 'Savol topilmadi.' });
        }

        
        res.status(200).json({ message: 'Savol muvaffaqiyatli o\'chirildi.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Savolni o\'chirishda xatolik yuz berdi.' });
    }
}; 


const deleteResult = async (req, res) => {
    const { id } = req.params; // userId ni req.params dan olamiz
   

    try {
        // Natijani userId bo'yicha o'chirish
        const result = await Answer.deleteMany({ userId: id }); // userId ga tegishli barcha natijalarni o'chiradi

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

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { TailSpin } from 'react-loader-spinner';
// import { useNavigate } from 'react-router-dom';
// import { FaTrash } from 'react-icons/fa';

// const Dashboard = () => {
//   const [subjects, setSubjects] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [selectedSubject, setSelectedSubject] = useState(null);
//   const [subjectDetails, setSubjectDetails] = useState(null);
//   const [savollar, setsavollar] = useState({});
//   const navigate = useNavigate();

//   // Token tekshiruvi va yo'naltirish
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       navigate('/'); // Token bo'lmasa login sahifasiga yo'naltirish
//     }
//   }, [navigate]);

//   // Fanlar ro'yxatini olish
//   const fetchSubjects = async () => {
//     setLoading(true);
//     setError('');

//     try {
//       const token = localStorage.getItem('token');
//       const fanId = localStorage.getItem('fanId');

//       if (!token) {
//         navigate('/');
//         setError('Token topilmadi. Iltimos, qayta login qiling.');
//         return;
//       }

//       const response = await axios.post(
//         `http://localhost:5000/api/subjects`,
//         { fanId },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setSubjects(response.data.subjects);
//     } catch (err) {
//       setError("Ma'lumotlarni olishda xatolik yuz berdi.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Foydalanuvchini o'chirish va interfeysdan yangilash
//   const handleDeleteUsers = async (id) => {
//     setLoading(true);

//     try {
//       const token = localStorage.getItem('token');

//       if (!token) {
//         throw new Error('Token topilmadi. Iltimos, qayta login qiling.');
//       }

//       // Foydalanuvchini o'chirish so'rovi
//       await axios.delete(`http://localhost:5000/admin/users/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       // O'chirilgan foydalanuvchini interfeysdan olib tashlash
//       const updatedResults = subjectDetails.userResults.filter(
//         (result) => result.userId !== id
//       );
//       setSubjectDetails((prev) => ({
//         ...prev,
//         userResults: updatedResults,
//       }));
//     } catch (err) {
//       console.error('Xatolik yuz berdi:', err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Savollarni o'chirish va interfeysdan yangilash
//   const handleDelete = async (id) => {
//     setLoading(true);

//     try {
//       const token = localStorage.getItem('token');

//       if (!token) {
//         throw new Error('Token topilmadi. Iltimos, qayta login qiling.');
//       }

//       await axios.delete(`http://localhost:5000/admin/subjects/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       // O'chirilgan savolni interfeysdan olib tashlash
//       const updatedQuestions = savollar.filter((question) => question._id !== id);
//       setsavollar(updatedQuestions);
      
//     } catch (err) {
//       setError("O'chirishda xatolik yuz berdi.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Tanlangan fan bo'yicha savollarni olish
//   const handleSubjectClick = async (subject) => {
//     setLoading(true);
//     setSelectedSubject(subject);
//     setError('');
//     setSubjectDetails(null);

//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(
//         `http://localhost:5000/admin/subjects/${subject._id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
// console.log(response);


//       setsavollar(response.data.questionsWithOptions);
//       setSubjectDetails(response.data);
//     } catch (err) {
//       setError("Ma'lumotlarni olishda xatolik yuz berdi.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };
//   console.log(savollar)

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-indigo-600 to-purple-600 flex flex-col items-center justify-center p-6">
//       <div className="bg-white shadow-2xl rounded-xl p-6 md:p-8 w-full max-w-7xl">
//         <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Admin Dashboard</h1>

//         <h2 className="text-2xl font-semibold text-gray-700 mb-6">Fanlar ro'yxati</h2>

//         <button
//           onClick={fetchSubjects}
//           className="mb-6 w-full py-3 px-6 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300"
//         >
//           Fanlarni yuklash
//         </button>

//         {loading && (
//           <div className="flex justify-center items-center">
//             <TailSpin height="50" width="50" color="blue" ariaLabel="loading" />
//           </div>
//         )}

//         {error && <div className="text-red-600 text-center mb-6">{error}</div>}

//         <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {subjects.length > 0 ? (
//             subjects.map((subject) => (
//               <li
//                 key={subject._id}
//                 onClick={() => handleSubjectClick(subject)}
//                 className="cursor-pointer p-4 border border-gray-300 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200 text-gray-800"
//               >
//                 {subject.name}
//               </li>
//             ))
//           ) : (
//             <li className="text-gray-500 italic text-center col-span-full">Fanlar topilmadi.</li>
//           )}
//         </ul>

//         {selectedSubject && subjectDetails && (
//           <div className="mt-8 bg-gray-100 p-6 rounded-lg shadow-lg">
//             <h3 className="text-2xl font-semibold text-gray-700 mb-6">Savollar va Foydalanuvchilar</h3>

//             <h4 className="text-lg font-bold mt-6">Savollar:</h4>
//             <table className="table-auto w-full bg-white shadow-lg rounded-lg">
//               <thead className="bg-indigo-600 text-white">
//                 <tr>
//                   <th className="px-4 py-2">Savol</th>
//                   <th className="px-4 py-2">Variantlar</th>
//                   <th className="px-4 py-2">Amallar</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {savollar && savollar.length > 0 ? (
//                   savollar.map((question, index) => (
//                     <tr key={index} className="border-b border-gray-300">
//                       <td className="px-4 py-2">{question.questionText}</td>
//                       <td className="px-4 py-2">
//                         <ul>
//                           {question.options.map((option) => (
//                             <li key={option._id} className={option.isCorrect ? 'text-green-500' : ''}>
//                               {option.text}
//                             </li>
//                           ))}
//                         </ul>
//                       </td>
//                       <td className="px-4 py-2 text-center">
//                         <button
//                           onClick={() => handleDelete(question.questionId)}
//                           className="text-red-600 hover:text-red-800"
//                         >
//                           <FaTrash />
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="3" className="text-gray-500 italic text-center py-4">
//                       Savollar topilmadi.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>

//             <h4 className="text-lg font-bold mt-6">Foydalanuvchilar:</h4>
//             <table className="table-auto w-full bg-white shadow-lg rounded-lg">
//               <thead className="bg-indigo-600 text-white">
//                 <tr>
//                   <th className="px-4 py-2">Foydalanuvchi</th>
//                   <th className="px-4 py-2">Natija</th>
//                   <th className="px-4 py-2">Amallar</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {subjectDetails.userResults.length > 0 ? (
//                   subjectDetails.userResults.map((result) => (
//                     <tr key={result.userId} className="border-b border-gray-300">
//                       <td className="px-4 py-2">{result.userName}</td>
//                       <td className="px-4 py-2">{result.correctAnswersCount}/{result.totalQuestions}</td>
//                       <td className="px-4 py-2 text-center">
//                         <button
//                           onClick={() => handleDeleteUsers(result.userId)}
//                           className="text-red-600 hover:text-red-800"
//                         >
//                           <FaTrash />
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="3" className="text-gray-500 italic text-center py-4">
//                       Foydalanuvchilar topilmadi.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
