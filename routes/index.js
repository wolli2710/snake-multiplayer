var express = require('express');
var router = express.Router();
var config = require('./../config.js');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Snake', protocol: config.server.protocol, host: config.server.host, port: config.server.port });
});

module.exports = router;
