import express from 'express'
import { configDotenv } from 'dotenv'
configDotenv()
import { mainRouter } from './routes/mainRouter.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', mainRouter)

const PORT = process.env.PORT || 3000

app.listen(PORT, (err) => {
    console.log(`Running on PORT: ${PORT}`)
    if (err) throw err
})
