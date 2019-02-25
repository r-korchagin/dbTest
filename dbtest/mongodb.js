var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var testData = require('../data/trackData');
var config = require('../config/config');
var db = require('../config/configDB');
var dbName = 'MongoDB';
var async = require("async");

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
        testData.devicetime = new Date();
        testData.id = index;
        testData.servertime = new Date();
        insertDataArr.push(testData);
    }
    var stopGen = new Date();
    
    /* Insert data into DB */
    var startLoad = new Date();
    const myDB = dblink.db('local');
    const collection = myDB.collection('documents');

    /*
    insertDataArr.forEach((val) => {
        var dat = val;
            dat._id = new ObjectID();
            collection.insertOne(dat)
            .then(result => {
                const { insertedId } = result;
                // Do something with the insertedId
                console.log( `Inserted document with _id: ${insertedId}` );
                callback();
             });
    });
    */

    async.mapLimit(insertDataArr, 1, 
        (dbData,callback) => {
            var dat = dbData;
            dat._id = new ObjectID();
            collection.insertOne(dat)
            .then(result => {
                const { insertedId } = result;
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
              testType:'Internal MongoDB',
              genTime: stopGen-startGen, 
              conTime: stopCon-startCon, 
              loadTime: stopLoad-startLoad});
        });

    });
};

module.exports.intTest = intTest;