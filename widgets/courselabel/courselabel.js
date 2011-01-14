

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
		$('#' + id + ' > span.score').html(val);
	}
	
	var getField = function (obj,path,default_result) {
	    var cur_obj = obj;
	    var abort = false;
	    $.each(path, function(i) {
	        if (abort) { continue; }
	        var segment = path[i];
	        if (typeof(cur_obj[segment]) == 'undefined') {
	            cur_obj = default_result;
	            abort = true;
	        } else {
	            cur_obj = cur_obj[segment];
	        }
	    });
	    return cur_obj;
	}
	
	var calculators = {
        destination: function(obj,default_value) {
            var first_attempt = getField(obj, ['graduatejob', 'Full-time', 'First degree'], 0);
            if (first_attempt > 0) {
                return formatPercentage(first_attempt);
            } else {
                var second_attempt = getField(obj, ['graduatejob', 'Full-time', 'Other undergraduate'], default_value);
                return formatPercentage(second_attempt);
            }
        },
        success: function(obj,default_value) {
            var firsts = getField(obj,['First degree','Full-time','achievement','First class honours'],0);
            var upper_seconds = getField(obj,['First degree','Full-time','achievement','Upper second class honours'],0);
            var success = firsts + upper_seconds;
            if (success == 0) {
                return default_value;
            } else {
                return formatPercentage(success);
            }
        },
        satisfaction: function(obj,default_value) {
            var satisfaction = getField(obj,['First degree','Full-time','satisfaction','Q22','Actual value'],0)
            if (satisfaction > 0) {
                return formatPercentage(satisfaction);
            } else {
                return default_value;
            }
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
			return calculators[calc](data,default_result);
		} catch(err) {
			return default_result;
		}
	}
	
	$('#provider').html(iag.data.name);
	$('#course').html(iag.course_id);
    var course_stats = iag.data.courses[iag.course_id];

	// Success
	writeScore('success', calculate('success', course_stats, '?'));
	
	// Satisfaction
	writeScore('satisfaction', calculate('satisfaction', course_stats, '?'));
	
	// Destinations
	writeScore('destination', calculate('destination', course_stats, '?'));
	
	// Top Jobs
	// Try to find top jobs
    // Collapse the keys and values of the jobtypes object for sorting convenience

    var jobs = []
    var jobHash = getField(course_stats, ['First degree', 'Full-time', 'jobtype'], null);
    if (jobHash) {
        $.each(jobHash,function(k, v) {v['name'] = k; jobs.push(v);});

        // Underscore.js has a nice sortBy...
        var sorted_jobs = _.sortBy(jobs, function(obj) { return obj['% of students']; });

        // Grab the highest valued 3 jobtypes and write some list items
        $.each(sorted_jobs.slice( - 3).reverse(), function() {
            $('#jobs ul').append('<li>' + this.name + ' : ' + this['% of students'] + '%</li>');
        });
    } else {
        $('#jobs').hide();
    } 
}

$(document).ready(function(){
	iag.configure();
});
