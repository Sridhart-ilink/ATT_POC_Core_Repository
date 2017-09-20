
var labelStatus = '';
var processInstanceID = "";
var polygonlist = [];
function loadScript(src, callback) {
    'use strict';

    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;

    script.onreadystatechange = function () {
        if (this.readyState === 'complete' || this.readyState === 'loaded') {
            callback();
        }
    };

    script.onload = callback;

    var scriptTag = document.getElementsByTagName('script')[0];
    scriptTag.parentNode.insertBefore(script, scriptTag);
}

loadScript('https://js.arcgis.com/3.14/init.js', function () {
    onLoadGis(); //Initialize GIS components on ArcGIS load
});

function updatePromoteStatus(currentStatus) {

    switch (currentStatus) {
        case statusEnum.RF_Pending_Completion:
            labelStatus = statusEnum.CE_PM_Vendor_Assignment;
            $('#demoteBtn').show();
            $('#pullbackBtn').show();
            break;
        case statusEnum.CE_PM_Vendor_Assignment:
            labelStatus = statusEnum.TV_Pending_Approval;
            $('#demoteBtn').show();
            $('#pullbackBtn').show();
            break;
        case statusEnum.TV_Pending_Approval:
            labelStatus = statusEnum.TV_Complete;
            $('#demoteBtn').hide();
            $('#promoteBtn').hide();
            $('#pullbackBtn').show();
            break;
        case statusEnum.RF_Mod_CE_PM_Vendor_Assignment:
            labelStatus = statusEnum.CE_PM_Vendor_Assignment;
            $('#demoteBtn').hide();
            break;
        case statusEnum.RF_Mod_TV_Pending_Approval:
            labelStatus = statusEnum.TV_Pending_Approval;
            $('#demoteBtn').hide();
            break;
    }
}

function updateDemoteStatus(currentStatus) {
    switch (currentStatus) {
        case statusEnum.CE_PM_Vendor_Assignment:
            labelStatus = statusEnum.RF_Mod_CE_PM_Vendor_Assignment;
            break;
        case statusEnum.TV_Pending_Approval:
            labelStatus = statusEnum.RF_Mod_TV_Pending_Approval;
            break;
    }
    $('#pullbackBtn').show();
    $('#demoteBtn').hide();
}

function updatePullbackStatus(currentStatus) {
    switch (currentStatus) {
        case statusEnum.TV_Complete:
            labelStatus = statusEnum.RF_Pending_Completion;
            break;
        case statusEnum.CE_PM_Vendor_Assignment:
            labelStatus = statusEnum.RF_Pending_Completion;
            break;
        case statusEnum.TV_Pending_Approval:
            labelStatus = statusEnum.RF_Pending_Completion;
            break;
        case statusEnum.RF_Mod_CE_PM_Vendor_Assignment:
            labelStatus = statusEnum.RF_Pending_Completion;
            break;
        case statusEnum.RF_Mod_TV_Pending_Approval:
            labelStatus = statusEnum.RF_Pending_Completion;
            break;
    }
    $('#cancelBtn').show();
    $('#promoteBtn').show();
    $('#pullbackBtn').hide();
}

function updateApproveStatus(currentStatus) {
    switch (currentStatus) {
        case statusEnum.RF_Approval:
            labelStatus = statusEnum.Completed;
            $('#cancelBtn').hide();
            $('#promoteBtn').hide();
            break;
        case statusEnum.SelectNodes:
            labelStatus = statusEnum.RF_Approval;
            $('#cancelBtn').hide();
            $('#promoteBtn').show();
            break;
    }
}

function updateRejectStatus(currentStatus) {
    switch (currentStatus) {
        case statusEnum.RF_Approval:
            labelStatus = statusEnum.SelectNodes;
            $('#cancelBtn').hide();
            $('#promoteBtn').show();
            break;
    }
}

function updateCancelStatus(currentStatus) {
    labelStatus = statusEnum.Cancel;
    $('#promoteBtn').hide();
    $('#demoteBtn').hide();
    $('#pullbackBtn').hide();
}

function workflowUpdate(currentBtnText) {
    switch (currentBtnText) {
        case "PROMOTE":
            updatePromoteStatus(labelStatus);
            break;
        case "DEMOTE":
            updateDemoteStatus(labelStatus);
            break;
        case "PULL BACK":
            updatePullbackStatus(labelStatus);
            break;
        case "CANCEL":
            updateCancelStatus(labelStatus);
            break;
        case "APPROVE ALL":
            updateApproveStatus(labelStatus);
            break;
        case "REJECT ALL":
            updateRejectStatus(labelStatus);
            break;
    }
}

function updateSarfStatus(id, currentText) {
    $.LoadingOverlay("show");
    workflowUpdate(currentText);
    var getStatusUrl = "sarf/UpdateSarfStatus";
    var sarf = {
        id: id,
        sarfStatus: labelStatus
    };
    /*
    api call to update status
    */
    $.ajax({
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        url: camundaBaseApiUrl + getStatusUrl,
        data: JSON.stringify(sarf),
        //async: false,
        cache: false,
        success: function (data) {
            localStorage["taskStatus"] = labelStatus;
            $.LoadingOverlay("hide");
            $('#sarfForm').submit();
        },
        error: function (err) {
            $.LoadingOverlay("hide");
            $('#sarfForm').submit();
        }
    });
}

function updateStatus(wfStatus, currentText, nodeCount) {
    
    var getStatusUrl = "sarf/taskcomplete";
    isCsfl = localStorage["isCsfl"] == 'true';
    isRffl = localStorage["isRffl"] == 'true';
    contactSuccess = !isCsfl;
    wfStatus = isRffl ? 'reject' : wfStatus;
    var jsonData = {
        variables: {
            "action": { "value": wfStatus, "type": "String" }
            , "ContactSuccess": { "value": contactSuccess, "type": "Boolean" }
        },
        id: JSON.parse(JSON.stringify(localStorage["taskID"]))
    };
    /*
    api call to update status
    */
    if (isPortActive) {
        for (var count = 0; count < nodeCount; count++) {
			jsonData.id = JSON.parse(JSON.stringify(localStorage["taskID"]));
            $.ajax({
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                url: camundaBaseApiUrl + getStatusUrl,
                data: JSON.stringify(jsonData),
                async: false,
                cache: false,
                success: function (data) {
                    $.LoadingOverlay("show");
					getTaskStatusbyProcessInstanceID(processInstanceID);
                    console.log((count + 1) + " - " + data);
                },
                error: function (err) {
                    console.log(err);
                }
            });
        }
        localStorage["tabIndex"] = $('.tabs-left').find('li.active').attr('data-index');
		$.LoadingOverlay("hide");
		$('#sarfForm').submit();
    }
    else {
        localStorage["tabIndex"] = $('.tabs-left').find('li.active').attr('data-index');
        updateSarfStatus(localStorage["sarfID"], currentText);
    }
}

