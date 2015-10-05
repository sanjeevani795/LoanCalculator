/**
 * Created by sanjeevani on 9/8/15.
 */
var calButton = document.getElementById("btnCalculate");

//The functions listed below for each text input, checks on tab out event
//if calculate button should remain disabled if any of the inputs are empty
//also checks for a positive number in text input
var principleInput = document.getElementById("principle");
principleInput.onblur = function(e) {
    var value = e.target.value;
    if(!value.match(/^[0-9]+$/)){
        document.getElementById("errorP").innerHTML = "Principle amount should be a positive number";
        calButton.disabled = true;
    }
    else{
        document.getElementById("errorP").innerHTML = "";
        if (interestInput.value.match(/^[0-9]+$/) && loanPeriodInput.value.match(/^[0-9]+$/)){
            calButton.disabled = false;
        }
    }
};

var interestInput = document.getElementById("interest");
interestInput.onblur = function(e) {
    var value = e.target.value;
    if(!value.match(/^[0-9]+$/)){
        document.getElementById("errorI").innerHTML = "Interest should be a positive number";
        calButton.disabled = true;
    }
    else{
        document.getElementById("errorI").innerHTML = "";
        if (principleInput.value.match(/^[0-9]+$/) && loanPeriodInput.value.match(/^[0-9]+$/)){
            calButton.disabled = false;
        }
    }
};

var loanPeriodInput = document.getElementById("loanPeriod");
loanPeriodInput.onblur = function(e) {
    var value = e.target.value;
    if(!value.match(/^[0-9]+$/)){
        document.getElementById("errorL").innerHTML = "Loan Period should be a positive number";
        calButton.disabled = true;
    }
    else{
        document.getElementById("errorL").innerHTML = "";
        if (principleInput.value.match(/^[0-9]+$/) && interestInput.value.match(/^[0-9]+$/)){
            calButton.disabled = false;
        }
    }
};

//zip code input is optional
var zipCodeInput = document.getElementById("zipCode");
zipCodeInput.onblur = function(e) {
    var value = e.target.value;
    if(value && !value.match(/^[0-9]+$/)){
        document.getElementById("errorZ").innerHTML = " Zip code should be a positive number";
    }
    else{
        document.getElementById("errorZ").innerHTML = "";
    }
    //we still need check for other 3 inputs otherwise on tab out of zip code text, button will remain disabled
    if (principleInput.value.match(/^[0-9]+$/) && interestInput.value.match(/^[0-9]+$/) && loanPeriodInput.value.match(/^[0-9]+$/)){
        calButton.disabled = false;
    }
    else{
        calButton.disabled = true;
    }
};

/* This script defines the calculate() function called by the event handlers
 * in loanCalculator.html. The function reads values from <input> elements, calculates
 * loan payment information, displays the results in labels. It also
 * saves the user's data, displays links to lenders, and draws a chart.
 */

function Calculate(){
    var amount = principleInput.value;
    var annualInterest = interestInput.value;
    var years = loanPeriodInput.value;
    var zip = zipCodeInput.value;

    //Using formula to calculate monthly payment M = P * ( J / (1 - (1 + J)-N))
    //M is monthly pay, P is principle amount, J is effective interest, N is total number of payments
    // TO calculate J divide annual interest by 100 and then divide the result by number of payments per year

    var effectiveInterest = (annualInterest / 100) / 12;
    var totalNumPayments = 12 * years;
    var obj = {};
    obj.monthlyPayment = amount * (effectiveInterest / (1 - Math.pow((1 + effectiveInterest), -totalNumPayments)));
    //console.log(monthlyPayment);
    obj.totalPayment = obj.monthlyPayment * totalNumPayments;
    obj.totalInterest = obj.totalPayment - amount;
    document.getElementById("lblMonthly").innerHTML = obj.monthlyPayment.toFixed(2);
    document.getElementById("lblTotalPay").innerHTML = obj.totalPayment.toFixed(2);
    document.getElementById("lblInterest").innerHTML = obj.totalInterest.toFixed(2);
    //function to get lenders from node server listening to port 5000, using AJAX xmlhttprequest
    getLender(amount,annualInterest,years,zip);
    //create chart
    chart(amount,obj);

}

// Pass the user's input to a server-side script which can (in theory) return
// a list of links to local lenders interested in making loans. This example
// does not actually include a working implementation of such a lender-finding
// service. But if the service existed, this function would work with it.
function getLender(amount,interest,years,zip) {
    var xmlHTTP ;
    xmlHTTP = GetXmlHttpObject();
    if(xmlHTTP == null){
        alert("Your browser does not support XML HTTP!");
    }
    else{
        var url = "http://localhost:5000";
        url = url + "?amt=" + amount;
        url = url + "&int=" + interest;
        url = url + "&yrs=" + years;
        url = url + "&zip=" + zip;
        url = url + "&q=" + Math.random();
        xmlHTTP.onreadystatechange = function stateChanged(){
            if (xmlHTTP.readyState == 4) {
                document.getElementById("lenders").innerHTML = "<pre>" + xmlHTTP.responseText +  "</pre>";
            }
        };
        xmlHTTP.open("GET", url, true);
        xmlHTTP.send(null);
    }
}

//initialize XML http object
function GetXmlHttpObject(){
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        return new XMLHttpRequest();
    }
    if (window.ActiveXObject) {
        // code for IE6, IE5
        return new ActiveXObject("Microsoft.XMLHTTP");
    }
}

/*
optional Function to Chart monthly loan balance, interest and equity in an HTML <canvas> element.
 If called with no arguments then just erase any previously drawn chart
 */
function chart(amount, obj){
}