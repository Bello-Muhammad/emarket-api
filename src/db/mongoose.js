const mongoose = require('mongoose')


mongoose.connect(process.env.MONGODB_UR, {
    useNewUrlParser: true,
    useCreateIndex: true,
})


