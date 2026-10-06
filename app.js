import express from 'express'
import cors from 'cors'
import { configDotenv } from 'dotenv'
configDotenv()
import { mainRouter } from './routes/mainRouter.js'

const app = express()

app.use(cors({
    origin: ['http://localhost:5173', 'https://where-might-waldo-be.netlify.app']
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', mainRouter)

const PORT = process.env.PORT || 3000

app.listen(PORT, (err) => {
    console.log(`Running on PORT: ${PORT}`)
    if (err) throw err
})
