/**
 * @author rupert
 */

window["iag"] = {'data':null};
var iag = window["iag"];

iag.dispatcher = $({});

iag.utils = {};

iag.utils.getParameterByName = function (name) {
	name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	var regexS = "[\\?&]"+name+"=([^&#]*)";
	var regex = new RegExp( regexS );
	var results = regex.exec( window.location.href );
	if( results === null ) {
		return "";
	} else {
		return results[1];
	}
};