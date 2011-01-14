

iag.configure = function () {
	iag.ukprn = iag.utils.getParameterByName("ukprn");
	iag.course_id = unescape(iag.utils.getParameterByName("course"));
	var url = '/api/ukprn/' + iag.ukprn + '.json';

	$.getJSON(url , function(data){ 
									iag.data = data;	
									iag.display();
								   });
}

iag.display = function(evt) {
	var formatPercentage = function(val) {
		return val.toString() + '%';
	}
	
	var writeScore = function (id, val) {
		$('#' + id + ' > span.score').html(formatPercentage(val));
	}
	
	var calculators = {success : function(obj){ return 100 - (obj['First degree']['Full-time']['continuation']['Dormant'] + obj['First degree']['Full-time']['continuation']['Left without award']);},
					   destination: function(obj){ return 100 - (obj['destinations']['Full-time']['Assumed to be unemployed']['First degree'] + obj['destinations']['Full-time']['Not available for work or study']['First degree']);},
					   satisfaction: function(obj){ return (obj['First degree']['Full-time']['satisfaction']['Q22']['Actual value']); }
					  };
	
	/**
	 * Calculate a score
	 * 
	 * @param {Object} calc  
	 * @param {Object} data
	 * @param {Object} default_result
	 */			
	var calculate = function(calc, data, default_result) {
		try {

			return calculators[calc](data);
		} catch(err) {
			console.log(calc);
			return default_result;
		}
	}
	
	$('#provider').html(iag.data.name);
	$('#course').html(iag.course_id);
    var course_stats = iag.data.courses[iag.course_id];
	console.log(course_stats);
	// Success
	writeScore('success', calculate('success', course_stats, '?'));
	
	// Satisfaction
	writeScore('satisfaction', calculate('satisfaction', course_stats, '?'));
	
	// Destinations
	writeScore('destination', calculate('destination', course_stats, '?'));
	
	// Top Jobs
	// Try to find top jobs
	try {
		// Collapse the keys and values of the jobtypes object for sorting convenience
		var jobs = [];
		$.each(course_stats['First degree']['Full-time']['jobtype'], function(k,v){ v['name'] = k;
										   jobs.push(v); });
	
		// Underscore.js has a nice sortBy...
		var sorted_jobs = _.sortBy(jobs, function(obj){ return obj['% of students'];  });
	
		// Grab the highest valued 3 jobtypes and write some list items
		$.each(sorted_jobs.slice(-3).reverse(), function(){
			$('#jobs ul').append('<li>'+this.name+' : '+this['% of students']+'%</li>');
		});
	} catch(err) {
		$('#jobs').hide();
	}
	
		
	
}

$(document).ready(function(){
	iag.configure();
});
