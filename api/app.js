import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import errorHandlerMiddleware from './middlewares/error.middleware.js';

const app = express();
//middleware
app.use(cors());
app.use(express.json()); // Parse json
app.use(express.urlencoded({
    extended: true,
}));

app.get('/healthz', (req, res) => {
    res.status(200).send('Ok');
});

//routes
routes(app);
app.use(errorHandlerMiddleware);

export default app;