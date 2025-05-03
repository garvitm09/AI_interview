const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://garvitm09:garvit@garvitdb.azkifoa.mongodb.net/Ai_interview')
    .then(() => {
        console.log('MongoDB Connected...');
    }).catch((err) => {
        console.log('MongoDB Connection Error: ', err);
    })