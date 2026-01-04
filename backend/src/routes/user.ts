import express from 'express'

import { User } from '../db/db.ts'
import jwt from 'jsonwebtoken'
const router = express.Router()
const app = express()
const JWT_SECRET = "supersecretkey123"
app.use(express.json())

function userRoutes() {
    router.get('/user', (req, res) => {
        res.json({
            msg: "hii there this is the user routes "
        })
    })
    router.post('/signin', async (req, res) => {
        const { email, password } = req.body;

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({
                msg: "No user found"
            });
        }
        if (user.password !== password) {
            return res.status(401).json({
                msg: "Invalid password"
            });
        }


        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET)




        res.json({
            message: "Login data received"
        });
    })
    router.post('/signup', async (req, res) => {
        const { name, email, password } = req.body;
        console.log(email, password);

        const existinguser = await User.findOne({
            email
        })

        if (existinguser) {
            return res.status(409).json({
                message: "User already exists"
            });
        }
        const user = await User.create({
            name,
            email,
            password
        })



        res.json({
            message: "Login data received signup"
        });
    })
}


export default userRoutes;