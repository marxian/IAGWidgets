

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
	
	var get_field = function (obj,path,default_result) {
	    var cur_obj = obj;
	    $.each(path, function(i) {
	        var segment = path[i];
	        if (typeof(cur_obj[segment]) == 'undefined') {
	            return default_result;
	        } else {
	            cur_obj = cur_obj[segment];
	        }
	    });
	    return cur_obj;
	}
	
	var calculators = {
        destination: function(obj) {
            first_attempt = get_field(obj, ['graduatejob', 'Full-time', 'First degree'], 0);
            if (first_attempt > 0) {
                return first_attempt;
            } else {
                second_attempt = get_field(obj, ['graduatejob', 'Full-time', 'Other undergraduate'], 0)
                return second_attempt;
            }
        },
        success: function(obj) {
            firsts = get_field(obj,['First degree','Full-time','achievement','First class honours'],0);
            upper_seconds = get_field(obj,['First degree','Full-time','achievement','Upper second class honours'],0);
            return firsts + upper_seconds;
        },
        satisfaction: function(obj) {
            return (obj['First degree']['Full-time']['satisfaction']['Q22']['Actual value']);
        }
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
