$(document).ready(function(){
    url = "https://spreadsheets.google.com/feeds/list/1BwtWWt4G5Q8QFP4kpxgDqA2bLcSvcsg1h1BdT43XmWA/od6/public/values?alt=json"

	$.getJSON(url, function(json){
		var data = clean_google_sheet_json(json);

		_.each(data, function(datum) {
			template_html = compile_template_to_html("#award-template", datum);
			$("#myAwards").append(template_html);
		});
	});

});

// Takes in template id, compiles the template to html using data json object
// and then inserts it into given div id
function compile_and_insert_html(template_id, div_id, data) {
	var template = _.template($(template_id).html());
	var template_html = template({
		'data': data
	});
	$(div_id).html(template_html);
}

// Takes in template id and data, returns compiled html string
function compile_template_to_html(template_id, data) {
	var template = _.template($(template_id).html());
	var template_html = template({
		'data': data
	});
	return template_html;
}



// takes in JSON object from google sheets and turns into a json formatted 
// this way based on the original google Doc
// [
// 	{
// 		'column1': info1,
// 		'column2': info2,
// 	}
// ]
function clean_google_sheet_json(data){
	var formatted_json = [];
	var elem = {};
	var real_keyname = '';
	$.each(data.feed.entry, function(i, entry) {
		elem = {};
		$.each(entry, function(key, value){
			// fields that were in the spreadsheet start with gsx$
			if (key.indexOf("gsx$") == 0) 
			{
				// get everything after gsx$
				real_keyname = key.substring(4); 
				elem[real_keyname] = value['$t'];
			}
		});
		formatted_json.push(elem);
	});
	return formatted_json;
}
