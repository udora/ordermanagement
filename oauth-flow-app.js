//'use strict';

/**
 * Module dependencies.
 */
var express = require('express'),
 routes = require('./routes'),
 http = require('http'),
 https = require('https'),
 port = Number(process.env.PORT || 8080),
 path = require('path'),
 request = require('request'),
 session = require('express-session'),
 callbackurl = 'http://localhost:8080/callback';
//callbackurl =
//'https://OrderManagement-gse00012197.apaas.us2.oraclecloud.com/callback';

var app = express();

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

// all environments
app.set('port', port);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
 secret: 'keyboard cat',
 resave: false,
 saveUninitialized: true
}))
app.use(app.router);

// development only
if ('development' == app.get('env')) {
 app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function() {
 console.log('Express server listening on port ' + app.get('port'));
});

app
 .post(
  '/status',
  function(req, res) {

   console.log('Validate Access Token in check status flow');

   // ***********************************************************/
   var headers = {
    'Authorization': 'Basic MTk3Y2RkY2UwYTBjNDA1NGIyNGVkYTU1NzJhOTA2OWQ6MGQyOGRiOWYtOGUwYS00M2ExLWEyMzEtYWY4NTgzZTgyMzk3',
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
   };

   console.log('Access Token from session-' + req.session.accesstoken);

   var dataString = 'token=' + req.session.accesstoken + '';

   var options = {
    uri: 'https://mydemotenant1.idcs.internal.oracle.com/oauth2/v1/introspect',
    method: 'POST',
    headers: headers,
    body: dataString,
    family: 4
   };

   function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
     var jsonObj = JSON.parse(body);
     for (var myKey in jsonObj) {

      var value = jsonObj[myKey];
      console
       .log("key:" + myKey + ", value:" + value);
      if (myKey === 'active' && value === true) {
       console
        .log('Access token is valid. Continue to ICS');
       console.log('Call ICS!!!');

       var jsonObject = JSON.stringify({
        "POHeaderID": req.body.POHeaderID
       });

       // prepare the header
       var postheaders = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(
         jsonObject, 'utf8'),
        'Authorization': 'Basic Y2xvdWQuYWRtaW46RmVhcmZ1bEAwT1BFTg=='
       };

       // the post options
       var optionspost = {
        host: 'integration-gse00012197.integration.us2.oraclecloud.com',
        port: 443,
        path: '/integration/flowapi/rest/ORDE_MANA_ERP_CLOU_GET_STAT_OF_O/v01/getOrderStatus',
        method: 'POST',
        headers: postheaders
       };

       console
        .info('ICS Request object prepared:');
       console.info(jsonObject);

       console.info('ICS Options prepared:');
       console.info(optionspost);
       console.info('Do the POST call');

       // do the POST call
       var reqPost = https
        .request(
         optionspost,
         function(res2) {
          // console.log("statusCode:
          // ",
          // res2.statusCode);
          // uncomment it for
          // header details
          // console.log("headers:
          // ",
          // res2.headers);

          res2
           .on(
            'data',
            function(
             d) {
             console
              .info('POST result:\n');
             // process.stdout.write(d);
             console
              .info('\n\n POST completed');
             if (res2.statusCode != 200) {

              res
               .render(
                'error', {
                 'title': 'Error during ICS service call',
                 'message': 'Error occured. Please check the server console and the logs'
                });

             } else {
              res
               .render(
                'status', {
                 'title': 'Current Order Status',
                 'message': d
                });
             }
            });
         });

       // write the json data
       reqPost.write(jsonObject);
       reqPost.end();
       reqPost
        .on(
         'error',
         function(e) {
          console.error(e);
          res
           .render(
            'error', {
             'title': 'Error during ICS service call',
             'message': 'Error occured. Please check the server console and the logs'
            });
         });

      } else {
       console
        .log('Access token expired. Go back to login page');
       res
        .render(
         'login', {
          'title': 'Authenticate Yourself',
          'message': 'This is a protected resource. You have to authenticate yourself'
         });
      }
      break;
     }

    }
   }

   request(options, callback);

   // **********************************************************/

  });

