var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();
function checkEnvVariables() {
    if (!process.env.MONGO_DATABASE) {
        throw new Error('MONGO_DATABASE is required');
    }
    if (!process.env.MONGO_COLLECTION) {
        throw new Error('MONGO_COLLECTION is required');
    }
    if (!process.env.MONGO_USER) {
        throw new Error('MONGO_USER is required');
    }
    if (!process.env.MONGO_PASSWORD) {
        throw new Error('MONGO_PASSWORD is required');
    }
    if (!process.env.MONGO_CLUSTER) {
        throw new Error('MONGO_CLUSTER is required');
    }
    if (!process.env.PORT) {
        throw new Error('PORT is required');
    }
    return;
}
const username = encodeURIComponent(process.env.MONGO_USER);
const password = encodeURIComponent(process.env.MONGO_PASSWORD);
const cluster = process.env.MONGO_CLUSTER;
const settings = process.env.MONGO_DATABASE;
const uri = `mongodb+srv://${username}:${password}@${cluster}/${settings}`;
const client = new MongoClient(uri, {
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
    }
});
function connect() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            checkEnvVariables();
            yield client.connect();
            console.log('Connected to MongoDB');
        }
        catch (error) {
            console.error('Error connecting to MongoDB', error);
            console.error('URI:', uri);
            throw error;
        }
    });
}
function getClient() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            checkEnvVariables();
            yield client.db().admin().ping();
            return client;
        }
        catch (error) {
            console.error('Error getting MongoClient', error);
            console.error('URI:', uri);
            throw new Error('MongoClient is not connected');
        }
    });
}
function getConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.env.MONGO_COLLECTION === undefined)
            throw new Error('MONGO_COLLECTION environment variable is required');
        const client = yield getClient();
        const db = client.db(process.env.MONGO_DATABASE);
        const collection = db.collection(process.env.MONGO_COLLECTION);
        return { db, collection };
    });
}
export { connect, getClient, getConnection, checkEnvVariables };
