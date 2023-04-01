/**
 * Validate request object
 * @param {Object} schema
 * @returns
 */
const metricsMiddleware = (api) => (req, res, next) => {
    //console.log(api);
    global.statsD.increment(api);
    return next();
};

export default metricsMiddleware;