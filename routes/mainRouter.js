import { Router } from 'express'
import {
    getAllScenes, 
    getScene, 
    getAllCharFromScene,
    getOneCharFromScene,
    postScore,
    coordsCheck
} from '../controllers/mainController.js'

export const mainRouter = Router()

mainRouter.get('/scene/all', getAllScenes)
mainRouter.get('/scene/:slug', getScene)

mainRouter.get('/scene/:slug/allchar', getAllCharFromScene)
mainRouter.get('/scene/:slug/char/:charId', getOneCharFromScene)

mainRouter.get('/scene/:slug/check', coordsCheck)

mainRouter.post('/scene/:slug', postScore)