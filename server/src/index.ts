import express, { Express } from 'express';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 80;

const app: Express = express();

app.get('/', (req, res) => {
    res.send('The server is up and running!');
});

const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
