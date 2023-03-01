import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import errorHandlerMiddleware from './middlewares/error.middleware.js';
import formData from 'express-form-data';

const app = express();
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


app.get('/healthz', (req, res) => {
    res.status(200).send('Ok');
});

//routes
routes(app);
app.use(errorHandlerMiddleware);

export default app;