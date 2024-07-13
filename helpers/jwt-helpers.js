const jwt = require("jsonwebtoken");

const generateJwtToken = (
    payload,
    secret,
    expiresTime
) => {
    return jwt.sign(payload, secret, {
        expiresIn: expiresTime,
    })
}

const verifyToken = (token, secret) => {
    return jwt.decode(token, {
        secret: secret
    })
}


module.exports = {
    generateJwtToken,
    verifyToken,
}
