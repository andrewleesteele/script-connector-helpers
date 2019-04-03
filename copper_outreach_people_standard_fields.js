// Required Input:
//   name: custom_values - custom field values from Copper record
//   name: custom_fields - custom field values
// You can reference the input variables using input.NAME

exports.step = function(input) {

	var to_return = {};

	_.forEach(input.standard_mappings, function(mapping) {
		var left_val = input.left_system[mapping.field_left];
		var right_val = input.right_system[mapping.field_right];
		if(left_val != "" && left_val != null && left_val != right_val){
			to_return[mapping.field_right] = left_val;
		}
	});

	_.forEach(input.list_mappings, function(mapping) {
		var left_val = input.left_system[mapping.field_left];
		var right_val = input.right_system[mapping.field_right];
		if(left_val != "" && left_val != null && String(left_val) != String(right_val)){
			to_return[mapping.field_right] = left_val;
		}
	});

	var types = {
		'websites': 'url',
		'phone_numbers': 'number',
		'emails': 'email'
	}

	_.forEach(input.work_mappings, function(mapping) {
		var type = types[mapping.field_left];
		var left_work = _.map(input.left_system[mapping.field_left], function(o) {
		    if(o.category === 'work') return o[type];
		});
		var right_work = input.right_system[mapping.field_right];

		if(right_work === undefined || (left_work.length == 0 && right_work.length != 0)){
            to_return[mapping.field_right] = left_work;
        }else if(String(left_work.sort()) != String(right_work.sort())){
			to_return[mapping.field_right] = left_work;
		}
	});

	_.forEach(input.work2_mappings, function(mapping) {
		var type = types[mapping.field_left];
		var left_work = _.map(input.left_system[mapping.field_left], function(o) {
		    if(o.category === 'work') return o[type];
		});
		var right_work = input.right_system[mapping.field_right];

		if(right_work === undefined || (left_work.length == 0 && right_work.length != null)){
            to_return[mapping.field_right] = "";
        }else if(!left_work.includes(right_work)){
			to_return[mapping.field_right] = left_work[0];
		}
	});

	_.forEach(input.address_mappings, function(mapping) {
		var left_val = nestedValue(input.left_system.address, mapping.field_left);
		var right_val = input.right_system[mapping.field_right];
		if(left_val != "" && left_val != null && left_val != right_val){
			to_return[mapping.field_right] = left_val;
		}
	});

	function nestedValue(path, left_key){
		if(path != null){
			if(path[left_key] != null){
				return path[left_key];
			}
		}
		return '';
	}


	return to_return;
};
