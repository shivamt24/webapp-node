/**
 *  Response Handler
 * @param {Object} res
 * @param {Object} data
 * @param {Number} responseCode
 */
const responseHandler = (res, data, responseCode = 200) => {
    //const success = !(responseCode >= 400 && responseCode <= 599);
    if (data === undefined) {
        responseCode = 204;
    }
    res.status(responseCode).send(data);
};

export default responseHandler;