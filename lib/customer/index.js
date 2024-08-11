const stripe = require("../../helpers/stripe");
const User = require("../../models/user");
const ApiError = require("../../errors/ApiError");
const httpStatus = require("http-status");
const {SUBSCRIPTION_STATUS} = require("./constants");


const createCustomer = async(payload) => {

    //test
    const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: {
            number: '4242424242424242',
            exp_month: 8,
            exp_year: 2024,
            cvc: '314',
        },
    });
    // console.log('payment method: ', paymentMethod);
    //test

    const customer = await stripe.customers.create({
        email: payload.email,
        // name: payload.username,
        metadata: {
            productId: payload.pId,
        },
        payment_method: paymentMethod.id,
        invoice_settings: {
            default_payment_method: paymentMethod.id,
        }
    });

    return User.findOneAndUpdate(
        { email: customer.email },
        {
            custId: customer.id,
        },
        {
            new: true,
        },
    );
}


const createSubscription = async(payload) => {

    const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: {
            token: payload.tokenId,
        },
    });


    const customer = await stripe.customers.create({
        email: payload.email,
        // name: payload.username,
        metadata: {
            productId: payload.pId,
        },
        payment_method: paymentMethod.id,
        invoice_settings: {
            default_payment_method: paymentMethod.id,
        }
    });

    const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: payload.priceId }],
        default_payment_method: customer.invoice_settings
            .default_payment_method,
    });

    return User.findOneAndUpdate(
        { email: customer.email },
        {
            custId: customer.id,
            subscriptionId: subscription.id,
            subscriptionStatus: SUBSCRIPTION_STATUS.PREMIUM
        },
        {
            new: true,
        },
    );
}


const getSubscription = async(payload)=> {
    const user = await User.findOne({email: payload.email});

    if(!user || !user.subscriptionId) throw new ApiError(httpStatus.BAD_REQUEST, "Bad request!")

    const subscription = await stripe.subscriptions.retrieve(
        user.subscriptionId
    );

    return subscription;
}


const cancelSubscription = async(payload) => {
    const deleted = await stripe.subscriptions.cancel(payload.subId);

    if (deleted.status !== 'canceled') {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            'Unsuccessful attempt to cancel subscription!',
        );
    }

    const existSubscription = await User.findOne({subscriptionId: deleted.id});
    if (!existSubscription){
        throw new ApiError(
            httpStatus.NOT_FOUND,
            'No subscription found!',
        );
    }

    return User.findOneAndUpdate(
        { email: payload.email },
        { $unset: { subscriptionId: 1, custId: 1 }, $set: {subscriptionStatus: SUBSCRIPTION_STATUS.BASIC} },
        { new: true })
}

const findUserByProperty = async(filter) => {
    const user = await User.findOne(filter);
    if(!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found")
    return user;
}

module.exports = {
    createCustomer,
    createSubscription,
    cancelSubscription,
    getSubscription,
    findUserByProperty
}
