var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var testData = require('../data/trackData');
var config = require('../config/config');
var db = require('../config/configDB');
var dbName = 'MongoDB';
var async = require("async");


function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

var intTest = function (callbackTest) {
    /* check data for connection */
    var mongoConnection = db.filter(function(obj) {
        return obj.name === dbName;
      });
      
    if (mongoConnection.length === 0) return callbackTest("No connection data"); 
    
    /* Connect to DB */
    var startCon = new Date();
    MongoClient.connect(mongoConnection[0].connection, { useNewUrlParser: true }, function(err, dblink) {
    if (err) {
        throw err;
    }
    var stopCon = new Date();

    /* Data generation */
    var startGen = new Date();
    var insertDataArr = [];
    for (let index = 0; index < config.test.intCount; index++) {
        var insertData = JSON.parse(JSON.stringify(testData)); 
        insertData.devicetime = randomDate(config.test.startDateRange, config.test.endDateRange);
        insertData.id = index;
        insertData.servertime = randomDate(config.test.startDateRange, config.test.endDateRange);
        insertDataArr.push(insertData);
    }
    var stopGen = new Date();
    
    /* Insert data into DB */
    
    const myDB = dblink.db('local');
    const collection = myDB.collection('documents');


    collection.drop();
    
   var startLoad = new Date();
    async.mapLimit(insertDataArr, 5, 
        (dbData,callback) => {
            var dat = dbData;
            dat._id = new ObjectID();
            collection.insertOne(dat)
            .then(result => {
                // const { insertedId } = result;
                // Do something with the insertedId
                // console.log( `Inserted document with _id: ${insertedId}` );
                callback();
             });
        }, 
        (err, results) => {
            if (err) throw err;
            // results is now an array of the response bodies
            // console.log(results);
            stopLoad = new Date();
            callbackTest(null,{
              testType:`Internal ${config.test.intCount} rows insert into MongoDB`,
              genTime: stopGen-startGen, 
              conTime: stopCon-startCon, 
              loadTime: stopLoad-startLoad});
        });

    });
};

var intTestSelect = function (callbackTest) {
    console.log('query test');
    /* check data for connection */
    var mongoConnection = db.filter(function(obj) {
        return obj.name === dbName;
      });
      
    if (mongoConnection.length === 0) return callbackTest("No connection data"); 
    
    /* Connect to DB */
    var startCon = new Date();
    MongoClient.connect(mongoConnection[0].connection, { useNewUrlParser: true }, function(err, dblink) {
    if (err) {
        throw err;
    }
    var stopCon = new Date();

    /* Data generation */
    var startGen = new Date();
    var queryDataArr = [];
    for (let index = 0; index < config.test.selectCount; index++) {
        var query = {};
        var midleDataRange = randomDate(config.test.startDateRange, config.test.endDateRange);
        var servertime = {};
        servertime.$gte = randomDate(config.test.startDateRange, midleDataRange);
        servertime.$lte = randomDate(midleDataRange,config.test.endDateRange);
        query.servertime = servertime;
        queryDataArr.push(query);
    }
    var stopGen = new Date();
    
    /* Insert data into DB */
    
   const myDB = dblink.db('local');
   const collection = myDB.collection('documents');
    
   var startLoad = new Date();
    async.mapLimit(queryDataArr, 5, 
        (query,callback) => {
            // console.log(query);
            collection.find(query).limit(5)
            .toArray(function(err, docs) {
                // console.log( `Find documents count: ${docs.length}` );
                callback();
              });
        }, 
        (err, results) => {
            if (err) throw err;
            // results is now an array of the response bodies
            // console.log(results);
            stopLoad = new Date();
            callbackTest(null,{
              testType:`Internal ${config.test.selectCount} data range query MongoDB`,
              genTime: stopGen-startGen, 
              conTime: stopCon-startCon, 
              loadTime: stopLoad-startLoad});
        });

    });
};

module.exports.intTestSelect = intTestSelect;
module.exports.intTest = intTest;