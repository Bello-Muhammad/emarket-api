const express = require("express");
const apiRouters = require("./routers");
require('./db/mongoose');

const app = express()
const port = process.env.PORT ?? 3000;
const version = process.env.VERSION;

//setting express middlewars
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(`${version}`, apiRouters)

app.listen(port, () => {
    console.info(`Server started successfully 🚀🚀 on port ${port}`)
})