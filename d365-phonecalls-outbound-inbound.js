// Input: call: $.steps.outreach-1.data.attributes

// You can reference the input variables using input.NAME
exports.step = function(input) {
  
	var to_return = {};
  
  if(input.call.direction === "outbound"){
    to_return["customer_phone"] = input.call.to;
    to_return["direction"] = [2,1];
  }else{
    to_return["customer_phone"] = input.call.from;
    to_return["direction"] = [1,2];
  }
  
  return to_return;
};
