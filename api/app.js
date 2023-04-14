import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import errorHandlerMiddleware from './middlewares/error.middleware.js';
import loggerMiddleware, {errorLoggerMiddleware} from './middlewares/logger.middleware.js';
import formData from 'express-form-data';
import lynx from 'lynx';
import * as dotenv from 'dotenv';

dotenv.config();
const app = express();
global.statsD = new lynx(process.env.STATSD_HOST, process.env.STATSD_PORT);
//middleware
app.use(cors());
app.use(express.json()); // Parse json
app.use(express.urlencoded({
    extended: true,
}));
app.use(formData.parse());
//app.use(formData.format()); // Format null key value pairs
app.use(formData.union()); // Merging the req.files object to our req.body object
app.use(formData.stream()); // Convert our files to stream 
app.use(loggerMiddleware);

app.get('/healthz', (req, res) => {
    global.statsD.increment('healthCheck');
    res.status(200).send('Ok');
});

app.get('/healthzz', (req, res) => {
    global.statsD.increment('healthCheck');
    res.status(200).send('Ok Healthz');
});

//routes
routes(app);
app.use(errorLoggerMiddleware);
app.use(errorHandlerMiddleware);

export default app;