function getTaskStatusbyProcessInstanceID(processInstanceID) {
    $.LoadingOverlay("show");
    var getStatusUrl = "sarf/task-by-process-instance";
    /*
    api call to get the  task id , activity name ie status to complete the task
    */
    $.ajax({
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        url: camundaBaseApiUrl + getStatusUrl + "/" + processInstanceID,
        data: JSON.stringify({}),
        async: false,
        cache: false,
        success: function (data) {
            if (data != null) {
                if (data == "[]") {
                    TaskStatus = "Completed";
                    localStorage["taskStatus"] = TaskStatus;
                }
                else {
                    var parsedData = JSON.parse(data)[0];
                    TaskID = parsedData.id;
                    TaskStatus = parsedData.name;
                    localStorage["taskID"] = TaskID;
                    localStorage["instanceID"] = processInstanceID;
                    InstanceID = processInstanceID;
                    localStorage["taskStatus"] = TaskStatus;
                }
                var updateSarfUrl = "sarf/UpdateSarfStatus";
                var sarfData = {
                    id: localStorage["sarfID"],
                    sarfStatus: localStorage["taskStatus"]
                };
                $.ajax({
                    method: 'POST',
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    url: camundaBaseApiUrl + updateSarfUrl,
                    data: JSON.stringify(sarfData),
                    async: false,
                    cache: false,
                    success: function (data) {
                        $.LoadingOverlay("show");
                    },
                    error: function (err) {
                        console.log(err);
                    }
                });
            }
        },
        error: function (err) {
            console.log(err);
            $.LoadingOverlay("hide");
        }
    });
}

function initializeDetailsLabel(details) {
    if (details != null) {
        $('#lblsarfname').text(details.SarfName);
        $('#lblcounty').text(details.County);
        $('#lblfacode').text(details.FA_Code);
        $('#lblfatype').text(details.FA_Type);
        $('#lblmarket').text(details.Market);
        $('#lblmarketcluster').text(details.Market_Cluster);
        $('#lblpace').text(details.Pace);
        $('#lblrfdesign').text(details.RF_Design_Engineer_ATTUID);
        $('#lblregion').text(details.Region);
        $('#lblsearchring').text(details.Search_Ring_ID);
        $('#lbliplan').text(details.iPlan_Job);
        $('#lblarea').text((details.AreaInSqKm * 0.386102).toFixed(3));
        $('#txtarea').attr('disabled', true);
    }
}

function initializeDetailsText(details) {
    if (details != null) {
        $('#txtsarfname').val(details.SarfName);
        $('#txtcounty').val(details.County);
        $('#txtfacode').val(details.FA_Code);
        $('#txtfatype').val(details.FA_Type);
        $('#txtmarket').val(details.Market);
        $('#txtmarketcluster').val(details.Market_Cluster);
        $('#txtpace').val(details.Pace);
        $('#txtrfdesign').val(details.RF_Design_Engineer_ATTUID);
        $('#txtregion').val(details.Region);
        $('#txtsearchring').val(details.Search_Ring_ID);
        $('#txtiplan').val(details.iPlan_Job);
        $('#txtarea').val((details.AreaInSqKm * 0.386102).toFixed(3));

    }
}

function resetWorkflowButtons(currentStatus) {
    switch (currentStatus) {
        case statusEnum.RF_Pending_Completion:
            $('#promoteBtn').show();
            $('#cancelBtn').show();
            break;
        case statusEnum.CE_PM_Vendor_Assignment:
        case statusEnum.TV_Pending_Approval:
            $('#promoteBtn').show();
            $('#demoteBtn').show();
            $('#pullbackBtn').show();
            $('#cancelBtn').show();
            break;

        case statusEnum.RF_Mod_CE_PM_Vendor_Assignment:
        case statusEnum.RF_Mod_TV_Pending_Approval:
            $('#promoteBtn').show();
            $('#pullbackBtn').show();
            break;

        case statusEnum.TV_Complete:
            $('#pullbackBtn').show();
            $('#cancelBtn').show();
            break;

        case statusEnum.Cancel:
            break;

        case statusEnum.RF_Approval:
            $('#promoteBtn').show();
            $('#cancelBtn').show();
            break;
        case statusEnum.Completed:
            $('#promoteBtn').hide();
            $('#cancelBtn').hide();
            break;
        case statusEnum.SelectNodes:
            $('#promoteBtn').show();
            $('#cancelBtn').hide();
            break;

        default:
            if (currentStatus.indexOf("RF Mod") == 0){             
                $('#promoteBtn').show();
                $('#pullbackBtn').show();
            }
            else {
                $('#promoteBtn').show();
                $('#cancelBtn').show();
            }
            break;
    }
}

function restoreCurrentTab() {
    var lastViewedTabIndex = localStorage["tabIndex"];
    if (lastViewedTabIndex != null && lastViewedTabIndex != '') {
        lastViewedTabIndex = parseInt(lastViewedTabIndex);
        switch (lastViewedTabIndex) {
            case 0:
                $($('.tabs-left').find('li')[lastViewedTabIndex]).addClass('active');
                $($('.tabs-left').find('li')[lastViewedTabIndex + 1]).removeClass('active');
                $($('.tab-content').find('.tab-pane')[lastViewedTabIndex]).addClass('active');
                $($('.tab-content').find('.tab-pane')[lastViewedTabIndex + 1]).removeClass('active');
                break;
            case 1:
                $($('.tabs-left').find('li')[lastViewedTabIndex]).addClass('active');
                $($('.tabs-left').find('li')[lastViewedTabIndex - 1]).removeClass('active');
                $($('.tab-content').find('.tab-pane')[lastViewedTabIndex]).addClass('active');
                $($('.tab-content').find('.tab-pane')[lastViewedTabIndex - 1]).removeClass('active');
                break;
            default:
                $($('.tabs-left').find('li')[0]).addClass('active');
                $($('.tab-content').find('.tab-pane')[0]).addClass('active');
                $($('.tabs-left li')[0]).find('a').focus();
                break;
        }
    }
    else {
        $($('.tabs-left').find('li')[0]).addClass('active');
        $($('.tab-content').find('.tab-pane')[0]).addClass('active');
        $($('.tabs-left li')[0]).find('a').focus();
    }
}

function toggleContactInfo() {
    var ele = document.getElementById("toggleText");
    var text = document.getElementById("displayText");
    if (ele.style.display == "block") {
        ele.style.display = "none";
    }
    else {
        ele.style.display = "block";

    }
}
function toggleStructureInfo() {
    var ele = document.getElementById("toggleStructureInfoText");
    var text = document.getElementById("displayStructureInfoText");
    if (ele.style.display == "block") {
        ele.style.display = "none";
    }
    else {
        ele.style.display = "block";

    }
}