app
 .post(
  '/order',
  function(req, res) {

   console.log('Validate Access Token in submit order flow');

   // ***********************************************************/
   var headers = {
    'Authorization': 'Basic MTk3Y2RkY2UwYTBjNDA1NGIyNGVkYTU1NzJhOTA2OWQ6MGQyOGRiOWYtOGUwYS00M2ExLWEyMzEtYWY4NTgzZTgyMzk3',
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
   };

   console.log('Access Token from session-' + req.session.accesstoken);
   var dataString = 'token=' + req.session.accesstoken + '';

   var options = {
    uri: 'https://mydemotenant1.idcs.internal.oracle.com/oauth2/v1/introspect',
    method: 'POST',
    headers: headers,
    body: dataString,
    family: 4
   };

   function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
     console.log(body);
     var jsonObj = JSON.parse(body);
     for (var myKey in jsonObj) {

      var value = jsonObj[myKey];
      console
       .log("key:" + myKey + ", value:" + value);
      if (myKey === 'active' && value === true) {
       console
        .log('Access token is valid. Continue to PCS');
       console.log(req.body.Email); // show the
       // value of
       // the
       console.log(req.body.ItemDescription); // show
       // the
       // value
       // of
       console.log(req.body.Price); // show the
       // value of
       // the
       console.log(req.body.Quantity); // show the
       // value of
       // the
       console.log('Call PCS!!!');

       var jsonObject = JSON
        .stringify({
         "formArg": {
          "procurementBusinessUnit": "US1 Business Unit",
          "billToBusinessUnit": "US1 Business Unit",
          "requisitioningBusinessUnit": "US1 Business Unit",
          "buyerName": 'Roth, Calvin',
          "supplier": "Lee Supplies",
          "itemDescription": req.body.ItemDescription,
          "categoryName": "Printers",
          "currencyCode": "USD",
          "price": req.body.Price,
          "unitOfMeasure": "Ea",
          "unitCode": "Ea",
          "quantity": req.body.Quantity,
          "scheduleNumber": "2",
          "shipToOrganizationCode": "001",
          "shipToLocationCode": "Seattle",
          "email": req.body.Email,
          "source": "Web"
         }
        });

       // prepare the header
       var postheaders = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(
         jsonObject, 'utf8'),
        'Authorization': 'Basic Y2xvdWQuYWRtaW46RmVhcmZ1bEAwT1BFTg=='
       };

       // the post options
       var optionspost = {
        host: 'process-gse00012197.process.us2.oraclecloud.com',
        port: 443,
        path: '/bpm/api/4.0/processes?processDefId=default~Order_Management!2~CreateOrder&serviceName=CreateOrder.service&operation=submitOrder&action=Submit',
        method: 'POST',
        headers: postheaders
       };

       console.info('Request object prepared:');
       console.info(jsonObject);

       console.info('Options prepared:');
       console.info(optionspost);
       console.info('Do the POST call');

       // do the POST call
       var reqPost = https
        .request(
         optionspost,
         function(res2) {

          res2
           .on(
            'data',
            function(
             d) {
             console
              .info('POST result:\n');
             // process.stdout.write(d);
             console
              .info('\n\nPOST completed');
             if (res2.statusCode != 200) {

              res
               .render(
                'error', {
                 'title': 'Error during PCS service call',
                 'message': 'Error occured. Please check the server console and the logs'
                });

             } else {
              res
               .render(
                'confirm', {
                 'title': 'Order Confirmation',
                 'message': 'Your order has been submitted. You will get an email shortly with all the details in it. If you don\'t get an email, then check the process server and/or the integration server logs. Once you recieve the email, copy the POHeaderID from the email, paste it in the text field below and click the check order status button to get the latest status of your order'
                });
             }
            });
         });

       // write the json data
       reqPost.write(jsonObject);
       reqPost.end();
       reqPost
        .on(
         'error',
         function(e) {
          console.error(e);
          res
           .render(
            'error', {
             'title': 'Error during service call',
             'message': 'Error occured. Please check the server console and the logs'
            });
         });

      } else {
       console
        .log('Access token expired. Go back to login page');
       res
        .render(
         'login', {
          'title': 'Authenticate Yourself',
          'message': 'This is a protected resource. You have to authenticate yourself'
         });
      }
      break;
     }

    }
   }

   request(options, callback);

   // **********************************************************/

  });

app.get('/', routes.login);

app
 .get(
  '/auth',
  function(req, res) {
   var url = 'https://mydemotenant1.idcs.internal.oracle.com/oauth2/v1/authorize?client_id=197cddce0a0c4054b24eda5572a9069d&redirect_uri=' + callbackurl + '&response_type=code&scope=openid&state=23456'
   res.redirect(url);
  });

app
 .get(
  '/callback',
  function(req, res) {

   console.log('inside first auth callback');
   console.log('Authorization code is - ' + req.query.code);
   console
    .log('Get Access Token and Validate it. If valid then render the order page or show error page');

   var headers = {
    'Authorization': 'Basic MTk3Y2RkY2UwYTBjNDA1NGIyNGVkYTU1NzJhOTA2OWQ6MGQyOGRiOWYtOGUwYS00M2ExLWEyMzEtYWY4NTgzZTgyMzk3',
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
   };

   var dataString = 'grant_type=authorization_code&code=' + req.query.code + '&redirect_uri=' + callbackurl + '';

   var options = {
    uri: 'https://mydemotenant1.idcs.internal.oracle.com/oauth2/v1/token',
    method: 'POST',
    headers: headers,
    body: dataString,
    family: 4
   };
   
    function callback(error, response, body) {

    if (!error && response.statusCode == 200) {
     var jsonObj = JSON.parse(body);
     for (var myKey in jsonObj) {
      var value = jsonObj[myKey];
      console
       .log("key:" + myKey + ", value:" + value);
      if (myKey === 'access_token') {
       req.session.accesstoken = value;
       console
        .log('Setting Access Token into session-' + req.session.accesstoken);
      }
     }
     res.render('index.jade');
    } else {
      console.error(error);
     // console.log(response);
     res
      .render(
       'error', {
        'title': 'Authorization error',
        'message': 'Error occured during authorization. Please check with your identity service provider'
       });
    }
   }

   request(options, callback);

  });