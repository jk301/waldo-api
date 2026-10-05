import { prisma } from "../lib/prisma.js";

export async function getAllScenes (req, res) {
    try {
        const allScenes = await prisma.scene.findMany()
        return res.status(200).json({ allScenes })
    } catch (error) {
        console.log(error)
    }
}

export async function getScene(req, res) {
    const { slug } = req.params
    try {
        const scene = await prisma.scene.findUnique({ 
            where: { slug }, 
            include: { characters: { select: { id: true, name: true } } } 
        })
        return res.status(200).json({ scene })
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

export async function coordsCheck (req, res) {
    const { slug } = req.params
    const x = Number(req.query.x)
    const y = Number(req.query.y)

    if (Number.isNaN(x) || Number.isNaN(y)) {
        return res.status(400).json({ error: "Invalid coordinates" })
    }

    function isInsideRadius (x, y, charX, charY, rSqred) {
        const subX = x - charX
        const subY = y - charY
        const addedSub = Math.pow(subX, 2) + Math.pow(subY, 2)
        return (addedSub <= rSqred) 
    }

    try {
        const scene = await prisma.scene.findUnique({ where: { slug } })
        if (!scene) return res.status(404).json({ error: "Scene not found" })
        const allChar = await prisma.character.findMany({ where: { sceneId: scene.id } })
        
        for (const char of allChar) {
            const result = isInsideRadius(x, y, char.x, char.y, char.radius ** 2)
            if (result) {
                return res.status(200).json({ hit: true, name: char.name })
            }
        }

        return res.json({ hit: false })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Server error" })
    }
}

export async function getScore (req, res) {
    const { slug } = req.params

    try {
        const scene = await prisma.scene.findUnique({ where: { slug } })
        if (!scene) return res.status(404).json({ error: "Scene not found" })
        
        const scores = await prisma.score.findMany({
            where: { sceneId: scene.id }, 
            orderBy : [
                { timeMs: 'asc' }, 
                { createdAt: 'asc' }
            ]
        })

        return res.status(200).json({ scores, title: scene.title })
    } catch (error) {``
        console.log(error)
        return res.status(500).json({ error: 'Server' })
    }
}

export async function postScore (req, res) {
    const { slug } = req.params
    const { playerName, sessId } = req.body
    try {
        const scene = await prisma.scene.findUnique({ where: { slug } })
        if (!scene) return res.status(404).json({ error: "Scene not found" })
        
        const session = await prisma.gameSession.findUnique({ where: { id: sessId } })
        if (!session) return res.status(404).json({ error: "Session not found" })
        
        const score = await prisma.score.create({
            data: {
                playerName, 
                timeMs: session.finishedAt - session.startedAt, 
                sceneId: scene.id
            }
        })
        await prisma.gameSession.delete({ where: { id: sessId } })
        
        return res.json({ message: `Score added to LB-${slug}` })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Server error" })
    }
}

export async function startTime (req, res) {
    const { slug } = req.params
    try {
        const scene = await prisma.scene.findUnique({ where: { slug } })
        if (!scene) return res.status(404).json({ error: "Scene not found" })
        const start = await prisma.gameSession.create({ data: { sceneId: scene.id } })
        console.log('session created')
        return res.json({ id: start.id })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Server error" })
    }
}

export async function stopTime(req, res) {
  const { sessId } = req.params
  try {
    const session = await prisma.gameSession.update({
      where: { id: sessId },
      data: { finishedAt: new Date() },
    })
    if (!session) return res.status(404).json({ error: "Session not found" })

    const timeMs = session.finishedAt - session.startedAt

    const MIN_MS = 3000
    if (timeMs < MIN_MS) return res.status(400).json({ error: "Time too short" })

    return res.json({ timeMs })

  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: "Server error" })
  }
}