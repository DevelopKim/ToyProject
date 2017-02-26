var express = require('express');
var router = express.Router();
var path = require("path");

var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

// 내가 만든 리스트 함수
var listEvents = require('./calendarList');

var SCOPES = ['https://www.googleapis.com/auth/calendar'];
var TOKEN_DIR = __dirname + ".credentials/";
var TOKEN_PATH = TOKEN_DIR + 'calendar-nodejs-quickstart.json';

/* GET home page. */
router.get('/', function(req, res, next) {

    fs.readFile('client_secret.json', function processClientSecrets(err, content) {
      if (err) {
        console.log('Error loading client secret file: ' + err);
        return;
      }
      authorize(JSON.parse(content), listEvents);
    });


    function authorize(credentials, callback) {
      var clientSecret = credentials.web.client_secret;
      var clientId = credentials.web.client_id;
      var redirectUrl = credentials.web.redirect_uris[0];
      var auth = new googleAuth();
      var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

      fs.readFile(TOKEN_PATH, function(err, token) {
        if (err) {
          getNewToken(oauth2Client, callback);
        } else {
          oauth2Client.credentials = JSON.parse(token);
          callback(oauth2Client);
        }
      });
    }

    function getNewToken(oauth2Client, callback) {
      var authUrl = oauth2Client.generateAuthUrl({
        scope: SCOPES
      });
      console.log('Authorize this app by visiting this url: ', authUrl);

      // 사용자 로그인 화면으로 리다이렉트 시킨다.
      res.redirect(authUrl);
    }

});






module.exports = router;
