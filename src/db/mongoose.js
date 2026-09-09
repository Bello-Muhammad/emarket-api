const mongoose = require("mongoose");


mongoose.set('strictQuery', true).connect(process.env.MONGODB_URL).then(() => {
    console.log('Database connected successfully🗃️🗃️');
}).catch((error) => {
    console.error('Database connection failed: ', error.message)
})