var cassandra = require('cassandra-driver');
var db = require('../config/configDB');
var config = require('../config/config');
var testData = require('../data/trackData');
var dbName = 'Cassandra';
var async = require("async");
var cassandraQuery = `INSERT INTO tbl (
  id,
  protocol,
  deviceid,
  servertime,
  devicetime,
  valid,
  latitude,
  longitude,
  altitude,
  speed,
  course,
  attributes
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;


var client;


var intTest = function (callbackTest) {

  var cassandraConnection = db.filter(function(obj) {
    return obj.name === dbName;
  });
  
  if (cassandraConnection.length === 0) return callbackTest("No connection data"); 

  // var client = new cassandra.Client({ contactPoints: ['localhost']});
  var startCon = new Date();
  client = new cassandra.Client(cassandraConnection[0].connection);
  var stopCon = new Date();  

  var startGen = new Date();
  var insertDataArr = [];
  for (let index = 0; index < config.test.intCount; index++) {
    testData.devicetime = new Date();
    testData.id = index;
    testData.servertime = new Date();
    insertDataArr.push(testData);
  }
  var queryparams = [];
  for (let index = 0; index < config.test.intCount; index++) {
    queryparams.push(
      [
        insertDataArr[index].id,
        insertDataArr[index].protocol,
        insertDataArr[index].deviceid,
        insertDataArr[index].servertime,
        insertDataArr[index].devicetime,
        insertDataArr[index].validid,
        insertDataArr[index].latitude,
        insertDataArr[index].longtitude,
        insertDataArr[index].altitude,
        insertDataArr[index].speed,
        insertDataArr[index].course,
        insertDataArr[index].speed,
        insertDataArr[index].atributes,
      ]
    );
  }
  
  /* Stop time data generation */
  var stopGen = new Date();

  var startLoad = new Date();
  async.mapLimit(queryparams, 5, client.execute('select key from system.local', function(err, result) {
    if (err) throw err;
    console.log(result.rows[0]);
  }), (err, results) => {
        if (err) throw err;
        // results is now an array of the response bodies
        console.log(results);
        stopLoad = new Date();
        callbackTest(null,{
          testType:'Internal Cassandra',
          genTime: stopGen-startGen, 
          conTime: stopCon-startCon, 
          loadTime: stopLoad-startLoad});
    });
};



// module.exports.intTestSelect = intTestSelect;
module.exports.intTest = intTest;
