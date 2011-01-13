/**
 * Base library for IAG Widgets
 * 
 * @author rupert@neontribe.co.uk
 */

// We'll keep ourselves to a single global footprint
window["iag"] = {'data':null};
var iag = window["iag"];

// Namespace for utilities
iag.utils = {};

/**
 * Grab a query string variable from the calling url
 * Unescape it on the way
 * 
 * @param {Object} name
 */
iag.utils.getParameterByName = function (name) {
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