//Jquery - document load script method
$(document).ready(function () {

$("ul li.history").click(function () {
        var name = $('#lblsarfname').text();
        var completedBtn = $('.completedBtn');
        var timelineAreaProgress = $('.progress pull-left');
        var divProgressContent = $('.progressContent pull-left');
        var content = '';

        $.getJSON("JSon/History.json", function (data) {
            var items = data.HistoryData;

            for (var j = 0, l = items.length; j < l; j++) {
                if (name.indexOf(items[j].Name) != -1) {
                    if (items[j].Name == 'NSFL') {
                        $('#progressline').addClass('progress pull-left');
                    }
                    else if (items[j].Name == 'IPFL') {
                        $('#progressline').addClass('progressIPFL pull-left');
                    }
                    else if (items[j].Name == 'RFFL') {
                        $('#progressline').addClass('progressRFFL pull-left');
                    }
                    else if (items[j].Name == 'CSFL') {
                        $('#progressline').addClass('progressCSFL pull-left');
                    }
                    else if (items[j].Name == 'FULL') {
                        $('#progressline').addClass('progressFULL pull-left');
                    }
                    $.each(items[j].History, function (i, h) {
                        if (h.SubStep !== '') {
                            content = content + '<div class="content contentSelectNodes">'
                           // if (h.Duration !== '')
                                //content = content + '<div style="margin-left: -55px; position: absolute; margin-top: 30px; ">' + h.Duration + '</div>'

                           content = content + '<div class="progressDot"></div>' +
                                                    '<div class ="identifyNodes pull-left highlightApproved">'
                            if (h.ProgressCircle === 1){
                                content = content + '<div class="progressCircle"></div>'
                            }

                            content = content + '<div class="progressHead">' +
                                '<h3>' + h.Step + '</h3>' +
                                '<label>Start Date: <span class="dateSpan">' + h.StartDate + '</span></label>'

                            if (h.EndDate !== '') {
                                content = content + '<label>End Date: <span class="dateSpan">' +  h.EndDate + '</span></label>'
                            }

                            content = content + '</div>' +
                                                    '</div>' +
                                                    '<div class ="getAtolls pull-left">'

                            if (h.ProgressCircle === 1) {
                                content = content + '<div class="progressCircle"></div>'
                            }

                            content = content + '<div class="progressHead">' +
                                            '<h3>' + h.SubStep[0].Step + '</h3>' +
                                            '<label>Start Date: <span class="dateSpan">' + h.SubStep[0].StartDate + '</span></label>'

                            if (h.SubStep[0].EndDate !== '') {
                                content = content + '<label>End Date: <span class="dateSpan">' + h.SubStep[0].EndDate  + '</span></label>'
                            }

                            content = content + '</div></div></div>';
                        }
                        else {
                            content = content + '<div class="content contentAOI">'
                            if (h.Duration !== '') {
                                //content = content + '<div style="margin-left: -55px; position: absolute; margin-top: 30px; ">' + h.Duration + '</div>'

                                content = content + '<div class="progressDot"></div>'
                            }
                            if (h.ProgressCircle === 1) {
                                content = content + '<div class="progressCircle"></div>'
                            }

                            content = content + '<div class="progressHead">' +
                                    '<h3>' + h.Step + '</h3>' +
                                    '<label>Start Date: <span class="dateSpan">' + h.StartDate + '</span></label>'
                                
                            if (h.EndDate !== '') {
                                content = content + '<label>End Date: <span class="dateSpan">' +  h.EndDate  + '</span></label>'
                            }

                            content = content + '</div></div>'
                        }
                    })

                    completedBtn.attr('margin-top', items[j].CompleteBtnTopMargin);
                    completedBtn.attr('height', items[j].ProgressHeight);
                }
            }

            $('#progressContent').html(content);
        })
    });

    if (localStorage["currentlong"] == null) {
        localStorage["currentlong"] = "";
    }
    if (localStorage["currentlat"] == null) {
        localStorage["currentlat"] = "";
    }
    $.LoadingOverlay("show");
    $('.commentingDiv').hide();
    $('.toggleArrow').click(function () {
        $('.toggleArrow').toggleClass('rotateArrow');
        if ($('.slidingDiv').is(":visible")) {
            //console.log('side bar shown');
            $(".slidingDiv").toggle();
            $('.tabDiv').removeClass('col-md-9');
            $('.tabDiv').addClass('col-md-12');
        }
        else {
            console.log('side bar hidden');
            $(".slidingDiv").toggle();
            $('.tabDiv').removeClass('col-md-12');
            $('.tabDiv').addClass('col-md-9');
        }
    });

    $('#toggleComment').click(function () {
        $(".commentingDiv").toggle();
    });

    $('.commentCloseBtn').click(function () {
        $(".commentingDiv").toggle();
    });

    processInstanceID = GetParameterValues("processInstanceId");
    if (isPortActive) {
        getTaskStatusbyProcessInstanceID(processInstanceID);
        $.LoadingOverlay("hide");
    }

    $('#statusLabel').text(localStorage["taskStatus"]);
    labelStatus = $('#statusLabel').text();
    $('#promoteBtn').hide();
    $('#demoteBtn').hide();
    $('#pullbackBtn').hide();
    $('#cancelBtn').hide();

    resetWorkflowButtons(localStorage["taskStatus"]);
    $('#statusLabel').text(labelStatus);
    $('.txtDetails').hide();
    $('.lblDetails').show();
    $('#detailsupdatebtn').hide();
    $('#detailscancelBtn').hide();
    var jsonDetails = {};
    /*
    api call to update status
    */
    
    var getDetailsUrl = isPortActive == true ? "sarf/SarfDetailsByTaskID/Get/" +
        processInstanceID : "sarf/AllSarfDetails/Get/" + localStorage["sarfID"];

    $.ajax({
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        url: camundaBaseApiUrl + getDetailsUrl,
        data: JSON.stringify({}),
        //async: false,
        cache: false,
        success: function (data) {
            jsonDetails = data[0];
            initializeDetailsLabel(jsonDetails);
            initializeDetailsText(jsonDetails);


            var getDetailUrl = "sarf/AllSarfDetails/Get/" + localStorage["sarfID"];

            $.ajax({
                method: 'GET',
                dataType: 'json',
                contentType: 'application/json',
                url: camundaBaseApiUrl + getDetailUrl,
                data: JSON.stringify({}),
                //async: false,
                cache: false,
                success: function (data) {
                    jsonDetails = data[0];

                    if (jsonDetails.Vertices != "") {
                        var vertices_arr = [];
                        vertices_arr.push(jsonDetails.Vertices.split(';'))
                        var finalVal = "";
                        $.each(vertices_arr[0], function (i, val) {
                            if (vertices_arr[0][i].length > 0) {
                                finalVal = finalVal + '[' + vertices_arr[0][i] + ']' + ','
                            }

                        });
                        if (finalVal.length > 0) {
                            finalVal = finalVal.substring(0, finalVal.length - 1)
                            localStorage["vertices"] = finalVal;
                        }
                    }

                    $.LoadingOverlay("hide");
                },
                error: function (err) {
                    console.log(err);
                    $.LoadingOverlay("hide");
                }
            });



            $.LoadingOverlay("hide");
        },
        error: function (err) {
            console.log(err);
            $.LoadingOverlay("hide");
        }
    });

    var getSarfPolygonUrl = "sarf/GetAllPolygon/Get";

    $.ajax({
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        url: camundaBaseApiUrl + getSarfPolygonUrl,
        data: JSON.stringify({}),
        //async: false,
        cache: false,
        success: function (data) {
            $.each(data, function (i, item) {
                polygonlist.push(item.Vertices);
            });
            $.LoadingOverlay("hide");
        },
        error: function (err) {
            console.log(err);
            $.LoadingOverlay("hide");
        }
    });

    $('#editBtn').click(function () {
        $('#editBtn').hide();
        $('#detailsupdatebtn').show();
        $('#detailscancelBtn').show();
        $('.lblDetails').hide();
        $('.txtDetails').show();
    });


    $('#detailscancelBtn').click(function () {
        initializeDetailsText(jsonDetails);
        $('#editBtn').show();
        $('#detailsupdatebtn').hide();
        $('#detailscancelBtn').hide();
        $('.lblDetails').show();
        $('.txtDetails').hide();
    });

    $("#btnExpandMap").click(function () {
        $("#mainWrapper").toggleClass("maximized-map");

        map.resize(); //Very important, must be called any time the map div is resized

        var chevron = $(this).find("span");
        chevron.toggleClass("glyphicon-chevron-down");
        chevron.toggleClass("glyphicon-chevron-up");
    });

    $('.statusBtn').click(function (e) {
        var currentBtnText = $(this).text();
        var currentBtnVal = $(this).val();
        var currentStatus = $('#statusLabel').text();
		nodeCount = localStorage["nodeCount"] != null ? localStorage["nodeCount"] : 0;
        updateStatus(currentBtnVal, currentBtnText, nodeCount);
    });

    function GetParameterValues(param) {
        var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < url.length; i++) {
            var urlparam = url[i].split('=');
            if (urlparam[0] == param) {
                return urlparam[1];
            }
        }
    }

    $('#detailsupdatebtn').click(function (e) {
        $.LoadingOverlay("show");
        var sarfid = GetParameterValues("sarfid");
        var sarfNameTxt = $('#txtsarfname').val();
        var facodeTxt = $('#txtfacode').val();
        var searchringTxt = $('#txtsearchring').val();
        var iplanTxt = $('#txtiplan').val();
        var paceTxt = $('#txtpace').val();
        var marketTxt = $('#txtmarket').val();
        var countyTxt = $('#txtcounty').val();
        var fatypeTxt = $('#txtfatype').val();
        var marketcluterTxt = $('#txtmarketcluster').val();
        var regionTxt = $('#txtregion').val();
        var rfdesignTxt = $('#txtrfdesign').val();

        var postSarfDataUrl = "sarf/UpdateSarf/Post";
        var sarf = {
            id: sarfid,
            sarfName: sarfNameTxt,
            facode: facodeTxt,
            searchringid: searchringTxt,
            iplanjob: iplanTxt,
            pacenumber: paceTxt,
            market: marketTxt,
            county: countyTxt,
            fatype: fatypeTxt,
            marketcluster: marketcluterTxt,
            region: regionTxt,
            rfdesignenggid: rfdesignTxt
        };
        /*
      api call to post sarf data
      */
        $.ajax({
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            url: camundaBaseApiUrl + postSarfDataUrl,
            data: JSON.stringify(sarf),
            //async: false,
            cache: false,
            success: function (data) {
                $('#editBtn').show();
                $('#detailsupdatebtn').hide();
                $('#detailscancelBtn').hide();
                $('.lblDetails').show();
                $('.txtDetails').hide();
                $.LoadingOverlay("hide");
            },
            error: function (err) {
                console.log(err);
                $.LoadingOverlay("hide");
            }
        });
        $('#sarfForm').submit();
    });

    restoreCurrentTab();        
    $('#linkHome').click(function (e) {
        e.preventDefault();        
        window.location.href = "http://" + localAppUrl;
    });
});

