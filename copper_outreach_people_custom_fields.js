// Required Input:
//   name: custom_values - custom field values from Copper record
//   name: custom_fields - custom field values
// You can reference the input variables using input.NAME

exports.step = function(input) {

	var field_values = {};

	_.forEach(input.left_system, function(val){
		if(val.value == '' || val.value == null){
			field_values[val.custom_field_definition_id] = '';
			return;
		}
		var index = _.findIndex(input.custom_fields, function(o) {
			return o.id == val.custom_field_definition_id;
		});

		var field_settings = input.custom_fields[index];

		if(field_settings.data_type == 'Dropdown'){
			field_values[val.custom_field_definition_id] = find_dropdown_val(field_settings.options, val.value);
		}else if(field_settings.data_type == 'MultiSelect'){
			field_values[val.custom_field_definition_id] = find_multiselect_vals(field_settings.options, val.value);
		}else{
			field_values[val.custom_field_definition_id] = val.value;
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

	var to_return = {};

	_.forEach(input.custom_mappings, function(mapping) {
		var left_val = field_values[mapping.field_left];
		var right_val = input.right_system[mapping.field_right];
		if(left_val != '' && left_val != null && left_val != right_val){
			to_return[mapping.field_right] = left_val;
		}
	});

  // Get SDR id
  var index = _.findIndex(input.users, function(o) {
				return o.attributes.name == field_values['294556'];
	});

  var sdr_id = '';

	if(index >=0){
	  sdr_id = input.users[index].id;
  }

  // Get Stage
  var index2 = _.findIndex(input.stages, function(o) {
  				return o.attributes.name == field_values['301651'];
  	});

    var stage = '';

  	if(index2 >=0){
  	  stage = input.stages[index2].id;
    }

	return [to_return, sdr_id, stage];
};
