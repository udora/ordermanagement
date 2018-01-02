/**
 * Module dependencies.
 */
var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    https = require('https'),
    port = Number(process.env.PORT || 8080),
    path = require('path');

var app = express();

// all environments
app.set('port', port);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

app.post('/status', function(req, res) {
    console.log('Call ICS!!!');

    jsonObject = JSON.stringify({
        "POHeaderID": req.body.POHeaderID
    });

    // prepare the header
    var postheaders = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer
            .byteLength(jsonObject, 'utf8'),
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

    console.info('ICS Request object prepared:');
    console.info(jsonObject);

    console.info('ICS Options prepared:');
    console.info(optionspost);
    console.info('Do the POST call');

    // do the POST call
    var reqPost = https
        .request(
            optionspost,
            function(res2) {
                // console.log("statusCode: ",
                // res2.statusCode);
                // uncomment it for header details
                // console.log("headers: ",
                // res2.headers);

                res2
                    .on(
                        'data',
                        function(d) {
                            console
                                .info('POST result:\n');
                            // process.stdout.write(d);
                            console
                                .info('\n\n POST completed');
                            if (res2.statusCode != 200) {

                                res
                                    .render(
                                        'confirm', {
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
                        'confirm', {
                            'title': 'Error during ICS service call',
                            'message': 'Error occured. Please check the server console and the logs'
                        });
            });




});




app
    .post(
        '/order',
        function(req, res) {
            // check to authenticate first
            // console.log(req.body.ProcurementBusinessUnit); // show
            // the value of the text box
            // console.log(req.body.BillToBusinessUnit); // show the
            // value of the text box
            // console.log(req.body.RequisitioningBusinessUnit); // show
            // the value of the text box
            //console.log(req.body.BuyerName); // show the value of the
            // text box
            console.log(req.body.Email); // show the value of the
            // text box
            // console.log(req.body.Supplier); // show the value of the
            // text box
            console.log(req.body.ItemDescription); // show the value of
            // the text box
            // console.log(req.body.CategoryName); // show the value of
            // the text box
            // console.log(req.body.CurrencyCode); // show the value of
            // the text box
            console.log(req.body.Price); // show the value of the
            // text box
            // console.log(req.body.UnitOfMeasure); // show the value of
            // the text box
            // console.log(req.body.UnitCode); // show the value of the
            // text box
            console.log(req.body.Quantity); // show the value of the
            // text box
            // console.log(req.body.ScheduleNumber); // show the value
            // of the text box
            // console.log(req.body.ShipToOrganizationCode); // show the
            // value of the text box
            // console.log(req.body.ShipToLocationCode); // show the
            // value of the text box
            console.log('Call PCS!!!');

            jsonObject = JSON.stringify({
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
                'Content-Length': Buffer
                    .byteLength(jsonObject, 'utf8'),
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
                        // console.log("statusCode: ",
                        // res2.statusCode);
                        // uncomment it for header details
                        // console.log("headers: ",
                        // res2.headers);

                        res2
                            .on(
                                'data',
                                function(d) {
                                    console
                                        .info('POST result:\n');
                                    // process.stdout.write(d);
                                    console
                                        .info('\n\nPOST completed');
                                    if (res2.statusCode != 200) {

                                        res
                                            .render(
                                                'confirm', {
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
                                'confirm', {
                                    'title': 'Error during service call',
                                    'message': 'Error occured. Please check the server console and the logs'
                                });
                    });

        });