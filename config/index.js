const dotenv = require('dotenv')
const path = require('path')

dotenv.config({ path: path.join(process.cwd(), '.env') })

module.exports = {
    env: process.env.NODE_ENV,
    db_uri: process.env.DB_URI,
    db_port: process.env.DB_PORT,
    db_name: process.env.DB_NAME,
    client_local: process.env.CLIENT_LOCAL,
    client_prod: process.env.CLIENT_PROD,
    jwt: {
        jwt_secret: process.env.JWT_SECRET,
        jwt_expires: process.env.JWT_EXPIRES,
    },
    stripe: {
        secret_key: process.env.STRIPE_SECRET_KEY,
        private_key: process.env.STRIPE_PRIVATE_KEY,
    },
    email_user: process.env.EMAIL_USER,
    email_password: process.env.EMAIL_PASSWORD,
}
