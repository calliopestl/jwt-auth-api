const express = require('express');
const mongoose = require('mongoose');
const cors = require ('cors');
const dbConfig = require ('./database/db');


// express apis
const api = require('./routes/auth.routes');

// MongoDB connection

mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Database connected')
}, 
    error => {
        console.log("Database can't be connected: " + error)
        
    }
)

// remove MongoDB warning error
mongoose.set('useCreateIndex', true);

// express settings

const app = express();
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cors());

// serve static resources

app.use('/public', express.static('public'));

app.use('/api', api)

// define PORT

const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
    console.log('Connected to port ' + port)
})

// express error handling

app.use((req, res, next) => {
    setImmediate(() => {
        next(new Error('Something went wrong'));
    });
});

app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});