// Required Input:
//   name: object
// You can reference the input variables using input.NAME

exports.step = function(input) {
	
  var to_return = {};
  
	_.forEach(input.object, function(value, key) {
    if(value != "" && value != null){
      to_return[key] = value;
    }
  });
  
  return to_return;
};
