import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
dotenv.config();
const app = express();
const port = process.env.PORT || 3002;
app.use(bodyParser.json());
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.send('Express + TypeScript Server 12312');
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
