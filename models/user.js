// Define the MongoDB schema and model
const mongoose = require("mongoose");
const {Schema} = require("mongoose");

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