const sendResponse = (response, responseData) => {
    const {status, message, success, data, meta, stack} = responseData;
    return response.status(status).json({
        success,
        message,
        data: data ?? null,
        meta: meta ?? null,
        stack: stack ?? null
    })
}

module.exports = sendResponse