// Required Input:
//   mappings: field mappings between left system and right system
//   left_system: system where the data is originating from
//   right_system: system where the data is being pushed into

exports.step = function(input) {

	var to_return = {};

	_.forEach(input.mappings, function(mapping) {

		var left_val = input.left_system[mapping.field_left];
		var right_val = input.right_system[mapping.field_right];

		if(left_val != '' && left_val != null && left_val != right_val){
			to_return[mapping.field_right] = left_val;
		}

	});

	var left_website = input.left_system['websiteUrl'];
	var right_website = nestedKeyValue(input.right_system.websites, 'category', 'work', 'url');

	if(left_website != null && left_website != '' && left_website != right_website){
		to_return['websites'] = [{
			'url': left_website,
			'category': 'work'
		}];
	}

	var left_locality = input.left_system['locality'];
	var right_locality = nestedValue(input.right_system.address, 'state');

	if(left_locality != null && left_locality != '' && left_locality != right_locality){
		to_return['address'] = {'state': input.left_system['locality']};
	}

	// Get value inside of a nested field ie. address.state
	function nestedValue(field, key){
		if(field != null){
			if(field[key] != null){
				return field[key];
			}
		}
		return '';
	}

	//Get value inside of a list of nested fields ie. websites
	function nestedKeyValue(field, key, condition, value){

		var index = _.findIndex(field, function(o) {
				return o[key] == condition;
		});

		if(index >=0){
	    return field[index][value];
	  }
		return '';
	}

	return to_return;

};
