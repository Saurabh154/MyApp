// src/utils/jsonGenerator.js

export const generateJsonSchema = (fields) => {
  const schema = {};

  fields.forEach(field => {
    // Skip inactive fields, as per the video's behavior
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
        // For 'nested' type, recurse into children
        schema[field.name] = field.children && field.children.length > 0
          ? generateJsonSchema(field.children) // Recursive call
          : {}; // If no children, it's an empty object
        break;
      case 'array':
        // The video shows 'array' as an empty array `[]` initially,
        // and then subsequent nested items appear as objects inside it.
        // We'll treat it as an array of objects for consistency if children exist.
        if (field.children && field.children.length > 0) {
            // If the array contains objects (which our current field structure implies for nested arrays)
            // The video shows it as an array with one object containing the nested schema.
            schema[field.name] = [generateJsonSchema(field.children)]; // Array containing nested object
        } else {
            // If no children, it's an empty array
            schema[field.name] = [];
        }
        break;
      default:
        // Fallback for any unexpected types
        schema[field.name] = 'UNKNOWN_TYPE';
    }
  });

  return schema;
};