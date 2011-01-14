// ==UserScript==
// ==UserScript==
// @name Course Labeller
// @namespace http://rewiredstate.org/hacks/courselabeller
// @description This script adds courselabeller widgets to Leicester college course pages
// @include http://www.leicestercollege.ac.uk/*
// ==/UserScript==

// Identify the ukprn
var ukprn = 10003867;

// Find the element before which to place our widget
var insert_before = null;
try {
	insert_before = document.getElementsByTagName('table')[0];
} catch(err) {
	// Bug out - nowhere to put the widget
}

var course = 'TEst Course';
// Identify the course
try {
    course = 'Test Course';
    
}
catch (e) {
    alert("Courselabel Monkey can't find a valid course identifier");
}

if (ukprn && course && insert_before) {
	script = document.createElement('script');
	script.type = "text/javascript";
    script.src = "http://localhost/widgets/iagwidget.js";
	var config = '{"ukprn":"'+ ukprn +'",';
	config += '"widget":"courselabel",';
	config += '"base_url":"http://localhost",';
	config += '"course":"' + course +'"}';
    script.innerHTML = config;
    insert_before.parentNode.insertBefore(script, insert_before);
}