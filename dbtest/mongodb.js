var MongoClient = require('mongodb').MongoClient;
var testData = require('../data/trackData');
var db = require('../config/configDB');
var dbName = 'MongoDB';
var async = require("async");

var intTest = function (callbackTest) {
    var mongoConnection = db.filter(function(obj) {
        return obj.name === dbName;
      });
      
    if (mongoConnection.length === 0) return callbackTest("No connection data"); 

    var startCon = new Date();
    MongoClient.connect(mongoConnection[0].connection, function(err, dblink) {
    if (err) {
        throw err;
    }
    var stopCon = new Date();
    var startGen = new Date();
    var insertDataArr = [];
    for (let index = 0; index < config.test.intCount; index++) {
        testData.devicetime = new Date();
        testData.id = index;
        testData.servertime = new Date();
        insertDataArr.push(testData);
    }
    var stopGen = new Date();
    
    var startLoad = new Date();
    const collection = db.collection('documents');
  // Insert some documents
    collection.insertMany([
        insertDataArr
    ], function(err, result) {
        if (err) throw err;
        var stopLoad = new Date();
        callbackTest(null,{
            testType:'Internal Cassandra',
            genTime: stopGen-startGen, 
            conTime: stopCon-startCon, 
            loadTime: stopLoad-startLoad});
    });
    });
};


