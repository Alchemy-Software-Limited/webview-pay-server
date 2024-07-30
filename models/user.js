// Define the MongoDB schema and model
const mongoose = require("mongoose");
const {Schema} = require("mongoose");
const {SUBSCRIPTION_STATUS} = require("../lib/customer/constants");

const userSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    custId: {
        type: String,
    },
    subscriptionId
: {
        type: String,
    },
    subscriptionStatus: {
        type: String,
        enum: [SUBSCRIPTION_STATUS.PREMIUM, SUBSCRIPTION_STATUS.BASIC],
        default: SUBSCRIPTION_STATUS.BASIC
    }

}, {
    timestamps: true,
})


userSchema.static('isUserExist', async function (key, value){
    return User.findOne(
        { [key]: value }, {email: 1}
    ).lean()
})


const User = mongoose.model('User', userSchema);

module.exports = User