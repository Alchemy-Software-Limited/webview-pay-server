const NodeCache = require('node-cache')
const cache = new NodeCache()

const syncCache = (req, _res, next) => {
    req.cache = cache
    next()
}

module.exports = syncCache
