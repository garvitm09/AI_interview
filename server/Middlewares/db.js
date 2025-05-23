const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://garvitbkn10:garvit@garvitm09.cm9avcf.mongodb.net/AI_Interview')
    .then(() => {
        console.log('MongoDB Connected...');
    }).catch((err) => {
        console.log('MongoDB Connection Error: ', err);
    })