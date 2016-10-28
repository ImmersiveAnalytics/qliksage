//
// SAGE2 application: welcome
// by: Luc Renambot <renambot@gmail.com>
//
// Copyright (c) 2015
//

var app, qlikLoaded = false, q;

function addCSS(url, callback) {
	var fileref = document.createElement("link");

	if (callback) {
		fileref.onload = callback;
	}

	fileref.setAttribute("rel", "stylesheet");
	fileref.setAttribute("type", "text/css");
	fileref.setAttribute("href", url);
	document.head.appendChild(fileref);
}

//var qlikHost = "localhost:4848"
var qlikHost = "pe.qlik.com"

// var config = {
// 	host: "pe.r53.qlikview.com",
// 	prefix: "/",
// 	// port: 4848,
// 	port: 443,
// 	// isSecure: window.location.protocol === "https:"
// 	isSecure: true
// };

var config = {
 host: qlikHost,
 port: 443,
 prefix: "/",
 isSecure: true
};

require.config( {
	baseUrl: ( config.isSecure ? "https://" : "http://" ) + config.host + (config.port ? ":" + config.port: "") + config.prefix + "resources"
} );

/****** MOUSE EVENT SIMULATION ******/
function simulate(element, eventName)
{
    var options = extend(defaultOptions, arguments[2] || {});
    var oEvent, eventType = null;

    for (var name in eventMatchers)
    {
        if (eventMatchers[name].test(eventName)) { eventType = name; break; }
    }

    if (!eventType)
        throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

    if (document.createEvent)
    {
        oEvent = document.createEvent(eventType);
        if (eventType == 'HTMLEvents')
        {
            oEvent.initEvent(eventName, options.bubbles, options.cancelable);
        }
        else
        {
            oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
            options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
            options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
        }
        element.dispatchEvent(oEvent);
    }
    else
    {
        options.clientX = options.pointerX;
        options.clientY = options.pointerY;
        var evt = document.createEventObject();
        oEvent = extend(evt, options);
        element.fireEvent('on' + eventName, oEvent);
    }
    console.log("fired event",eventName,"on",element);
    console.log("pointer",options.pointerX,options.pointerY);
    console.log("oEvent",oEvent);
    return element;
}
// var cancelled = !oEvent.initMouseEvent("mouseup",true,true,document.defaultView,0,130,606,130,606,false,false,false,false,0,document.getElementsByTagName("body")[0]);
// document.getElementsByTagName("body")[0].dispatchEvent(oEvent);

function extend(destination, source) {
    for (var property in source)
      destination[property] = source[property];
    return destination;
}

var eventMatchers = {
    'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
    'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
}
var defaultOptions = {
    pointerX: 0,
    pointerY: 0,
    button: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    bubbles: true,
    cancelable: true
}
/****** END MOUSE EVENT SIMULATION ******/


