const mongoose = require("mongoose");
const config = require("../config/index")


// Set up the MongoDB connection
mongoose.connect(config.db_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to the database');
});

process.on('SIGTERM', () => {
    console.log('Stopping server gracefully...');
    db.close()
    // Gracefully exit the server process
    process.exit(0);
})

module.exports = db;