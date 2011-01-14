// ==UserScript==
// ==UserScript==
// @name Course Labeller
// @namespace http://rewiredstate.org/hacks/courselabeller
// @description This script adds courselabeller widgets to Leicester college course pages
// @include http://www.leicestercollege.ac.uk/*
// ==/UserScript==

var getParameterByName = function (name) {
	name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	var regexS = "[\\?&]"+name+"=([^&#]*)";
	var regex = new RegExp( regexS );
	var results = regex.exec( window.location.href );
	if( results === null ) {
		return "";
	} else {
		return unescape(results[1]);
	}
};

// Identify the ukprn
var ukprn = 10003867;

// Find the element before which to place our widget UGLY WARNING!
var insert_before = null;
try {
	var h1 = document.getElementsByTagName('h1')[1];
	if (h1.innerHTML == 'Course Details') {
	    insert_before = document.getElementsByTagName('table')[0];
	}
} catch(err) {
	// Bug out - nowhere to put the widget
}

var course = null;
// Identify the course
try {
    course = getParameterByName('CourseCode');
}
catch (e) {
    // Bug out - no course to show
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