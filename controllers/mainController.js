import { prisma } from "../lib/prisma.js";

export async function getAllScenes (req, res) {
    try {
        const allScenes = await prisma.scene.findMany({ include: { characters: true } })
        return res.status(200).json({ allScenes })
    } catch (error) {
        console.log(error)
    }
}

export async function getScene(req, res) {
    const { slug } = req.params
    try {
        const scene = await prisma.scene.findUnique({ where: { slug }, include: { characters: true } })
        return res.status(200).json({ scene })
    } catch (error) {
        console.log(error)
    }
}sceneId

export async function getOneCharFromScene (req, res) {
    const { slug, charId } = req.params
    try {
        const scene = await prisma.scene.findUnique({ where: { slug } })
        const char = await prisma.character.findUnique({ where: { id: charId, sceneId: scene.id  } })
        return res.status(200).json({ char })
    } catch (error) {
        console.log(error)
    }
}

export async function getAllCharFromScene(req, res) {
    const { slug } = req.params
    try {
        const scene = await prisma.scene.findUnique({ where: { slug } })
        const allChar = await prisma.character.findMany({ where: { sceneId: scene.id } })
        return res.status(200).json({ allChar })
    } catch (error) {
        console.log(error)
    }
}

export async function getAllScoreByScene (req, res) {
    const { slug } = req.params
    try {
        const scene = await prisma.scene.findUnique({ where: { slug } })
        const allScores = await prisma.score.findMany({ where: { sceneId: scene.id } })
        return res.status(200).json({ allScores })
    } catch (error) {
        console.log(error)
    }
}

export async function postScore (req, res) {
    const { slug } = req.params
    const { playerName, timeMs } = req.body
    try {
        const scene = await prisma.scene.findUnique({ where: { slug } })
        const score = await prisma.score.create({
            data: {
                playerName, 
                timeMs, 
                sceneId: scene.id
            }
        })
    } catch (error) {
        console.log(error)
    }
}
