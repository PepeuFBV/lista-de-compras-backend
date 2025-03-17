import { MongoClient, Db, Collection } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

function checkEnvVariables() {
    if (!process.env.MONGO_DATABASE) {
        throw new Error('MONGO_DATABASE is required')
    }
    if (!process.env.MONGO_COLLECTION) {
        throw new Error('MONGO_COLLECTION is required')
    }
    if (!process.env.MONGO_USER) {
        throw new Error('MONGO_USER is required')
    }
    if (!process.env.MONGO_PASSWORD) {
        throw new Error('MONGO_PASSWORD is required')
    }
    if (!process.env.MONGO_CLUSTER) {
        throw new Error('MONGO_CLUSTER is required')
    }
    return
}

const username: string = encodeURIComponent(process.env.MONGO_USER as string)
const password: string = encodeURIComponent(process.env.MONGO_PASSWORD as string)
const cluster: string = process.env.MONGO_CLUSTER as string
const settings: string = process.env.MONGO_SETTINGS as string

const uri: string = `mongodb+srv://${username}:${password}@${cluster}/${settings}`

const client = new MongoClient(uri, {
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
    }
})

async function connect() {
    try {
        checkEnvVariables()
        await client.connect()
        console.log('Connected to MongoDB')
    } catch (error) {
        console.error('Error connecting to MongoDB', error)
        console.error('URI:', uri)
        throw error
    }
}

async function getClient() {
    try {
        checkEnvVariables()
        await client.db().admin().ping()
        return client
    } catch (error) {
        console.error('Error getting MongoClient', error)
        console.error('URI:', uri)
        throw new Error('MongoClient is not connected')
    }
}

async function getConnection(): Promise<{ db: Db, collection: Collection }> {
    if (process.env.MONGO_COLLECTION === undefined) throw new Error('MONGO_COLLECTION environment variable is required')
    const client = await getClient()
    const db = client.db(process.env.MONGO_DATABASE)
    const collection = db.collection(process.env.MONGO_COLLECTION)
    return { db, collection }
}

export { connect, getClient, getConnection, checkEnvVariables }