function onLoadGis() {
    require([
      "esri/map",
      "esri/dijit/BasemapToggle",
      "esri/layers/CSVLayer",
      "esri/Color",
       "esri/dijit/Search",
      "esri/symbols/SimpleMarkerSymbol",
      "esri/renderers/SimpleRenderer",
      "esri/symbols/PictureMarkerSymbol",
      "esri/InfoTemplate",
     // "esri/urlUtils",     
      "esri/toolbars/draw",
      "esri/graphic",
      "esri/Color",
      "esri/toolbars/edit",
     // "esri/symbols/SimpleMarkerSymbol",
      "esri/symbols/SimpleLineSymbol",
      "esri/symbols/SimpleFillSymbol",
      "esri/symbols/CartographicLineSymbol",
      "esri/symbols/TextSymbol",
      "esri/geometry/Circle",
      "esri/geometry/Point",
      "esri/geometry/Polygon",
      "esri/geometry/Polyline",
      "esri/layers/GraphicsLayer",
      "esri/geometry/webMercatorUtils",
      "dojo/parser",
      "dijit/Menu",
      "dijit/MenuItem",
       "dijit/Dialog",
       "dijit/TooltipDialog",
      "dijit/form/Form",
      "dijit/form/TextBox",
      "dijit/form/Button",
      "dojo/on",
      "dojo/_base/array",
      "esri/geometry/webMercatorUtils",
      "dojo/dom",
      "dojo/domReady!"],
    function (Map,
      BasemapToggle,
      CSVLayer,
      Color,
      Search,
      SimpleMarkerSymbol,
      SimpleRenderer,
      PictureMarkerSymbol,
      InfoTemplate,
     // urlUtils,
      Draw,
      Graphic,
      Color,
      Edit,
      // MapView,
      //SimpleMarkerSymbol,
      SimpleLineSymbol,
      SimpleFillSymbol,
      CartographicLineSymbol,
      TextSymbol,
      Circle,
      Point,
      Polygon,
      Polyline,
      GraphicsLayer,
      WebMercatorUtils,
      Parser,
      Menu,
      MenuItem,
      Dialog,
      TooltipDialog,
      Form,
      TextBox,
      Button,
      on,
      array,
      webMercatorUtils,
      dom) {

        var editToolBar, drawToolBar, drawingLayer, ctxMenuForGraphics, selectedGraphic = null;
        var drawing = false, editing = false;
        var tooltipDialog;
        var graphicLayer;
        var hubArray = [];
        var mapViewHubImage = 'black-tower.png';
        var sceneViewHubImage = 'white-tower.png';
        var hubImageUrl = (isPortActive ? serverHubImageUrl : localHubImageUrl) + mapViewHubImage;
        Parser.parse();
        map = new Map("map", {
            basemap: "streets",
            center: [-120.435, 46.159], // lon, lat
            zoom: 5,
            minZoom: 2
        });

        var toggle = new BasemapToggle({
            map: map,
            basemap: "satellite",
            basemaps:
            {
                "streets": {
                    "title": "Map",
                    "thumbnailUrl": "https://js.arcgis.com/3.15/esri/images/basemap/streets.jpg"
                },
                "satellite": {
                    "title": "Satellite",
                    "thumbnailUrl": "https://js.arcgis.com/3.15/esri/images/basemap/satellite.jpg"
                }
            }
        }, "BasemapToggle");
        toggle.startup();

        $(document).on('click', '.basemapImage', function (e) {
            if (e.target.title.toLowerCase() == "satellite") {
                hubImageUrl = (isPortActive ? serverHubImageUrl : localHubImageUrl) + sceneViewHubImage;
            }
            else {
                hubImageUrl = (isPortActive ? serverHubImageUrl : localHubImageUrl) + mapViewHubImage;
            }
            LoadHubs();
            console.log(toggle);
        });


        events.push(map.on("load", function () {            
            map.graphics.clear();
            initDrawing();
            initEditing();
            // createToolbarAndContextMenu();
            if (localStorage["vertices"] != null || localStorage["vertices"] != "") {
                var finalVal = JSON.parse(JSON.stringify(localStorage["vertices"]));
                var fillSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                     new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                     new Color([255, 0, 0]), 2), new Color([0, 0, 0, 0.25])
                  );
                var polygon = new Polygon(new esri.SpatialReference({ wkid: 4326 }));
                finalVal = JSON.parse("[" + finalVal + "]");
                polygon.addRing(finalVal)
                localStorage["currentPolygonRing"] = polygon.rings;
                var gra = new esri.Graphic(polygon, fillSymbol);
                map.graphics.add(gra);
                map.setExtent(gra.geometry.getExtent().expand(2));

                // load hubs
                LoadHubs();

                // load nodes
                LoadNodes();

                // load other polygons
                if (polygonlist.length > 0) {

                    $.each(polygonlist, function (i, val) {

                        var vertices_arr = [];
                        vertices_arr.push(val.split(';'))
                        var finalVal = "";
                        $.each(vertices_arr[0], function (i, val) {
                            if (vertices_arr[0][i].length > 0) {
                                finalVal = finalVal + '[' + vertices_arr[0][i] + ']' + ','
                            }

                        });
                        if (finalVal.length > 0) {
                            finalVal = finalVal.substring(0, finalVal.length - 1)
                            if (finalVal != localStorage["vertices"]) {
                                var finalVertices = JSON.parse(JSON.stringify(finalVal));
                                polygon = new Polygon(new esri.SpatialReference({ wkid: 4326 }));
                                finalVertices = JSON.parse("[" + finalVertices + "]");
                                polygon.addRing(finalVertices)
                                var fillSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                                new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
                                new Color([201, 0, 0]), 2), new Color([0, 0, 0, 0.25])
                                );

                                var gra = new esri.Graphic(polygon, fillSymbol);
                                map.graphics.add(gra);
                            }
                        }
                    });
                }
            }
        }));

        function LoadNodes() {
            var sarfid = localStorage["sarfID"];
            var getSarfNodesUrl = "sarf/GetNodesBySarfID/" + sarfid;;
            var poinArr = [];
            $.ajax({
                method: 'GET',
                dataType: 'json',
                contentType: 'application/json',
                url: camundaBaseApiUrl + getSarfNodesUrl,
                data: JSON.stringify({}),
                async: false,
                cache: false,
                success: function (data) {
                    $.each(data, function (i, item) {
                        poinArr.push(
                            {
                                atoll: item.AtollSiteName,
                                iplan: item.iPlanJobNumber,
                                x: item.Latitude,
                                y: item.Longitude,
                                hubid: item.HubId,
                                type: item.NodeType,
                                vendorname: item.VendorName,
                                police: item.ContactPolice,
                                fire: item.ContactFire,
                                energy: item.ContactEnergy,
                                business: item.BusinessPhone,
                                isOwned: item.IsATTOwned,
                                height: item.StructureHeight,
                                company: item.Company,
                                sarfstatus: item.SarfStatus
                            });
                    });

                },
                error: function (err) {
                    console.log(err);
                }
            });

            //access the lat long data.
            graphicLayer = new GraphicsLayer();
            //get the cuurent polygon
            var finalVal = JSON.parse(JSON.stringify(localStorage["vertices"]));
            finalVal = JSON.parse("[" + finalVal + "]");
            var polygon = new Polygon(new esri.SpatialReference({ wkid: 4326 }));
            polygon.addRing(finalVal)
            var city = "";
            var state = "";
            array.forEach(poinArr, function (p) {                
                var latlng = p.x + "," + p.y;
                var addressurl = "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + latlng + "";
               // if (address == "") {
                    var jqxhr = $.getJSON(addressurl, function (data) {
                        if (data.results.length > 0) {

                            var result = data.results[0].address_components;
                            $.each(result, function (i, v) {
                                if (v.types[0] == 'administrative_area_level_1') {
                                    state = v.short_name;
                                }
                                if (v.types[0] == 'locality') {
                                    city = v.short_name;
                                }
                            });

                        }
                            
                    })
                      .done(function (data) {
                          LoadPoints(p);

                      })
                      .fail(function () {
                          console.log("error");
                      })
                      .always(function () {
                          console.log("complete");
                      });

               // }
               // else{LoadPoints(p);}


                });
           
            function LoadPoints(p) {
                var pointGeom = new Point([p.y, p.x], new esri.SpatialReference({ wkid: 4326 }));
                if (polygon.contains(pointGeom)) {
                    // if point lies inside polygon
                    var sms = new SimpleMarkerSymbol({
                        'size': 5,
                        "outline": {
                            "color": [255, 0, 255, 255],
                            "width": 1,
                            "type": "esriSLS",
                            "style": "esriSLSSolid"
                        }
                    }).setStyle(
                       SimpleMarkerSymbol.STYLE_CIRCLE, 5).setColor(
                       new Color([255, 0, 255, 0.5]));
                    var attr = {
                        "Xcoord": p.y,
                        "Ycoord": p.x,
                        "Atoll": p.atoll,
                        "iPlan": p.iplan,
                        "Type": p.type,
                        "VendorName": p.vendorname,
                        "Police": p.police,
                        "Fire": p.fire,
                        "Energy": p.energy,
                        "Business": p.business,
                        "isOwned": p.isOwned,
                        "height": p.height,
                        "Company": p.company
                    };

                    // Set what attributes you want to add to graphics's info template.
                    var _template = ''
                    _template += '<span  class = "popupFont"><b>Atoll site name:</b> ${Atoll} </span><br/>';
                    _template += '<span  class = "popupFont"><b>iPlan job #:</b> ${iPlan} </span><br/>';
                    _template += '<span  class = "popupFont"><b>Latitude:</b> ${Ycoord} </span><br/>';
                    _template += '<span  class = "popupFont"><b>Longitude:</b> ${Xcoord} </span><br/>';
                    _template += '<span  class = "popupFont"><b>Type:</b> ${Type} </span><br/>';
                    _template += '<span  class = "popupFont"><b>Vendor name:</b> ${VendorName} </span><br/>';

                    if (p.hubid == 0) {
                        sms = new SimpleMarkerSymbol({
                            'size': 5,
                            "outline": {
                                "color": [0, 0, 0, 255],
                                "width": 1,
                                "type": "esriSLS",
                                "style": "esriSLSSolid"
                            }
                        }).setStyle(
                               SimpleMarkerSymbol.STYLE_CIRCLE, 5).setColor(
                               new Color([0, 0, 0, 255]));

                    }
                    else {
                        _template += '<div class = "ruler"></div><br/><span  class = "popupFont"><b>Why this Node?</b></span><br/><ul><li class = "popupFont">Fiber already available.</li><li class = "popupFont">Low leasing cost.</li></ul>';
                    }

                    // Buttons
                    if (p.sarfstatus == 'RF Approval') {
                        if (p.hubid > 0) {
                            _template += '<div class="wfbtnSet topBorder">' +
                            '<button type="button" class="statusBtn mrg15-R blueBtn btn btn-sm btn-primary btn-form btn-draw" value="approve">APPROVE</button>' +
                            '<button type="button" class="statusBtn blueBtn btn btn-sm btn-primary btn-form btn-draw" value="reject">REJECT</button>' +
                            '</div>';
                        }
                    }
                    else {
                        if (p.hubid > 0) {
                            //Contact Details
                            _template += '<br/>'
                            _template += '<a id="displayText" href="javascript:toggleContactInfo();"><b>Contact Details</b></a><div id="toggleText" style="display: none">';
                            _template += '<div class = "cardView"><div class="popupInfo" style="cursor:pointer;">' +
                                            '<div class="popupBody">' +
                                                '<div class = "popupSpan"><b>' + city + '  ${Police}</b></div>' +
                                                '<div class="popupSpan clearfix"> <span class = "cityState">' + city + ', ' + state + '</span></div>' +
                                                '<div class="popupSpan clearfix"><b>Phone No:</b> <span class = "contactNo">8007779696</span></div>' +
                                            '</div>' +
                                         '</div>';
                            _template += '<div class="popupInfo" style="cursor:pointer;">' +
                                            '<div class="popupBody">' +
                                                '<div class = "popupSpan"><b>' + city + '  ${Fire}</b></div>' +
                                                '<div class="popupSpan clearfix"><span class = "cityState">' + city + ', ' + state + '</span></div>' +
                                                '<div class="popupSpan clearfix"><b>Phone No:</b> <span class = "contactNo">8007772525</span></div>' +
                                            '</div>' +
                                         '</div>';
                            _template += '<div class="popupInfo" style="cursor:pointer;">' +
                                            '<div class="popupBody">' +
                                                '<div class = "popupSpan"><b>' + city + '  ${Energy}</b></div>' +
                                                '<div class="popupSpan clearfix"><span class = "cityState">' + city + ', ' + state + '</span></div>' +
                                                '<div class="popupSpan clearfix"><b>Phone No:</b> <span class = "contactNo">8007774433</span></div>' +
                                            '</div>' +
                                         '</div></div>';
                            // _template += 'Business Phone no: ${Business} <br/>';
                            // 
                            _template += '</div>';
                            //Structure Information

                            _template += '<br/>'
                            _template += '<a id="displayStructureInfoText" href="javascript:toggleStructureInfo();"><b>Structure Information</b></a><div id="toggleStructureInfoText" style="display: none">';
                            _template += '<span class = "popupFont"><b>Is structure AT&T owned:</b> ${isOwned}  </span><br/>';
                            _template += '<span class = "popupFont"><b>Structure height (feet): </b>${height} </span><br/>';
                            _template += '<span class = "popupFont"><b>Management company:</b> ${Company} </span><br/>';
                            _template += '</div>';
                        }
                    }

                    var infoTemplate = new InfoTemplate("Node Details", _template);

                    var g = new Graphic(pointGeom, sms, attr, infoTemplate);
                    g.setInfoTemplate(infoTemplate);
                    map.graphics.add(g);

                    $('.contentPane').attr('id', 'style-2');
                    // connect the node with hub
                    //hubArray
                    var lineSymbol = new CartographicLineSymbol(
                       CartographicLineSymbol.STYLE_SOLID,
                       new Color([255, 0, 0]), 1,
                       CartographicLineSymbol.CAP_ROUND,
                       CartographicLineSymbol.JOIN_MITER, 2
                     );

                    array.forEach(hubArray, function (h) {
                        if (h.id == p.hubid) {
                            var lineGeometry = new Polyline(new esri.SpatialReference({ wkid: 4326 }));
                            lineGeometry.addPath([[p.y, p.x], [h.y, h.x]])

                            var lineGraphic = new Graphic(lineGeometry, lineSymbol);
                            map.graphics.add(lineGraphic)
                        }

                    });
                    $('circle').css('cursor', 'pointer');
                    $('image').css('cursor', 'pointer');
                }
            }
        }

        function LoadHubs() {
            var sarfid = localStorage["sarfID"];
            var getSarfHubsUrl = "sarf/GetHubsBySarfID/" + sarfid;
            var poinArr = [];
            $.ajax({
                method: 'GET',
                dataType: 'json',
                contentType: 'application/json',
                url: camundaBaseApiUrl + getSarfHubsUrl,
                data: JSON.stringify({}),
                async: false,
                cache: false,
                success: function (data) {
                    $.each(data, function (i, item) {
                        poinArr.push({ address: item.Address, x: item.Latitude, y: item.Longitude, type: item.HubType });
                        hubArray.push({ x: item.Latitude, y: item.Longitude, id: item.HubId })
                    });
                },
                error: function (err) {
                    console.log(err);
                }
            });

            //access the lat long data.
            graphicLayer = new GraphicsLayer();
            //get the cuurent polygon
            var finalVal = JSON.parse(JSON.stringify(localStorage["vertices"]));
            finalVal = JSON.parse("[" + finalVal + "]");
            var polygon = new Polygon(new esri.SpatialReference({ wkid: 4326 }));
            polygon.addRing(finalVal)
            var pictureMarkerSymbol = null;
            array.forEach(poinArr, function (p) {
                var pointGeom = new Point([p.y, p.x], new esri.SpatialReference({ wkid: 4326 }));
                if (polygon.contains(pointGeom)) {
                    // if point lies inside polygon
                    //<i class="icon-signal" aria-hidden="true" style="font-size: x-large;"></i>
                    pictureMarkerSymbol = new PictureMarkerSymbol(hubImageUrl, 30, 30, "esriPMS", p.y);

                    //var sms =new SimpleMarkerSymbol({
                    //     style: 'square',
                    //    color: "blue",
                    //    size: "8px"
                    // }).setColor(
                    //    new Color([0, 0, 255, 0.5]));
                    var attr = {
                        "Xcoord": p.y,
                        "Ycoord": p.x,
                        "Address": p.address,
                        "Type": p.type
                    }; // Set what attributes you want to add to graphics's info template.
                    var infoMsg = '<span class = "popupFont"><b>Address:</b> ${Address} </span><br/>' +
                        '<span class = "popupFont"><b>Latitude:</b> ${Ycoord} </span><br/>' +
                        '<span class = "popupFont"><b>Longitude:</b> ${Xcoord} </span><br/>' +
                        '<span class = "popupFont"><b>Type:</b> ${Type} </span>';
                    var infoTemplate = new InfoTemplate("Hub Details", infoMsg);
                    var g = new Graphic(pointGeom, pictureMarkerSymbol, attr, infoTemplate);
                    g.setInfoTemplate(infoTemplate);
                    map.graphics.add(g);
                }
            });
        }

        function clearGraphics() {
            $.each(map.graphics.graphics, function (i, val) {
                if (map.graphics.graphics[i].geometry.type == "point") {

                    //  if (parseInt(map.graphics.graphics[i].geometry.x) == parseInt(localStorage["currentlat"]) || parseInt(map.graphics.graphics[i].geometry.y) == parseInt(localStorage["currentlong"])) {
                    if (map.graphics.graphics[i].attributes != undefined) {
                        if (map.graphics.graphics[i].attributes.name == "newPointLayer") {
                            map.graphics.graphics[i].hide();
                            localStorage["currentlat"] = "";
                            localStorage["currentlong"] = "";
                        }
                    }
                }
            });
        }

        //Creates right-click context menu for graphics on the point
        function createGraphicsMenu() {
            ctxMenuForGraphics = new Menu({});
            ctxMenuForGraphics.addChild(new MenuItem({
                label: "Add Node",
                onClick: function () {
                    //$('div.errorMsg').remove();
                    // CREATE DIALOG
                    var node = dom.byId('drawingLayer_layer');
                    if (!tooltipDialog) {
                        var htmlFragment = '';
                        htmlFragment += '<div id="mapTwo" class="dialogtooltip"><input type="text" placeholder="Atoll Site Name" id="txtatollname" width="150px" class="dialogtooltipinput">';
                        htmlFragment += '<div><input type="text" id="txtiplannumber" placeholder="IPlan Job No" width="150px" class="dialogtooltipinput" style="margin-top:0px;"></div>'
                        htmlFragment += '<div><input type="text" id="txtpacenumber" placeholder="Pace Number" width="150px" class="dialogtooltipinput" style="margin-top:0px;"></div>'
                        htmlFragment += '<div><input type="button" id="btncreatenode" value="Save" class="btn blueBtn dialogtootipbtn"/>'
                        htmlFragment += '<input type="button"  id="btncancelnode"  value="Cancel" class="btn whiteBtn dialogtootipbtncancel"/></div></div>'
                        var errorMsg = '<div class= "errorMsg" style = "margin-left: 20px;"><span style="color : red;">Fields must not be empty</span></div>';
                        // CREATE TOOLTIP DIALOG
                        tooltipDialog = new dijit.TooltipDialog({
                            content: htmlFragment,
                            autofocus: !dojo.isIE, // NOTE: turning focus ON in IE causes errors when reopening the dialog
                            refocus: !dojo.isIE
                        });

                        // DISPLAY TOOLTIP DIALOG AROUND THE CLICKED ELEMENT
                        dijit.popup.open({ popup: tooltipDialog, around: node });
                        tooltipDialog.opened_ = true;
                        //Deactivate the toolbar
                        drawToolBar.deactivate();
                        drawing = false;
                        //Enable panning
                        map.enableMapNavigation();
                        //Remove active style from draw button
                        $(".btn-draw.active").removeClass("active");

                        $('#txtatollname').keypress(function () {
                            $('div.errorMsg').remove();
                        });

                        $('#txtiplannumber').keypress(function () {
                            $('div.errorMsg').remove();
                        });

                        $('#txtpacenumber').keypress(function () {
                            $('div.errorMsg').remove();
                        });

                    } else {
                        if (tooltipDialog.opened_) {
                            dijit.popup.close(tooltipDialog);
                            tooltipDialog.opened_ = false;
                            // node.innerHTML = "Show map below me";
                        } else {
                            dijit.popup.open({ popup: tooltipDialog, around: node });
                            tooltipDialog.opened_ = true;
                            //Deactivate the toolbar
                            drawToolBar.deactivate();
                            drawing = false;
                            //Enable panning
                            map.enableMapNavigation();
                            //Remove active style from draw button
                            $(".btn-draw.active").removeClass("active");
                        }
                    }

                    $("#btncancelnode").click(function () {
                        if (tooltipDialog.opened_) {
                            dijit.popup.close(tooltipDialog);
                            tooltipDialog.opened_ = false;
                        }
                        $('div.errorMsg').remove();
                    });
                    $("#btncreatenode").click(function () {
                        $.LoadingOverlay("show");
                        // add node
                        //('div.errorMsg').remove();
                        var saveNodeUrl = "sarf/Node/Post";
                        var txtAtollName = $('#txtatollname').val();
                        var txtIplanNumber = $('#txtiplannumber').val();
                        var txtPaceNumber = $('#txtpacenumber').val();

                        var jsonData = {
                            sarfId: localStorage["sarfID"],
                            latitude: localStorage["lat"],
                            longitude: localStorage["long"],
                            atollSiteName: txtAtollName,
                            iPlanJobNumber: txtIplanNumber,
                            paceNumber: txtPaceNumber
                        }

                        if (txtAtollName.length > 0 && txtIplanNumber.length > 0 && txtPaceNumber.length > 0) {
                            $.ajax({
                                method: 'POST',
                                dataType: 'json',
                                contentType: 'application/json',
                                url: camundaBaseApiUrl + saveNodeUrl,
                                data: JSON.stringify(jsonData),
                                //async: false,
                                cache: false,
                                success: function (data) {
                                    $.LoadingOverlay("hide");
                                    localStorage["currentlat"] = "";
                                    localStorage["currentlong"] = "";
                                    $('#sarfForm').submit();
                                },
                                error: function (err) {
                                    console.log(err);
                                    $.LoadingOverlay("hide");
                                    $('#sarfForm').submit();
                                }
                            });
                        }
                        else {
                            $('#txtpacenumber').after(errorMsg);
                        }

                    });

                }
            }));
            ctxMenuForGraphics.addChild(new MenuItem({
                label: "Clear Node",
                onClick: function () {
                    clearGraphics();
                }
            }));

            ctxMenuForGraphics.startup();



            //Bind and unbind the context menu using the following two events
            map.graphics.on("mouse-over", function (evt) {
                // We'll use this "selected" graphic to enable editing tools
                // on this graphic when the user click on one of the tools
                // listed in the menu.             
                selected = evt.graphic;
                // Let's bind to the graphic underneath the mouse cursor   
                if (evt.graphic.geometry.type == "point" && evt.graphic.attributes != undefined) {
                    if (evt.graphic.attributes.name == "newPointLayer") {
                        ctxMenuForGraphics.bindDomNode(evt.graphic.getDojoShape().getNode());
                    }
                }

            });

            map.graphics.on("mouse-out", function (evt) {
                if (evt.graphic.geometry.type == "point" && evt.graphic.attributes != undefined) {
                    if (evt.graphic.attributes.name == "newPointLayer") {
                        ctxMenuForGraphics.unBindDomNode(evt.graphic.getDojoShape().getNode());
                    }
                }
            });

        }
        //Unload all the events when the application closes to prevent memory leaks
        events.push(map.on("unload", function () {
            for (var i = 0; i < events.length; i++) {
                events[i].remove();
            }
        }));

        //LineSymbol used for polylines
        var lineSymbol = new CartographicLineSymbol(
          CartographicLineSymbol.STYLE_SOLID,
          new Color([255, 0, 0]), 10,
          CartographicLineSymbol.CAP_ROUND,
          CartographicLineSymbol.JOIN_MITER, 5
        );

        //FillSymbol for polygons drawn on the drawing layer
        var drawFillSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
          new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
          new Color([255, 0, 0]), 2), new Color([0, 0, 0, 0.25])
        );

        function initDrawing() {
            drawToolBar = new Draw(map);
            events.push(drawToolBar.on("draw-end", onDrawEnd));

            //Create a dedicated drawing layer
            //You could also just draw on map.graphics (built-in GraphicsLayer)
            drawingLayer = new GraphicsLayer({
                id: "drawingLayer"
            });

            map.addLayer(drawingLayer);

            //Set the click event for the draw buttons
            $(".btn-draw").click(function () {
                map.graphics.clear();
                //If the draw button clicked is already active, deactivate it
                if ($(this).hasClass("active")) {
                    $(this).removeClass("active");

                    drawToolBar.deactivate();
                    drawing = false;

                    //Enable panning
                    map.enableMapNavigation();
                } else {
                    //Activate Draw for the selected tool
                    $(".btn-draw.active").removeClass("active");
                    $(this).addClass("active");

                    var tool = $(this).attr('value');

                    //Disable panning
                    map.disableMapNavigation();

                    drawToolBar.activate(tool);
                    drawing = true;
                }
            });

            //Enable the draw buttons
            $(".btn-draw").removeClass("disabled");

            map.graphics.on("click", function (evt) {
                if (drawing !== true) {
                    if (evt.graphic.geometry.type == "polygon") {
                        if (localStorage["currentPolygonRing"] == evt.graphic.geometry.rings) {

                           // if (localStorage["currentlat"] == "" && localStorage["currentlong"] == "") {

                                var sms = new SimpleMarkerSymbol().setStyle(
                                 SimpleMarkerSymbol.STYLE_CIRCLE).setColor(
                                 new Color([255, 110, 0, 0.5]));
                                var mp = webMercatorUtils.webMercatorToGeographic(evt.mapPoint);
                                map.graphics.add(new esri.Graphic(evt.mapPoint, sms, { "name": "newPointLayer" }));
                                // addPoints(mp);
                                localStorage["lat"] = mp.y;
                                localStorage["long"] = mp.x;

                                localStorage["currentlat"] = evt.mapPoint.x;
                                localStorage["currentlong"] = evt.mapPoint.y;

                                createGraphicsMenu();
                            //}
                           // else {
                               // alert("Please save/clear the current node before adding another node.");
                           // }
                        }

                    }

                }
            });
        }

        function onDrawEnd(evt) {
            //Deactivate the toolbar
            drawToolBar.deactivate();
            drawing = false;

            //Enable panning
            map.enableMapNavigation();

            //Remove active style from draw button
            $(".btn-draw.active").removeClass("active");

            //Use the appropriate symbol depending on geometry type
            var symbol;
            if (evt.geometry.type === "polyline") {
                symbol = lineSymbol;
            } else {
                symbol = drawFillSymbol;
            }

            var graphic = new Graphic(evt.geometry, symbol);

            addGraphicToDrawingLayer(graphic);
        }

        function addGraphicToDrawingLayer(graphic) {

            //For the purpose of this demo we only want one graphic at a time
            drawingLayer.clear();

            drawingLayer.add(graphic);

            //Automatically activate editing
            editToolBar.activate(Edit.EDIT_VERTICES, graphic);
            editing = true;

            postGraphic(graphic.geometry);
        }

        function initEditing() {

            editToolBar = new Edit(map);

            //Events to update vertex data after a shape is modified
            events.push(editToolBar.on("vertex-move-stop", function (e) {
                postGraphic(e.graphic.geometry);
            }));

            events.push(editToolBar.on("vertex-delete", function (e) {
                postGraphic(e.graphic.geometry);
            }));

            events.push(editToolBar.on("graphic-move-stop", function (e) {
                postGraphic(e.graphic.geometry);
            }));

            events.push(editToolBar.on("scale-stop", function (e) {
                postGraphic(e.graphic.geometry);
            }));

            events.push(editToolBar.on("rotate-stop", function (e) {
                postGraphic(e.graphic.geometry);
            }));

            //You can capture double clicks for the map itself or for a specific GraphicsLayer
            //ex. drawingLayer.on("dbl-click", function (e) {...})
            events.push(map.on("dbl-click", function (e) {
                //If editing a graphic toggle the edit mode when that graphic is double-clicked
                if (editing) {
                    var state = editToolBar.getCurrentState();
                    var editingGraphic = state.graphic;

                    if (editingGraphic != null) {
                        //There exists a method to check if a point is "in" a polygon, but no such thing for polylines
                        if ((editingGraphic.geometry.type === "polygon" && editingGraphic.geometry.contains(e.mapPoint))
                            || (editingGraphic.geometry.type === "polyline" && e.graphic === editingGraphic)) {

                            if (state.tool == Edit.EDIT_VERTICES) {
                                editToolBar.activate(Edit.MOVE, editingGraphic);
                            } else if (state.tool == Edit.MOVE) {
                                editToolBar.activate(Edit.EDIT_VERTICES, editingGraphic);
                            }

                            map.infoWindow.hide();
                        }
                    }
                }
            }));
        }

        //Parse the vertices, convert them to a convenient format, then display
        function postGraphic(geometry) {
            $("#vertices").text("");

            if (geometry.type === 'polygon') {
                //Our polygons should have only one ring
                var polygon = geometry.rings[0];
                var vertices = "";

                for (var i = 0; i < polygon.length; i++) {
                    if (geometry.spatialReference.isWebMercator()) {
                        //Convert to traditional decimal degrees
                        longLat = WebMercatorUtils.xyToLngLat(polygon[i][0], polygon[i][1]);
                    } else longLat = [polygon[i][0], polygon[i][1]];

                    x = round(longLat[0], DECIMAL_PRECISION);
                    y = round(longLat[1], DECIMAL_PRECISION);

                    //Convert the vertices to the format x,y;x,y;
                    vertices = vertices + x + ',' + y + ';';
                }

                $("#vertices").text(vertices);

                map.graphics.add(new esri.Graphic(geometry, drawFillSymbol));


                var geographicGeometries = [];
                geographicGeometries.push(esri.geometry.webMercatorToGeographic(geometry));
                var areas = esri.geometry.geodesicAreas(geographicGeometries, esri.Units.KILOMETERS);
                // alert("The area of the polygon is: " + areas[0] + " KM");
                var areaInSqKm = areas * 0.00404685642;
                $("#hdnArea").val(areaInSqKm);
                // alert(areaInSqKm);

            }
            else if (geometry.type === 'polyline') {
                //Assuming one line
                var path = geometry.paths[0];
                var points = "";

                for (var j = 0; j < path.length; j++) {
                    if (geometry.spatialReference.isWebMercator()) {
                        //Convert to traditional decimal degrees
                        longLat = WebMercatorUtils.xyToLngLat(path[j][0], path[j][1]);
                    } else longLat = [path[j][0], path[j][1]];

                    x = round(longLat[0], DECIMAL_PRECISION);
                    y = round(longLat[1], DECIMAL_PRECISION);

                    //Convert the vertices to the format x,y;x,y;
                    points = points + x + ',' + y + ';';
                }

                $("#vertices").text(points);
            }
        }

        function round(num, places) {
            var multiplier = Math.pow(10, places);
            return Math.round((num + 0.00001) * multiplier) / multiplier;
        }

        //Disable double-click zoom if a graphic is being clicked while editing
        events.push(map.on("mouse-down", function (e) {
            if (e.graphic !== undefined && editing) {
                map.disableDoubleClickZoom();
            } else {
                map.enableDoubleClickZoom();
            }
        }));

        //Prevent the infoWindow from opening while drawing
        //Important if your app has drawing/editing and popup windows!
        events.push(map.infoWindow.on("show", function () {
            if (drawing) map.infoWindow.hide();
        }));
    });
}
