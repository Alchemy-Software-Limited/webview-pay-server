// Define the MongoDB schema and model
const mongoose = require("mongoose");
const {Schema} = require("mongoose");
const httpStatus = require("http-status");
const ApiError = require("../errors/ApiError");

const otpSchema = new Schema({
    otp:{
        type: String,
        required: true,
        length: [6, "OTP must be of 6 digit length"]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
},)
otpSchema.static('isOtpExist', async function (key, value){
    return OTP.findOne(
        {[key]: value}
    ).lean();
})
otpSchema.pre("save", async function (next) {
    const otp = this;

    try {
        const invalidatedOtp = await OTP.findOne({
            email: otp.email,
            expiresAt: { $lt: new Date() }
        });


        if (invalidatedOtp) {
            await OTP.deleteOne({ _id: invalidatedOtp._id });
            throw new ApiError(httpStatus.BAD_REQUEST, "OTP is expired. Request for a new one.")
        }

        next();
    } catch (error) {
        next(error);
    }
});


const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP