import { Router } from 'express'
import {
    getAllScenes, 
    getScene, 
    getAllCharFromScene,
    getOneCharFromScene,
    getScore,
    postScore,
    coordsCheck, 
    startTime, 
    stopTime,
} from '../controllers/mainController.js'

export const mainRouter = Router()

mainRouter.get('/scene/all', getAllScenes)
mainRouter.get('/scene/:slug', getScene)

mainRouter.get('/scene/:slug/allchar', getAllCharFromScene)
mainRouter.get('/scene/:slug/char/:charId', getOneCharFromScene)

mainRouter.get('/scene/:slug/check', coordsCheck)

mainRouter.get('/scene/:slug/leaderboard', getScore)
mainRouter.post('/scene/:slug/leaderboard', postScore)

mainRouter.post('/scene/:slug/start', startTime)
mainRouter.post('/scene/:slug/:sessId/stop', stopTime)