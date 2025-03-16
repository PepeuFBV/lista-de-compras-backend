import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
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
app.get('/', (req, res) => {
    res.send('Express + TypeScript Server 12312');
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
