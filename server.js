import app from './api/app.js';
import centralErrorHandler from './api/utils/centralErrorHandler.js';
import * as dotenv from 'dotenv';
dotenv.config();
const port = process.env.SERVERPORT;

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});

// Centralized error handler
app.use((err, req, res, next) => {
    centralErrorHandler(err, res);
});

process.on('uncaughtException', (error) => {
    centralErrorHandler(error);
});

process.on('unhandledRejection', (reason) => {
    centralErrorHandler(reason);
});