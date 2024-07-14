const OTP = require("../../models/otp");
const ApiError = require("../../errors/ApiError");
const httpStatus = require("http-status");
const generateOTPTemplate = require("../../utils/generate-otp-template");
const nodemailer = require("nodemailer")
const User = require("../../models/user");
const config = require("../../config")


const isValidOtp = async(payload) => {
    return OTP.findOne({email: payload.email, isVerified: true});
}


const createOtp = async(payload) => {
    const foundOtp = await isValidOtp(payload);
    if (foundOtp) {
        return foundOtp
    }

    const generateOtp = Math.round(Math.random() * 1000000).toString().padStart(6, '0');

    const mailOptions = {
        from: config.email_user,
        to: payload.email,
        subject: 'Verify your email',
        html: generateOTPTemplate(generateOtp),
    };

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.email_user,
            pass: config.email_password,
        },
    });

    const newOtp = new OTP({
        email: payload.email,
        otp: generateOtp,
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000,
    });

    await transporter.sendMail(mailOptions);
    await newOtp.save();
    return newOtp;
}

const verifyOtp = async(payload) => {
    const foundOtp = await OTP.findOne({email: payload.email});

    if(!foundOtp) throw new ApiError(httpStatus.NOT_FOUND, "OTP not found")
    if(foundOtp.otp !== payload.otp) throw new ApiError(httpStatus.CONFLICT, "OTP not matched")
    if(foundOtp.isVerified) throw new ApiError(httpStatus.CONFLICT, "OTP already verified")


    const newUser = new User({
        email: foundOtp.email
    })
    await newUser.save();


    return OTP.findOneAndUpdate({ email: payload.email }, {
        isVerified: true,
    }, {
        new: true
    });
}
module.exports = {
    createOtp,
    verifyOtp
}