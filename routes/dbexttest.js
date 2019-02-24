var express = require('express');
var router = express.Router();
var db = require('../config/configDB');

/* POST test data. */
router.post('/', function(req, res, next) {
  
  console.log('/dbexttest', req.body);
  res.json({testType:'external'+req.body.name ,genTime: 1000, conTime: 100, loadTime: 20000});

});

module.exports = router;