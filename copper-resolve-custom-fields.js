// Required Input:
//   name: custom_values - custom field values from Copper record
//   name: custom_fields - custom field values 
// You can reference the input variables using input.NAME

exports.step = function(input) {

	var to_return = {};

	_.forEach(input.custom_values, function(val){
		if(val.value == '' || val.value == null){
			to_return[val.custom_field_definition_id] = '';
			return;
		}
		var index = _.findIndex(input.custom_fields, function(o) {
			return o.id == val.custom_field_definition_id;
		});

		var field_settings = input.custom_fields[index];

		if(field_settings.data_type == 'Dropdown'){
			to_return[val.custom_field_definition_id] = find_dropdown_val(field_settings.options, val.value);
		}else if(field_settings.data_type == 'MultiSelect'){
			to_return[val.custom_field_definition_id] = find_multiselect_vals(field_settings.options, val.value);
		}else{
			to_return[val.custom_field_definition_id] = val.value;
		}
	});

	function find_dropdown_val(options, id){
		var index = _.findIndex(options, function(o) {
			return o.id == id;
		});

		return options[index]['name'];
	};

	function find_multiselect_vals(options, ids){
		var multi_values = [];

		_.forEach(ids, function(o) {
			multi_values.push(find_dropdown_val(options, o));
		});

		return _.join(multi_values, ', ');
	}

	return to_return;
};
