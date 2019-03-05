var pgp = require("pg-promise")(/*options*/);
var db = require('../config/configDB');
var dbName = 'PostgreSQL';
var config = require('../config/config');
var testData = require('../data/trackData');
var async = require("async");
var createTableSQL = `
CREATE TABLE testtable
(
    id serial PRIMARY KEY,
    protocol text,
    deviceid int,
    servertime timestamptz,
    devicetime timestamptz,
    validid int,
    latitude float8,
    longtitude float8,
    altitude float4,
    speed float4,
    course int,
    atributes jsonb
)`;

var indexSQL = `CREATE INDEX index_servertime
    ON testtable (servertime)`;

var insertSQL = 'INSERT INTO testtable( \
    id, protocol, deviceid, servertime, devicetime, validid,\
    latitude, longtitude, altitude, speed, course, atributes\
    ) VALUES( \
    ${id}, ${protocol}, ${deviceid}, ${servertime}, ${devicetime}, ${validid},\
        ${latitude}, ${longtitude}, ${altitude}, ${speed}, ${course}, ${atributes} \
    )';

var selectSQL = 'SELECT * FROM testtable WHERE servertime > ${servertimeStart} \
    AND servertime < ${servertimeEnd} \
    LIMIT ${limit} ';

function randomDate(start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

var intTest = function (callbackTest) {
    /* check data for connection */
    var postgreeConnection = db.filter(function(obj) {
        return obj.name === dbName;
      });
      
    if (postgreeConnection.length === 0) return callbackTest("No connection data"); 
    
    /* Connect to DB */
    var startCon = new Date();
    var stopCon;

    var pgpDB = pgp(postgreeConnection[0].connection);
    pgpDB.connect()
      .then(obj =>{
        sco = obj;
        stopCon = new Date();
        console.log('postgre connected');
        return sco.any('DROP TABLE testtable');
      })
      .then(()=>{
        return sco.any(createTableSQL);
      })
      
      .then(()=>{
        return sco.any(indexSQL);
      })
      
      .then(()=>{
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
        
        var startLoad = new Date();
        async.mapLimit(insertDataArr, config.test.poolSize, 
            (dbData,callback) => {
                var dat = dbData;
                sco.any(insertSQL, dat)
                .then(result => {
                    callback();
                 })
                .catch(error => {
                    console.error(error);
                });
            }, 
            (err, results) => {
                if (err) throw err;
                // results is now an array of the response bodies
                // console.log(results);
                stopLoad = new Date();
                sco.done();
                pgpDB.$pool.end();
                callbackTest(null,{
                  testType:`Internal ${config.test.intCount} rows insert into PostgreSQL`,
                  genTime: stopGen-startGen, 
                  conTime: stopCon-startCon, 
                  loadTime: stopLoad-startLoad});
            });


      })
      .catch(error => {
        sco.done();
        pgpDB.$pool.end();
        console.error(error);
        callbackTest(error);
      });

};

var intTestSelect = function (callbackTest) {
    console.log('query test');
    /* check data for connection */
    var postgreeConnection = db.filter(function(obj) {
        return obj.name === dbName;
      });
      
    if (postgreeConnection.length === 0) return callbackTest("No connection data"); 
    
    /* Connect to DB */
    var startCon = new Date();
    var stopCon;
    var pgpDB = pgp(postgreeConnection[0].connection);
    pgpDB.connect()
    .then(obj =>{
      sco = obj;
      stopCon = new Date();
      console.log('postgre connected');
     
      /* Data generation */
      var startGen = new Date();
      var queryDataArr = [];
      for (let index = 0; index < config.test.selectCount; index++) {
            var query = {};
            var midleDataRange = randomDate(config.test.startDateRange, config.test.endDateRange);
            query.servertimeStart = randomDate(config.test.startDateRange, midleDataRange);
            query.servertimeEnd = randomDate(midleDataRange,config.test.endDateRange);
            query.limit = config.test.limit;
            queryDataArr.push(query);
        }
      var stopGen = new Date();

      /* Query generation */      
      var startLoad = new Date();
      async.mapLimit(queryDataArr, config.test.poolSize, 
          (dbData,callback) => {
              var dat = dbData;
              sco.none(selectSQL, dat)
              .then(result => {
                  callback();
               })
              .catch(error => {
                  console.error(error);
              });
          }, 
          (err, results) => {
              if (err) throw err;
              // results is now an array of the response bodies
              // console.log(results);
              stopLoad = new Date();
              sco.done();
              pgpDB.$pool.end();
              callbackTest(null,{
                testType:`Internal ${config.test.selectCount} rows select from PostgreSQL`,
                genTime: stopGen-startGen, 
                conTime: stopCon-startCon, 
                loadTime: stopLoad-startLoad});
          });
    })
    .catch(error => {
      sco.done();
      pgpDB.$pool.end();
      console.error(error);
      callbackTest(error);
    });
};


module.exports =  { intTestSelect, intTest };