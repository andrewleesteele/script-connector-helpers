// You can reference the input variables using input.NAME
exports.step = function(input) {

  // Get an eloqua field from the current contact.
  // The first/last name fields are treated differently
  // as they are not part of the fieldValues array, they
  // are on the top level object
  function getCurrentValue(eloquaField) {
    var name = eloquaField.name;
    if ('First Name' === name) {
      return input.contact.firstName;
    }
    if ('Last Name' === name) {
      return input.contact.lastName;
    }
    return _.find(input.contact.fieldValues, { id: eloquaField.id });
  }

  function allowValueOverride(eloquaField, existingValue) {
    var val = existingValue.value.toLowerCase();
    var name = eloquaField.name;
    if ('Company' === name && 'not provided' === val) {
      return true;
    }
    if ('Business Phone' === name && ('telephone' === val || 'not provided' === val)) {
      return true;
    }
    return false;
  }

  var eloquaFields = _.filter(_.map(input.mappings, function (mapping) {

    // Get the eloqua field
    var eloquaField = _.find(input.fields, { internalName: mapping.field_right });
    if (!eloquaField) {
      return; 
    }

    // If there's already a value, don't overwrite
    var existingValue = getCurrentValue(eloquaField);
    if (existingValue && !_.isUndefined(existingValue.value) && !allowValueOverride(eloquaField, existingValue)) {
      return; 
    }

    // Get the clearbit value to map to eloqua, if any
    var clearbitValue = _.truncate(_.get(input.clearbit, mapping.field_left), {"length":20});
    var hasClearbitValue = !_.isNull(clearbitValue) && !_.isUndefined(clearbitValue);

    // If there's no value and it's not a forced field, then return
    if (!hasClearbitValue) {
      return; 
    }

    var newFieldValue = hasClearbitValue ? clearbitValue : 'NOT PROVIDED';

    return {
      field: eloquaField.id,
      value: newFieldValue,
    };
    
  }));
  
  // No fields to enrich? Return
  //if (!eloquaFields.length) {
  //  return; 
  //}
  
  var clearbitEnrichedAtField = _.find(input.fields, { internalName: 'C_Clearbit_Last_Enriched_Date1' });
  if (clearbitEnrichedAtField) {
    eloquaFields.push({
      field: clearbitEnrichedAtField.id,
      value: Math.round((new Date()).getTime() / 1000),
    });
  }
  
  var clearbitIsEnrichedField = _.find(input.fields, { internalName: 'C_Clearbit_Enriched1' });
  if (clearbitIsEnrichedField) {
    eloquaFields.push({
      field: clearbitIsEnrichedField.id,
      value: 'Yes',
    });
  }
  
  var emailField = _.find(input.fields, { internalName: 'C_EmailAddress' });
  eloquaFields.push({
    field: emailField.id,
    value: input.contact.emailAddress,
  });
  
  
  return eloquaFields;
  
};