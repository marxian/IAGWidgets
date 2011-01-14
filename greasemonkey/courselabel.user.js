// ==UserScript==
// ==UserScript==
// @name Course Labeller
// @namespace http://rewiredstate.org/hacks/courselabeller
// @description This script adds courselabeller widgets to Leicester college course pages
// @include http://www.leicestercollege.ac.uk/*
// ==/UserScript==

// Identify the ukprn
var ukprn = 10003867;//window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1, window.location.pathname.length);
alert('running');
var course = null;
// Identify the course
try {
    course = '';
    
}
catch (e) {
    alert("Courselabel Monkey can't find a valid course identifier");
}

if (ukprn) {
    // Find the element before which to place our widget
    var insert_before = document.getElementById('content_bottom_left_first');
    if (insert_before) {
		script = document.createElement('script');
		script.type = "text/javascript";
        script.src = "http://localhost/widgets/iagwidget.js";
		var config = '{"ukprn":"'+ ukprn +'",';
		config += '"widget":"courselabel",';
		config += '"base_url":"http://localhost",';
		config += '"course":"' + course +'"}';
        script.innerHTML = config;
        insert_before.parentNode.insertBefore(script, insert_before);
    } else {
        alert("Courselabel Monkey failed to find a suitable place to put the widget");
    }
}

