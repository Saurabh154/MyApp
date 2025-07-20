import React from 'react';
import { Button } from '@/components/ui/button';
import FieldRow from './FieldRow';
import { Plus } from 'lucide-react'; 
import { v4 as uuidv4 } from 'uuid'; 

const FieldList = ({
  fields,
  path,
  onAddField,
  onUpdateField,
  onDeleteField,
}) => {
  
  const handleAddChildField = () => {
    onAddField(path, {
      id: uuidv4(), // Generate a unique ID for the new field
      name: '',      // Default empty name
      type: '', // Default type for new fields
      isActive: false, // Default active status
      children: [], 
    });
  };

  return (
    <div className="space-y-3"> 
      {fields.map((field) => (
        <FieldRow
          key={field.id} 
          field={field}
          path={path} // Pass the path of the current list to the FieldRow
          onUpdateField={onUpdateField} // Pass along the update function to FieldRow
          onDeleteField={onDeleteField} // Pass along the delete function to FieldRow
          onAddField={onAddField} // Pass along the add function to FieldRow (for nested adds)
        />
      ))}

      {/* Button to add a new item to *this* list */}
      <Button
        variant="ghost"
        className="add-item-button w-full bg-blue-400 hover:bg-blue-500" 
        onClick={handleAddChildField} // Calls the handler to add a new field
      >
        <Plus className="h-4 w-4" /> Add Item
      </Button>
    </div>
  );
};

export default FieldList;
