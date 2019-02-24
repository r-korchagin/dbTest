var express = require('express');
var router = express.Router();
var db = require('../config/configDB');

/* GET home page. */
router.get('/', function(req, res, next) {
  
  var dbList = db.map(function(val){ return {
    name1: 'Server ' + val.name,
    name2: 'API ' + val.name,
    btn1click: 'fetchTest("' + val.name + '")',
    btn2click: 'fetchTestFromClient("' + val.name + '")',
    descr: 'Test result for ' + val.name,
    descrid: val.name + 'descr'
  }; });

  res.render('index', { 
    title: 'DB Test Data Loading',
    dlist: dbList
   });

});

module.exports = router;