var qlikSAGE = SAGE2_App.extend( {
    init: function(data) {
        // data: contains initialization parameters, such as `x`, `y`, `width`, `height`, and `date`
        this.SAGE2Init('div', data);

        this.resizeEvents = "continuous";//see below for other options

        this.passSAGE2PointerAsMouseEvents = true;

        // initialize your variables
        this.myvalue = 5.0;

		this.element.id = "div" + data.id;
        var el = this.element;
    	this.element.style.zIndex = "100";
        this.element.style.background = "white";

        var elem = document.getElementById( this.element.id );
        iconLookup = {"scatterplot": "scatter-chart", "barchart": "bar-chart-vertical", "linechart": "line-chart", "filterpane": "filterpane", "kpi": "kpi", "map": "map", "treemap": "treemap", "table": "table", "text-image": "text-image", "gauge": "gauge-chart", "piechart": "pie-chart", "combochart": "combo-chart"};
        vizTypes   = {"scatterplot": "scatter-chart", "barchart": "bar-chart-vertical", "linechart": "line-chart", "table": "filterpane", "kpi": "kpi", "treemap": "treemap", "gauge": "gauge-chart", "piechart": "pie-chart", "combochart": "combo-chart", "pivot-table": "filterpane"};

        console.log("isMaster",isMaster);

        addCSS("/user/apps/qlik/scripts/jquery-ui.min.css", function(){
            require( ["js/qlik"], function ( qlik ) {
                q = qlik;
                // console.log("config",config); 
                app = qlik.openApp('7f681155-e10b-4ba6-b7eb-681a39b0a9ef', config); // Happiness
                // app = qlik.openApp('9fdcc1ab-9992-44a0-accf-97f231a07121', config); // Branch Showcase
                // app = qlik.openApp('3f3a866b-238f-4d1a-8aeb-81e97756af7a', config); // Sales & Customr Analysis
                console.log("Finished loading remote qlik app");

                addCSS("https://"+qlikHost+"/resources/autogenerated/qlikui.css", function(){
                    console.log("Finished adding qlikui.css");

                    addCSS("https://"+qlikHost+"/resources/assets/client/client.css", function(){
                        console.log("Finished adding client.css");

                        qlikLoaded = true;

                        console.log("Init'd qlikSAGE with this.state: ",this.state);
                        // if(this.state.hasOwnAttribute("qlikid")){

                        // }

                        var str =
                            "<style>.box { display: inline-block; width: 150px; height: 100px; margin: 5px; border: 1px solid #999999; overflow: hidden} .viz { display: inline-block; width: 75px; height: 60px; margin: 5px; border: 1px solid #999999; overflow: hidden} .customChart { display: inline-block; width: 32%; margin: 5px; border: 1px solid #999999; overflow: hidden; vertical-align: text-top;}</style>" + 
                            "<div id='qvobject' style='position:absolute; background:white;width:100%;height:"+(elem.offsetHeight-40)+"px;top:40px'> \
                                <h2 class='demoHeaders'>Qlik Objects</h2> \
                                <div class='accordion'>";

                                    str += " \
                                    <h3>Sheets & Charts</h3> \
                                    <div class='accordion' id='sheets'>sheets</div>";
                                    app.getAppObjectList("sheet", function(reply){
                                        console.log("sheets & charts", reply);
                                        var sheetsStr = "";

                                        var sheets = reply.qAppObjectList.qItems;
                                        function compare(a,b) {
                                          if (a.qData.rank < b.qData.rank)
                                            return -1;
                                          if (a.qData.rank > b.qData.rank)
                                            return 1;
                                          return 0;
                                        }
                                        sheets.sort(compare);

                                        var sheetObj = {}, timeoutHandle;
                                        function getKeyByValue( obj, value ) {
                                            var foundKey = false;
                                            for(k in obj){
                                                v = obj[k];
                                                for(i=0; i<v.length; i++){
                                                    val = v[i];
                                                    if(val === value){
                                                        foundKey = true;
                                                        break;
                                                    }
                                                };
                                                if(foundKey){
                                                    return k;
                                                }
                                            };
                                        }

                                        $.each(sheets, function(key, value) {
                                            console.log("sheet",value);
                                            sheetObj[value.qInfo.qId] = [];
                                            sheetsStr += "<h3><a class='qlikObjs' href='#'>"+ value.qData.title +"</a></h3><div id='"+ value.qInfo.qId +"'>";
                                            $.each(value.qData.cells, function(k,v){
                                                var objStr = '';
                                                sheetObj[value.qInfo.qId].push(v.name);

                                                app.getObjectProperties(v.name).then(function(model){
                                                    objStr +=  "<div class='box chart' id='" + model.id + "' qlikid='" + model.id + "' onclick=\"var el=$("+elem.id+").find('#qvobject')[0]; app.getObject(el, '"+ model.id +"')\">";
                                                        objStr +=  "<div class='icon-"+ iconLookup[model.properties.visualization] +"' style='font-size:35px;line-height:35px;'></div><div style='padding-top:5px' class='chartTitle'>" + model.id + "<BR>" + model.properties.title + "</div>";
                                                        // objStr +=  "<div class='icon-"+ iconLookup[model.properties.visualization] +"' style='font-size:35px;line-height:35px;'></div><div style='padding-top:5px' class='chartTitle'>" + model.properties.title + "</div>";
                                                    objStr +=  "</div>";
                                                    var sheetID = getKeyByValue(sheetObj, model.id);
                                                    // console.log('adding ' + model.id + ' to ' + sheetID);
                                                    document.getElementById(sheetID).innerHTML += objStr;
                                                }).then(function(){
                                                    window.clearTimeout(timeoutHandle);
                                                    timeoutHandle = window.setTimeout(function(){
                                                        $( "div.accordion" ).accordion({
                                                            heightStyle: "content",
                                                            collapsible: "true"
                                                        });
                                                        $('.chart').sort(function (a, b) {
                                                            console.log(a.id.toLowerCase() + " " + (a.id.toLowerCase() > b.id.toLowerCase() ? ">" : "<") + " " + b.id.toLowerCase());
                                                            return a.id.toLowerCase() > b.id.toLowerCase();
                                                        }).each(function (_, container) {
                                                            $(container).parent().append(container);
                                                        });
                                                    },2500);
                                                });
                                            });
                                            sheetsStr += "</div>";
                                        });
                                        document.getElementById('sheets').innerHTML = sheetsStr;
                                    });
                                    timeoutHandle = window.setTimeout(function(){
                                        $( "div.accordion" ).accordion({
                                            heightStyle: "content",
                                            collapsible: "true"
                                        });
                                    }, 1500);

                                    str += " \
                                    <h3>Visualizations</h3> \
                                    <div id='masterViz'>master visualizations</div>";
                                    app.getAppObjectList("masterobject", function(reply){
                                        console.log("Master viz",reply);
                                        var objStr = "";
                                        $.each(reply.qAppObjectList.qItems, function(key, value) {
                                            objStr +=  "<div class='box' id='" + value.qInfo.qId + "' onclick=\"var el=$("+elem.id+").find('#qvobject')[0]; app.getObject(el, '"+ value.qInfo.qId +"')\">";
                                                objStr +=  "<div class='icon-"+ iconLookup[value.qData.visualization] +"' style='font-size:35px;line-height:35px;'></div><div style='padding-top:5px'>" + value.qMeta.description + "</div>";
                                            objStr +=  "</div>";
                                        });
                                        document.getElementById('masterViz').innerHTML = objStr;
                                    });

                                    str += " \
                                    <h3>Dimensions</h3> \
                                    <div id='masterDim'>master dimensions</div>";
                                    app.getList("DimensionList", function(reply){
                                        console.log("master dim", reply);
                                        var objStr = "";
                                        $.each(reply.qDimensionList.qItems, function(key, value) {
                                            objStr +=  "<div class='box' id='" + value.qInfo.qId + "' ";
                                            objStr +=  "onclick=\"var el=$("+elem.id+").find('#qvobject')[0]; app.visualization.create('table',[{qLibraryId:'"+ value.qInfo.qId +"',qType:'dimension'}],{title:'"+ value.qMeta.title +"'}).then(function(table){ table.show(el); });\">";
                                                objStr +=  "<div class='icon-"+ iconLookup['filterpane'] +"' style='font-size:35px;line-height:35px;'></div><div style='padding-top:5px'>" + value.qMeta.title + "</div>";
                                            objStr +=  "</div>";

                                        });
                                        document.getElementById('masterDim').innerHTML = objStr;
                                    });

                                    str += " \
                                    <h3>Measures</h3> \
                                    <div id='masterMsr'>master measures</div>";
                                    app.getList("MeasureList", function(reply){
                                        console.log("master msr", reply);
                                        var objStr = "";
                                        $.each(reply.qMeasureList.qItems, function(key, value) {
                                            objStr +=  "<div class='box' id='" + value.qInfo.qId + "' ";
                                            objStr +=  "onclick=\"var el=$("+elem.id+").find('#qvobject')[0]; app.visualization.create('kpi',[{qLibraryId:'"+ value.qInfo.qId +"',qType:'measure'}],{title:'"+ value.qMeta.title +"'}).then(function(kpi){ kpi.show(el); });\">";
                                                objStr +=  "<div class='icon-"+ iconLookup['kpi'] +"' style='font-size:35px;line-height:35px;'></div><div style='padding-top:5px'>" + value.qMeta.title + "</div>";
                                            objStr +=  "</div>";
                                        });
                                        document.getElementById('masterMsr').innerHTML = objStr;
                                    });

                                    str += " \
                                    <h3>Build a new chart</h3> \
                                    <div id='custom'>";
                                    str += "<div class='customChart' id='customDim'><h2>Dimension(s)</h2></div>";
                                    app.getList("DimensionList", function(reply){
                                        console.log("customDims", reply);

                                        var objStr = "";
                                        $.each(reply.qDimensionList.qItems, function(key, value) {
                                            // create the necessary elements
                                            var label= document.createElement("label");
                                            var description = document.createTextNode(value.qMeta.title);
                                            var checkbox = document.createElement("input");

                                            checkbox.type = "checkbox";         // make the element a checkbox
                                            checkbox.name = "customDim[]";           // give it a name we can check on the server side
                                            checkbox.value = value.qInfo.qId;   // make its value "pair"

                                            label.appendChild(checkbox);   // add the box to the element
                                            label.appendChild(description);// add the description to the element

                                            // add the label element to your div
                                            document.getElementById('customDim').appendChild(label);
                                            document.getElementById('customDim').appendChild(document.createElement("br"));    
                                        });
                                    });
                                    str += "<div class='customChart' id='customMsr'><h2>Measure(s)</h2></div>";
                                    app.getList("MeasureList", function(reply){
                                        console.log("customMsrs", reply);

                                        var objStr = "";
                                        $.each(reply.qMeasureList.qItems, function(key, value) {
                                            var label= document.createElement("label");
                                            var description = document.createTextNode(value.qMeta.title);
                                            var checkbox = document.createElement("input");

                                            checkbox.type = "checkbox";
                                            checkbox.name = "customMsr[]";
                                            checkbox.value = value.qInfo.qId;

                                            label.appendChild(checkbox);
                                            label.appendChild(description);

                                            document.getElementById('customMsr').appendChild(label);
                                            document.getElementById('customMsr').appendChild(document.createElement("br"));    
                                        });
                                    });
                                    str += "<div class='customChart' id='customViz'><h2>Visualization Type</h2>";
                                    $.each(vizTypes, function(key, value) {
                                        console.log('adding ' + key + ' for ' + value);
                                        str +=  "<div class='viz' id='" + vizTypes[key] + "' onclick=\" \
var checkboxes = document.getElementsByName('customDim[]'); \
var dims = []; \
for (var i=0; i<checkboxes.length; i++) { \
    if (checkboxes[i].checked) { \
        dims.push(checkboxes[i].value); \
    } \
} \
console.log('dims',dims); \
var checkboxes = document.getElementsByName('customMsr[]'); \
var msrs = []; \
for (var i=0; i<checkboxes.length; i++) { \
    if (checkboxes[i].checked) { \
        msrs.push(checkboxes[i].value); \
    } \
} \
console.log('msrs',msrs); \
console.log('vizType','"+ key +"'); \
var el=$("+elem.id+").find('#qvobject')[0]; \
if(dims.length==1 && msrs.length==0) \
    app.visualization.create('"+ key +"',[{qLibraryId:dims[0],qType:'dimension'}]).then(function(chart){ chart.show(el); }); \
else if(dims.length==0 && msrs.length==1) \
    app.visualization.create('"+ key +"',[{qLibraryId:msrs[0],qType:'measure'}]).then(function(chart){ chart.show(el); }); \
else if(dims.length==1 && msrs.length==1) \
    app.visualization.create('"+ key +"',[{qLibraryId:dims[0],qType:'dimension'},{qLibraryId:msrs[0],qType:'measure'}]).then(function(chart){ chart.show(el); }); \
else if (dims.length==2 && msrs.length==1) \
    app.visualization.create('"+ key +"',[{qLibraryId:dims[0],qType:'dimension'},{qLibraryId:dims[1],qType:'dimension'},{qLibraryId:msrs[0],qType:'measure'}]).then(function(chart){ chart.show(el); }); \
else if (dims.length==1 && msrs.length==2) \
    app.visualization.create('"+ key +"',[{qLibraryId:dims[0],qType:'dimension'},{qLibraryId:msrs[0],qType:'measure'},{qLibraryId:msrs[1],qType:'measure'}]).then(function(chart){ chart.show(el); }); \
else if (dims.length==2 && msrs.length==2) \
    app.visualization.create('"+ key +"',[{qLibraryId:dims[0],qType:'dimension'},{qLibraryId:dims[1],qType:'dimension'},{qLibraryId:msrs[0],qType:'measure'},{qLibraryId:msrs[1],qType:'measure'}]).then(function(chart){ chart.show(el); }); \
";
                                            str += "\">";
                                            str +=  "<div class='icon-"+ vizTypes[key] +"' style='font-size:35px;line-height:35px;'></div><div style='padding-top:5px' class='chartTitle'>" + key + "</div>";
                                        str +=  "</div>";
                                    });
                                    str += "</div>"; // close customViz div
                                    str += "</div>"; // close custom div

                                    str += " \
                                    <h3>Current Selections</h3> \
                                    <div class='accordion' id='selections' onclick=\"var el=$("+elem.id+").find('#qvobject')[0]; app.getObject(el, 'CurrentSelections')\">Show Selections</div>";

                                str += " \
                                </div> \
                            </div>";
                        elem.innerHTML += str;
//https://pe.qlik.com/single/?appid=9fdcc1ab-9992-44a0-accf-97f231a07121&obj=AWpwC&opt=nointeraction&select=clearall
                        // var a = document.getElementById('AWpwC');
                        // a.onclick = function(){
                        //     app.getObject('qvobject', 'AWpwC');
                        //     return false;
                        // }
                    });
                });
            });
        });
    },

    //load function allows application to begin with a particular state.  Needed for remote site collaboration.
    load: function(date) {
        //your load code here- update app based on this.state
        // console.log("Calling SAGE2 load with state: ",state);
        console.log("Calling SAGE2 load with this.state: ",this.state);
    },

    draw: function(date) {
        // application specific 'draw'
        // console.log("Draw",this);
   //      if(!qlikLoaded)
			// this.element.innerHTML = "Loading...";
    },

    // showObject: function(id) {
    //     require( ["js/qlik"], function ( qlik ) {
    //      q = qlik;
    //      app = qlik.openApp('9fdcc1ab-9992-44a0-accf-97f231a07121', config);
    //      console.log("Finished loading app");

    //         addCSS("https://pe.qlik.com/resources/autogenerated/qlikui.css", function(){
    //          console.log("Finished adding qlikui.css");
    //         });
    //         addCSS("https://pe.qlik.com/resources/assets/client/client.css", function(){
    //          console.log("Finished adding client.css",el);

    //          qlikLoaded = true;
    //             app.getObject('qvobject', 'cmNQePB');
    //         });
    //     });
    // },

    resize: function(date) {
        // to do:  may be a super class resize
        // or your resize code here
        var sageElem = document.getElementById( this.element.id );
        var qlikElem = $("#"+this.element.id).find('#qvobject')[0];
        $(qlikElem).height((sageElem.offsetHeight-0));
        // qlikElem.style.height = (sageElem.offsetHeight-0) + "px";
        this.state.accordion = true;

        this.refresh(date); //redraw after resize
        $( "#accordion" ).accordion( "refresh" );
        q.resize();
    },

    event: function(eventType, position, user_id, data, date) {
        // sagemep.processAndPassEvents( this.element.id, eventType, position, user_id, data, date );
        // var objID = sagemep.processAndPassEvents( this.element.id, eventType, position, user_id, data, date );
        // if(typeof objID === "undefined"){
        //     // do nothing
        // }else{
        //     console.log("objID",objID);
        //     this.state.qlikID = objID;
            // this.refresh(date);
        // }

        // this.resize(date);

    },

    move: function(date) {
        // this.sage2_x, this.sage2_y give x,y position of upper left corner of app in global wall coordinates
                // this.sage2_width, this.sage2_height give width and height of app in global wall coordinates
                // date: when it happened
        this.refresh(date);
       },

    quit: function() {
        // It's the end
        console.log("Done");
    }
});
