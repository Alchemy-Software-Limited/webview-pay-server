const {createOtp} = require("../otp")
const {generateJwtToken} = require("../../helpers/jwt-helpers");
const config = require("../../config")

const loginService = async (user) => {
    console.log('hit')

        const data = await createOtp(user);
        const payload = {
            email: data.email,
            isVerified: data.isVerified,
        };
        return generateJwtToken(payload, config.jwt.jwt_secret, config.jwt.jwt_expires);

}

module.exports = {
    loginService
}