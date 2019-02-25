var express = require('express');
var router = express.Router();
var db = require('../config/configDB');
var cassandra = require('../dbtest/cassandra');
var mongo = require('../dbtest/mongodb');

/* POST test data. */
router.post('/', function(req, res, next) {
  console.log('/dbinttest', req.body);
  switch (req.body.name) {
    case 'Cassandra':
      // res.json({testType:'internal'+req.body.name ,genTime: 1000, conTime: 100, loadTime: 20000});
      cassandra.intTest(function (err,result) {
        if (err) throw err;
        res.json(result);
      });
      break;
    case 'MongoDB':
      // res.json({testType:'internal'+req.body.name ,genTime: 1000, conTime: 100, loadTime: 20000});
      mongo.intTest(function (err,result) {
        if (err) throw err;
        res.json(result);
      });
      break;
    default:
      res.send('No DB for test');
      break;
  }

});

module.exports = router;
