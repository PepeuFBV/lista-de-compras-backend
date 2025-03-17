import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser'
import { connect, getClient } from '@/database/mongo.database'
import type { Item } from '@/types/item'
import { isItem } from '@/types/item'

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

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server')
})

app.get('/items', async (req: Request, res: Response) => {
    console.log('GET /items')
    try {
        if (!process.env.MONGO_DATABASE) {
            throw new Error('MONGO_DATABASE is required')
        }
        if (!process.env.MONGO_COLLECTION) {
            throw new Error('MONGO_COLLECTION is required')
        }
        const client = await getClient()
        const items = await client.db(process.env.MONGO_DATABASE).collection(process.env.MONGO_COLLECTION).find().toArray()
        res.send({ items })
    } catch (error) {
        console.error('Error fetching items:', error)
        res.status(500).send({ error: 'Failed to fetch items' })
    }
})

app.post('/items', async (req: Request, res: Response): Promise<any> => {
    console.log('POST /items')
    const newItem: Item = req.body
    try {
        if (!process.env.MONGO_DATABASE) {
            throw new Error('MONGO_DATABASE is required')
        }
        if (!process.env.MONGO_COLLECTION) {
            throw new Error('MONGO_COLLECTION is required')
        }
        // Validate newItem
        if (!isItem(newItem)) {
            return res.status(400).send({ error: 'Invalid item format' })
        }
        const client = await getClient()
        const result = await client.db(process.env.MONGO_DATABASE).collection(process.env.MONGO_COLLECTION).insertOne(newItem)
        return res.send({ result })
    } catch (error) {
        return res.status(500).send({ error: 'Failed to add item' })
    }
})

app.listen(port, async () => {
    try {
        await connect() // Establish connection to MongoDB
        console.log(`[server]: Server is running at http://localhost:${port}`)
    } catch (error) {
        console.error('Failed to connect to MongoDB', error)
    }
})
