import app from './api/app.js';
import centralErrorHandler from './api/utils/centralErrorHandler.js';
import * as dotenv from 'dotenv';
import loggerMiddleware from './api/middlewares/logger.middleware.js';
import models, {
    sequelize
} from './api/models/index.js';

dotenv.config();
const port = process.env.SERVERPORT;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

sequelize.sync()
    .then(() => {
        console.log("Synced db.");
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message);
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