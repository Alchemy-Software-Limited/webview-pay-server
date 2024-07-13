
const Stripe = require("stripe");
const config = require("../config")

const stripe = new Stripe(config.stripe.secret_key, {
  apiVersion: '2022-11-15',
});

module.exports = stripe


