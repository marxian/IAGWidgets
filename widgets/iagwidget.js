// Put everything inside an anonymous closure to keep us safe and private
( function() {
    
 // Make a unique namespace to work in and assign a $ shortcut  
 var trueName = '';
 for (var i = 0; i < 16; i++) {
  trueName += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
 }
 window[trueName] = {};
 var $ = window[trueName];
 
 $.f = function() {
  return {
   init : function(target) {
    // CScripts always execute in order right?
    var theScripts = document.getElementsByTagName('SCRIPT');
    for (var i = 0; i < theScripts.length; i++) {
     if (theScripts[i].src.match(target)) {
      
      $.config = {};
      if (theScripts[i].innerHTML) {
       $.config = $.f.parseJson(theScripts[i].innerHTML);
      } 
      else { $.config.err = 'No Configuration Data Supplied'; }
      
      
      if (!$.config.err) {
          
          $.w = document.createElement('IFRAME');
          var base_url = $.config.base_url ? $.config.base_url : '.';
          var widget_url = null;
          var iframe_style = null;

          if ($.config.widget) {
            switch ($.config.widget) {
                case 'scorecard':
                    widget_url = "/widgets/scorecard/scorecard.html";
                    iframe_style = "border: 2px solid black; width: 100%; height: 430px; overflow: hidden;";
                    break;
                case 'courselabel':
                    widget_url = "/widgets/courselabel/courselabel.html";
                    iframe_style = "-webkit-border-radius: 20px; -moz-border-radius: 20px; border-radius: 20px; border: 0px dashed #C93; width: 360px; height: 350px; overflow: hidden;";
                    break;
            }
          }
          $.w.src = base_url + widget_url;
          $.w.scrolling = "no";
          $.w.frameBorder = "0";
          if ($.config.iframe_style) {
              $.w.style.cssText = $.config.iframe_style;  
          } else {
            $.w.style.cssText = iframe_style;
          }
          
          // Pass appropriate config via the URL
          $.w.src += '?ukprn=' + $.config.ukprn;
		  $.w.src += '&course=' + $.config.course;
            
          $.w.allowtransparency = "true";
          $.w.frameborder = "0";

          
      } else {
          $.w = document.createElement('DIV');
          $.w.innerHTML = 'Error: '+ $.config.err;
      }
      
    var insert_before = theScripts[i];
	theScripts[i].parentNode.insertBefore($.w, theScripts[i]);
	
      
      theScripts[i].parentNode.removeChild(theScripts[i]);
      break;
     }
    }
   },
   parseJson : function(json) {
    this.parseJson.data = json;
    if ( typeof json !== 'string') {
     return {"err":"trying to parse a non-string JSON object"};
    }
    try {
     var f = Function(['var document,top,self,window,parent,Number,Date,Object,Function,',
      'Array,String,Math,RegExp,Image,ActiveXObject;',
      'return (' , json.replace(/<\!--.+-->/gim,'').replace(/\bfunction\b/g,'function­') , ');'].join(''));
       return f();
    } catch (e) {
     return {"err":"trouble parsing JSON object"};
    }
   }
  };
 }();
 
 // Set the source selector so that we can tidy up our script elements
 var thisScript = /iagwidget.js/;
 
 // Run init once the page has loaded. Don't get involved in window.onload
 if (typeof window.addEventListener !== 'undefined') {
  window.addEventListener('load', function() { $.f.init(thisScript); }, false);
 } else if (typeof window.attachEvent !== 'undefined') {
  window.attachEvent('onload', function() { $.f.init(thisScript); });
 }
 
 // Run immediately if asked to
 if (typeof window.iagwidget_immediate_load !== 'undefined') {
    if (window.iagwidget_immediate_load) {
        $.f.init(thisScript);
    } 
 }

 
 
})();