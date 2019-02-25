var express = require('express');
var router = express.Router();
var db = require('../config/configDB');

/* GET home page. */
router.get('/', function(req, res, next) {
  
  var dbList = db.map(function(val){ return {
    name1: 'Server side insert test ' + val.name,
    name2: 'API ' + val.name,
    name3: 'Server side query test ' + val.name,
    btn1click: 'fetchTest("' + val.name + '")',
    btn2click: 'fetchTestFromClient("' + val.name + '")',
    btn3click: 'fetchSelectTest("' + val.name + '")',
    descr: 'Test result for ' + val.name,
    descrid: val.name + 'descr'
  }; });

  res.render('index', { 
    title: 'DB Test Data Loading',
    dlist: dbList
   });

});

module.exports = router;
