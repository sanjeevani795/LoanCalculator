/**
 * Created by Sanjeevani on 9/10/15.
 */
///node server which listens to incoming requests on port 5000

var http = require('http');
var url = require('url');

//dummy lenders name w.r.t their location (zip) and the annual interest these lenders provide.
var lenders = {
        "6" : {
            "95129": ["BAY EQUITY LLC", "AMERICAN PACIFIC MORTGAGE", "JAC FINANCIAL INC", "RMR FINANCIAL LLC", "OPEN MORTGAGE LLC"],
            "95134": ["JAC FINANCIAL INC", "OPES ADVISORS INC", "RMR FINANCIAL LLC", "RPM MORTGAGE INC", "PROSPECT MORTGAGEE LLC"]
        },
    "4" : {
        "96120": ["BAY EQUITY LLC", "AMERICAN PACIFIC MORTGAGE", "JAC FINANCIAL INC", "RMR FINANCIAL LLC", "OPEN MORTGAGE LLC"],
        "96234": ["JAC FINANCIAL INC", "OPES ADVISORS INC", "RMR FINANCIAL LLC", "RPM MORTGAGE INC", "PROSPECT MORTGAGEE LLC"]
    }
};

/*
This function is the handler for node server, when this server receives a request, the handler get executed
and respond to the client. In this case, a respond containing lenders and request parameters is sent to client
based upon zip code and interest.
 */
var myReqHandler = function(req, res) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var parsedURL = url.parse(req.url, true);
    var params = parsedURL.query;
    //respond lenders based upon the request params interest and zipcode
    //res.end(JSON.stringify(params) + "\n");
    if(lenders[params["int"]]) {
        if (lenders[params["int"]][params["zip"]]){
            res.end(JSON.stringify(params) + "<br><br>" + lenders[params["int"]][params["zip"]]);
        }
        else
        {
            res.end(JSON.stringify(params));
        }
    }

};

http.createServer(myReqHandler).listen(5000);

