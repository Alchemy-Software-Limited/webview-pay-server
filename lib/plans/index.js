const stripe = require("../../helpers/stripe");
const ApiError = require("../../errors/ApiError");
const httpStatus = require("http-status");
const getSymbolFromCurrency = require('currency-symbol-map')

const getPlans = async() => {
    const products = await stripe.products.list({});
    const result = [];
    for (const pd of products.data) {
        if(!pd.active) continue;
        const price = await stripe.prices.retrieve(pd.default_price);
        result.push({
            pId: pd.id,
            priceId: price.id,
            name: pd.name,
            active: pd.active,
            features: pd.features.reduce((acc, cur) => {
                acc.push(cur.name);
                return acc;
            }, []),
            price: `${
                price.unit_amount % 100 === 0
                    ? price.unit_amount / 100
                    : (price.unit_amount / 100).toFixed(2)
            }${getSymbolFromCurrency(price.currency.toUpperCase())}`,
            description: pd.description,
        });
    }
    if(!result.length){
        throw new ApiError(httpStatus.NOT_FOUND, 'No plans available');
    }
    return result;
}


const getPlanById = async(priceId) => {
    const price = await stripe.prices.retrieve(priceId);
    if (!price) {
        throw new ApiError(httpStatus.NOT_FOUND,'Price not found');
    }

    const product = await stripe.products.retrieve(price.product)
    if (!product) {
        throw new ApiError( httpStatus.NOT_FOUND, 'Product not found');
    }

    // console.log('price: ', price);
    // console.log('product: ', product);
    // return plan;
}

module.exports = {
    getPlans,
    getPlanById
}