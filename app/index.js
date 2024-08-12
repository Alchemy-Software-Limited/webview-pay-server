/*-------------register user-----------*/
// app.post('/register', async (req, res) => {
// 	const { firstName, lastName, email, password } = req.body;
//
// 	try {
// 		// Check if the user already exists in the database
// 		const existingUser = await User.findOne({ email });
// 		if (existingUser) {
// 			return res.status(409).json({ message: 'User already exists' });
// 		}
//
// 		// Hash the password
// 		const hashedPassword = await bcrypt.hash(password, 10);
//
// 		// Create a new user instance
// 		const newUser = new User({
// 			firstName,
// 			lastName,
// 			email,
// 			password: hashedPassword,
// 		});
//
// 		// Save the user to the database
// 		const savedUser = await newUser.save();
//
// 		res.status(201).json({ message: 'User registered successfully', data: savedUser });
// 	} catch (error) {
// 		console.error(error);
// 		res.status(500).json({ message: 'Server error' });
// 	}
// });
/*-------------register user-----------*/
/*----------------delete all data----------------*/
// app.get('/delete-all', async (req, res) => {
// 	try {
// 		// Get all the collection names in the database
// 		const collections = await mongoose.connection.db.collections();
//
// 		// Iterate over each collection and delete all documents
// 		for (let collection of collections) {
// 			await collection.deleteMany({});
// 		}
//
// 		res.send('All documents deleted successfully');
// 	} catch (error) {
// 		res.status(500).send('An error occurred while deleting documents');
// 	}
// });
/*----------------delete all data----------------*/

require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const authenticate = require('../middlewares/auth')
const ApiError = require('../errors/ApiError')
const httpStatus = require('http-status')
const sendResponse = require('../utils/send-response')
const { createOtp, verifyOtp } = require('../lib/otp')
const { generateJwtToken } = require('../helpers/jwt-helpers')
const config = require('../config')
const { rateLimit } = require('express-rate-limit')
const { getPlans, getPlanById } = require('../lib/plans')
const {
    createCustomer,
    createSubscription,
    cancelSubscription,
    getSubscription,
} = require('../lib/customer')
const {
    notFoundErrorHandler,
    globalErrorHandler,
} = require('../middlewares/error')

const app = express()
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    )
    next()
})
app.use(
    cors({
        origin: 'https://webview-pay.vercel.app',
    })
)
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use('/images', express.static('public/images'))
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per 15 minutes
    // Other options (e.g., custom messages, status codes) can be configured
    message: 'Too many requests!',
    statusCode: httpStatus.TOO_MANY_REQUESTS,
    legacyHeaders: false,
    standardHeaders: true,
    handler: (req, res, next, options) => {
        next(options)
    },
})
app.use(limiter)

app.get('/', (_req, res) => {
    res.send('APPLICATION SERVER IS UP')
})

/* Main business logics start
 * =========================== */
/*--------------login-------------*/
app.post('/auth/login', async (req, res, next) => {
    try {
        const { ...loginData } = req.body

        const data = await createOtp(loginData)
        const payload = {
            email: data.email,
            isVerified: data.isVerified,
        }
        const token = generateJwtToken(
            payload,
            config.jwt.jwt_secret,
            config.jwt.jwt_expires
        )
        res.cookie('el_token', token, {
            secure: process.env.APP_ENV !== 'development',
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7,
            sameSite: process.env.APP_ENV === 'development' ? 'lax' : 'none',
        })
        // Send the token as the response
        sendResponse(res, {
            status: httpStatus.OK,
            success: true,
            message: payload.isVerified
                ? 'Login successful'
                : 'OTP is sent to email',
            data: {
                token,
            },
        })
    } catch (e) {
        console.log('hit catch')
        next(e)
    }
})
/*--------------login-------------*/

/*---------------verify otp-----------------*/
app.post('/otp/verify', authenticate, async (req, res, next) => {
    try {
        const { email } = req.user
        const { ...otpData } = req.body
        const data = await verifyOtp({
            ...otpData,
            email,
        })
        if (!data)
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                'OTP verification failed'
            )
        const payload = {
            email: data.email,
            isVerified: data.isVerified,
        }
        const token = generateJwtToken(
            payload,
            config.jwt.jwt_secret,
            config.jwt.jwt_expires
        )
        res.cookie('el_token', token, {
            secure: process.env.APP_ENV !== 'development',
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7,
            sameSite: process.env.APP_ENV === 'development' ? 'lax' : 'none',
        })
        const result = {
            ...data,
            token,
        }
        sendResponse(res, {
            status: httpStatus.OK,
            success: true,
            message: 'OTP verification successful',
            data: result,
        })
    } catch (e) {
        next(e)
    }
})
/*---------------verify otp-----------------*/

/*------get plans -------------*/
app.get('/plans', async (req, res, next) => {
    try {
        const plans = await getPlans()
        sendResponse(res, {
            status: httpStatus.OK,
            success: true,
            message: 'Plans retrieved successfully',
            data: plans,
        })
    } catch (e) {
        next(e)
    }
})
/*------get plans -------------*/

/*------------get plan by id-------------*/
app.get('/plans/:id', async (req, res, next) => {
    try {
        const priceId = req.params.id
        const plan = await getPlanById(priceId)
        sendResponse(res, {
            status: httpStatus.OK,
            success: true,
            message: 'Plan retrieved successfully',
            data: plan,
        })
    } catch (e) {
        next(e)
    }
})
/*------------get plan by id-------------*/

/*-----------create customer----------*/
// app.post('/create-customer/:pId', authenticate, async (req, res, next) => {
//     const { email } = req.user
//     const { pId } = req.params
//     const payload = {
//         email,
//         pId,
//     }
//     try {
//         const customer = await createCustomer(payload)
//     } catch (e) {
//         next(e)
//     }
// })
/*-----------create customer----------*/

/*--------------create subscription------------*/
app.post('/create-subscription/:pId', authenticate, async (req, res, next) => {
    try {
        const { priceId, tokenId } = req.body
        const { pId } = req.params
        const email = req.user.email
        const sub = await createSubscription({ email, priceId, pId, tokenId })
        sendResponse(res, {
            status: httpStatus.OK,
            success: true,
            message: 'Subscription added successfully!',
            data: sub,
        })
    } catch (e) {
        next(e)
    }
})
/*--------------create subscription------------*/

/*-------------cancel subscription------*/
app.patch(
    '/cancel-subscription/:subId',
    authenticate,
    async (req, res, next) => {
        try {
            const { subId } = req.params
            const { email } = req.user
            const data = await cancelSubscription({ subId, email })
            sendResponse(res, {
                status: httpStatus.OK,
                success: true,
                message: 'Subscription cancelled successfully!',
                data,
            })
        } catch (e) {
            next(e)
        }
    }
)
/*-------------cancel subscription------*/

/*-------------get subscription-----------*/
app.get('/subscription', authenticate, async (req, res, next) => {
    try {
        const { email } = req.user
        const sub = await getSubscription({ email })
        sendResponse(res, {
            status: httpStatus.OK,
            success: true,
            message: 'Subscription retrieved successfully!',
            data: sub,
        })
    } catch (e) {
        next(e)
    }
})
/*-------------get subscription-----------*/

/*--------------logout-------------*/
app.post('/auth/logout', async (req, res, next) => {
    await req.clearCookie()
    req.headers.authorization = null
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Logged out!',
        data: null,
    })
})
/*--------------logout-------------*/

//error handlers
app.use(notFoundErrorHandler)
app.use(globalErrorHandler)

module.exports = app
