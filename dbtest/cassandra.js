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
  fixtime,
  valid,
  latitude,
  longitude,
  altitude,
  speed,
  course,
  attributes
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;


var intTest = function (callbackTest) {

  var cassandraConnection = db.filter(function(obj) {
    return obj.name === dbName;
  });
  
  if (cassandraConnection.length === 0) return callbackTest("No connection data"); 

  // var client = new cassandra.Client({ contactPoints: ['localhost']});
  var client = new cassandra.Client(cassandraConnection[0].connection);

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
  async.mapLimit(urls, 5, async function(url) {
    const response = await fetch(url)
    return response.body
    }, (err, results) => {
        if (err) throw err
        // results is now an array of the response bodies
        console.log(results)
        stopLoad = new Date();
    });

  client.execute('select key from system.local', function(err, result) {
    if (err) throw err;
    console.log(result.rows[0]);
  });
};

module.exports.intTest = intTest;
