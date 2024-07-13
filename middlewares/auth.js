const ApiError = require("../errors/ApiError");
const config = require("../config/index");
const JwtHelpers = require("../helpers/jwt-helpers");
const httpStatus = require("http-status");

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token || !token.startsWith('Bearer ')) {
            throw new ApiError(httpStatus.UNAUTHORIZED, "You aren't authorized");
        }

        const tokenValue = token.split(' ')[1];
        const verifiedUser = JwtHelpers.verifyToken(tokenValue, config.jwt.jwt_secret);
        // if (requiredRoles.length > 0) {
        //     // Check if the user has the required roles
        //     const hasRequiredRoles = requiredRoles.some(role => verifiedUser.roles.includes(role));
        //     if (!hasRequiredRoles) {
        //         throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
        //     }
        // }

        req.user = verifiedUser;
        next();
    } catch (error) {
        // Log the error or send a custom error response
        next(error);
    }
};

module.exports = auth;
