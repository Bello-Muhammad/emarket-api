import express, { urlencoded }  from "express";
import "./src/db/mongoose.js";

const app = express();
const port = process.env.PORT ?? 3000;

//setting express middlewars
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
    console.info(`Server started successfully 🚀🚀 on port ${port}`)
})