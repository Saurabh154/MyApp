export const generateJsonSchema = (fields) => {
  const schema = {};

  fields.forEach(field => {
    // Skip inactive fields
    if (!field.isActive) {
      return;
    }

    switch (field.type) {
      case 'string':
      case 'number':
      case 'boolean':
      case 'objectid':
      case 'float':
        schema[field.name] = field.type.toUpperCase();
        break;
      case 'nested':
       
        schema[field.name] = field.children && field.children.length > 0
          ? generateJsonSchema(field.children) // Recursive call
          : {}; // If no children, it's an empty object
        break;
      case 'array':
       
        if (field.children && field.children.length > 0) {
         
            schema[field.name] = [generateJsonSchema(field.children)]; 
        } else {
           
            schema[field.name] = [];
        }
        break;
      default:
      
        schema[field.name] = 'UNKNOWN_TYPE';
    }
  });

  return schema;
};
