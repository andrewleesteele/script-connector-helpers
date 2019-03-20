// Required Input:
// You can reference the input variables using input.NAME

exports.step = function(input) {

	var to_return = [];

	_.forEach(input.mappings, function(mapping) {

		var left_val = input.left_system[mapping.field_left];
		var right_val = find_dropdown_val(input.right_system, 'custom_field_definition_id', mapping.field_right, 'value');

		if(left_val != '' && left_val != null){

			var field_settings = find_field_settings(mapping.field_right);

			if(field_settings.data_type == 'Dropdown'){
				left_val = find_dropdown_val(field_settings.options, 'name', left_val, 'id');

				if(left_val != right_val){
					to_return.push(create_custom_field(mapping.field_right, left_val));
				}

			}else if(field_settings.data_type == 'MultiSelect'){
				return;
			}else{
				if(left_val != right_val){
					to_return.push(create_custom_field(mapping.field_right, left_val));
				}
			}
		}
	});

	function find_field_settings(field_right){
		var index = _.findIndex(input.custom_fields, function(o) {
			return o.id == field_right;
		});

		return input.custom_fields[index];
	}

	function find_dropdown_val(options, key, condition, value){
		var index = _.findIndex(options, function(o) {
			return o[key] == condition;
		});
		if(index >= 0){
			return options[index][value];
		}else {
			return '';
		}
	};

	function create_custom_field(id, value){
		return {
			"custom_field_definition_id": id,
			"value": value
		}
	}

	if(to_return.length == 0){
		return {};
	}

	return {'custom_fields': to_return};
};
