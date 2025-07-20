// src/components/FieldList.jsx
import React from 'react';
// Importing ShadCN UI Button
import { Button } from '@/components/ui/button';
// Importing FieldRow (relative path as it's in the same components folder)
import FieldRow from './FieldRow';
import { Plus } from 'lucide-react'; // Plus icon for "Add Item" button
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs for new fields

/**
 * Manages and renders a list of FieldRow components.
 * Can represent the top-level list or a nested list of fields.
 * @param {object} props
 * @param {Array<object>} props.fields - An array of field objects to be displayed in this list.
 * @param {string[]} props.path - The array of IDs representing the path to this specific list of fields.
 * @param {function(string[], object): void} props.onAddField - Callback to add a new field to this list.
 * @param {function(string[], string, object): void} props.onUpdateField - Callback to update a field within this list.
 * @param {function(string[], string): void} props.onDeleteField - Callback to delete a field from this list.
 */
const FieldList = ({
  fields,
  path,
  onAddField,
  onUpdateField,
  onDeleteField,
}) => {
  // Handler for adding a new field to *this specific list*.
  // It calls the 'onAddField' prop received from its parent (which is ultimately App.js)
  // and passes its 'path' so App.js knows where to add the new field.
  const handleAddChildField = () => {
    onAddField(path, {
      id: uuidv4(), // Generate a unique ID for the new field
      name: '',      // Default empty name
      type: '', // Default type for new fields
      isActive: false, // Default active status
      children: [],  // Initialize children array for potential future nesting (important for 'nested'/'array' types)
    });
  };

  return (
    <div className="space-y-3"> {/* Tailwind class for vertical spacing between rows */}
      {/* Map through the 'fields' prop to render a FieldRow for each field object */}
      {fields.map((field) => (
        <FieldRow
          key={field.id} // Essential for React list rendering performance and stability
          field={field}
          path={path} // Pass the path of the current list to the FieldRow
          onUpdateField={onUpdateField} // Pass along the update function to FieldRow
          onDeleteField={onDeleteField} // Pass along the delete function to FieldRow
          onAddField={onAddField} // Pass along the add function to FieldRow (for nested adds)
        />
      ))}

      {/* Button to add a new item to *this* list */}
      <Button
        variant="ghost" // ShadCN ghost variant for a subtle appearance
        className="add-item-button w-full bg-blue-400 hover:bg-blue-500" // Custom class for specific styling (from index.css)
        onClick={handleAddChildField} // Calls the handler to add a new field
      >
        <Plus className="h-4 w-4" /> Add Item
      </Button>
    </div>
  );
};

export default FieldList;