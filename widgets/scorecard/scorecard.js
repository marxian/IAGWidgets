

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
	
	$('#name').html(iag.data.name);
	$('#course').html(iag.course_id);

	var course_stats = iag.data.courses[iag.course_id]['First degree']['Full-time'];

	
	// Success
	var success = 100 - (course_stats['continuation']['Dormant'] + course_stats['continuation']['Left without award']);
	writeScore('success', success);
	
	// Destinations
	var destination_stats = iag.data.courses[iag.course_id]['destinations']['Full-time'];

	var positive = 100 - (destination_stats['Assumed to be unemployed']['First degree'] + destination_stats['Not available for work or study']['First degree'])
	writeScore('destination', positive);
	
	// Satisfaction
	var satisfaction = (course_stats['satisfaction']['Q22']['Actual value']);
	writeScore('satisfaction',satisfaction);
	
	// Top Jobs
	var jobs = [];
	$.each(course_stats['jobtype'], function(k,v){ v['name'] = k;
												   jobs.push(v); });
	var sorted_jobs = _.sortBy(jobs, function(obj){ return obj['% of students'];  });
	
	$.each(sorted_jobs.slice(-3).reverse(), function(){
		$('#jobs ul').append('<li>'+this.name+' : '+this['% of students']+'%</li>');
	});

	
	
	
}

$(document).ready(function(){
	iag.configure();
});
