import app from './api/app.js';
import centralErrorHandler from './api/utils/centralErrorHandler.js';

const port = 8080;

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