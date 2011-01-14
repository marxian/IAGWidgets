// ==UserScript==
// ==UserScript==
// @name Course Labeller
// @namespace http://rewiredstate.org/hacks/brightonlabel
// @description This script adds courselabeller widgets to Leicester college course pages
// @include http://www.brighton.ac.uk/*
// ==/UserScript==

// Works on http://www.brighton.ac.uk/set/prospective/geography.php?PageId=124

// Identify the ukprn
var ukprn = 10000886;
var course = "(L3.31) Physical Geography and Environmental Science";
var insert_before = document.getElementsByTagName('h3')[0];



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