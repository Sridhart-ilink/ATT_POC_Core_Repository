var DECIMAL_PRECISION = 5;
var events = [];
var isPortActive = false;
var localAppUrl = "localhost:13238";
var serverAppUrl = "attpoc-websvr.cloudapp.net/CRANng";
var localApiUrl = "localhost:4646";
var serverApiUrl = "attpoc-websvr.cloudapp.net/ATTWebAppAPICRAN";
var localHubImageUrl = '../Styles/images/';
var serverHubImageUrl = '../CRANng/Styles/images/';
var camundaBaseApiUrl = isPortActive ? "http://" + serverApiUrl + "/api/" :
    "http://" + localApiUrl + "/api/";
var appUrl = isPortActive ? "http://" + serverAppUrl + "/" : "http://" + localAppUrl + "/";
