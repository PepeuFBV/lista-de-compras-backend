var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import { connect, getConnection } from '@/database/mongo.database';
import { isItem } from '@/types/item';
import { ObjectId } from 'mongodb';
dotenv.config();
const app = express();
const allowedOrigins = [process.env.CLIENT_URL];
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else if (!origin || origin === undefined) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};
app.use(cors(corsOptions));
const port = process.env.PORT || 3002;
app.use(bodyParser.json());
app.use(express.static('public'));
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
app.get('/', (req, res) => {
    res.send('Express + TypeScript Server');
});
app.get('/items', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { collection } = yield getConnection();
        const items = yield collection.find().toArray();
        res.send({ items });
    }
    catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).send({ error: 'Failed to fetch items' });
    }
}));
app.post('/items', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newItem = req.body;
    try {
        if (!isItem(newItem)) {
            return res.status(400).send({ error: 'Invalid item format' });
        }
        const { collection } = yield getConnection();
        const result = yield collection.insertOne(newItem);
        return res.send({ result });
    }
    catch (error) {
        return res.status(500).send({ error: 'Failed to add item' });
    }
}));
app.put('/items', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedItem = req.body;
    try {
        if (!isItem(updatedItem)) {
            return res.status(400).send({ error: 'Invalid item format' });
        }
        const { collection } = yield getConnection();
        const result = yield collection.updateOne({ _id: updatedItem._id }, { $set: updatedItem });
        return res.send({ result });
    }
    catch (error) {
        return res.status(500).send({ error: 'Failed to update item' });
    }
}));
app.delete('/items', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.id;
    try {
        const { collection } = yield getConnection();
        const result = yield collection.deleteOne({ _id: new ObjectId(id) });
        return res.send({ result });
    }
    catch (error) {
        return res.status(500).send({ error: 'Failed to delete item' });
    }
}));
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connect();
        console.log(`[server]: Server is running at http://localhost:${port}`);
    }
    catch (error) {
        console.error('Failed to connect to MongoDB', error);
    }
}));
