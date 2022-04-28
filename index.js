var express = require('express');
var bodyParser = require('body-parser');
const { MongoClient } = require("mongodb"); 
const dotenv = require('dotenv');
const process = require('process');

dotenv.config()

const mongo_uri = process.env.MONGO_URI;
const mongo_client = new MongoClient(mongo_uri);
mongo_client.connect();
const database = mongo_client.db('bikes');
const bikes = database.collection('bikes');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.listen(6001, function() {
    console.log('***********************************');
    console.log('listening:', 6001);
    console.log('***********************************');
});

app.get('/all_bikes', async function(req, res){
    console.log("Getting available bikeIds");
    var ids = await (await bikes.distinct('bikeid')).sort((a,b) => a - b);
    res.send(ids);
});

app.get('/locations/:bikeId', async function(req, res){
    console.log(`Getting all locations for bike with id ${req.params.bikeId}`);
    const bikes_loc = database.collection('bikeid_locations');
    var locations = await bikes_loc.findOne({
        '_id': parseInt(req.params.bikeId)
      });
    res.send(locations);
});

app.get('/dates/:year/:month/:day/:hour', async function(req, res){
    var year = parseInt(req.params.year);
    var month = parseInt(req.params.month);
    var day = parseInt(req.params.day);
    var hour = parseInt(req.params.hour);
    console.log(`Getting locations for date ${year}-${month}-${day} at ${hour} o'clock`);
    const bikes_loc = database.collection('bike_locations_by_datehour');
    var locations = await bikes_loc.findOne({
        '_id.date.year': year, 
        '_id.date.month': month, 
        '_id.date.day': day, 
        '_id.date.hour': hour
    });
    res.send(locations);
});
