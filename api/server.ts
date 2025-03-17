import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser'
import { connect, getConnection } from '@/database/mongo.database'
import type { Item } from '@/types/item'
import { isItem } from '@/types/item'
import { ObjectId } from 'mongodb'

dotenv.config()

const app: Express = express()

const allowedOrigins = [process.env.CLIENT_URL]
const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        if (allowedOrigins.includes(origin)) {
            callback(null, true)
        } else if (!origin || origin === undefined) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

app.use(cors(corsOptions))
const port = process.env.PORT || 3002

app.use(bodyParser.json())
app.use(express.static('public'))

app.use((req: Request, res: Response, next: () => void) => {
    console.log(`${req.method} ${req.url}`)
    next()
})

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server')
})

app.get('/items', async (req: Request, res: Response) => {
    try {
        const { collection } = await getConnection()
        const items = await collection.find().toArray()
        res.send({ items })
    } catch (error) {
        console.error('Error fetching items:', error)
        res.status(500).send({ error: 'Failed to fetch items' })
    }
})

app.post('/items', async (req: Request, res: Response): Promise<any> => {
    const newItem: Item = req.body
    try {
        if (!isItem(newItem)) {
            return res.status(400).send({ error: 'Invalid item format' })
        }
        const { collection } = await getConnection()
        const result = await collection.insertOne(newItem)
        return res.send({ result })
    } catch (error) {
        return res.status(500).send({ error: 'Failed to add item' })
    }
})

app.put('/items', async (req: Request, res: Response): Promise<any> => {
    const updatedItem: Item = req.body
    try {
        if (!isItem(updatedItem)) {
            return res.status(400).send({ error: 'Invalid item format' })
        }
        const { collection } = await getConnection()
        const result = await collection.updateOne({ _id: updatedItem._id }, { $set: updatedItem })
        return res.send({ result })
    } catch (error) {
        return res.status(500).send({ error: 'Failed to update item' })
    }
})

app.delete('/items', async (req: Request, res: Response): Promise<any> => {
    const id = req.query.id as string
    try {
        const { collection } = await getConnection()
        const result = await collection.deleteOne({ _id: new ObjectId(id) })
        return res.send({ result })
    } catch (error) {
        return res.status(500).send({ error: 'Failed to delete item' })
    }
})

app.listen(port, async () => {
    try {
        await connect()
        console.log(`[server]: Server is running at http://localhost:${port}`)
    } catch (error) {
        console.error('Failed to connect to MongoDB', error)
    }
})
