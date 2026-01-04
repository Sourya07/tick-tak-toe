import express from 'express'
import userRoutes from './routes/user.js';
import { User, connectDB } from './db/db.js'
const app = express();
app.use(express.json())


app.use("/v1", userRoutes)
await connectDB();
app.get('/hii', (req, res) => {
    console.log(req.body);
    res.json({
        msg: req.body
    })
})

app.post('/hii', (req, res) => {
    console.log(req.body);
    res.json({
        msg: "hii there "
    })
})

console.log("hii there it is my name")

app.listen(3000, () => {
    console.log("Server is running for this:3000")
})