// src/components/FieldRow.jsx
import React from 'react';
// Importing ShadCN UI components using the alias configured in Phase 1
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react'; // X icon from lucide-react

import FieldList from './FieldList'; // Importing FieldList for nested structures (relative path)

/**
 * Represents a single field row in the dynamic form.
 * @param {object} props
 * @param {object} props.field - The field object containing its id, name, type, isActive, children.
 * @param {string[]} props.path - The array of IDs representing the path from the root to this field's parent list.
 * @param {function(string[], string, object): void} props.onUpdateField - Callback to update the field's properties in parent state.
 * @param {function(string[], string): void} props.onDeleteField - Callback to delete this field from parent state.
 * @param {function(string[], object): void} props.onAddField - Callback to add a new child field to a nested list.
 */
const FieldRow = ({
  field,
  path,
  onUpdateField,
  onDeleteField,
  onAddField,
}) => {
  // Determine if this field should display nested children
  const isNestedOrArray = field.type === 'nested' || field.type === 'array';

  // Construct the path for potential children of *this* field.
  // This path is passed down to the nested FieldList.
  const currentPath = [...path, field.id];

  return (
    <div className="field-row flex gap-3"> {/* Custom class for overall row styling (from index.css) */}
      {/* Main field controls: Name Input, Type Select, Active Switch */}
      <div className="field-main-controls flex gap-3"> {/* Custom class for layout (from index.css) */}
        {/* Field Name Input */}
        <Input
          type="text"
          placeholder="Field Name"
          value={field.name}
          onChange={(e) =>
            // Call the parent's update function when name changes
            onUpdateField(path, field.id, { name: e.target.value })
          }
          className="col-span-1" // Tailwind CSS for grid layout
        />

        {/* Field Type Select Dropdown */}
        <Select
          value={field.type}
          onValueChange={(value) =>
            // Call the parent's update function when type changes
            onUpdateField(path, field.id, { type: value })
          }
        >
          <SelectTrigger className="col-span-1">
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="string">String</SelectItem>
            <SelectItem value="number">Number</SelectItem>
            <SelectItem value="boolean">Boolean</SelectItem>
            <SelectItem value="nested">Nested</SelectItem>
            <SelectItem value="objectid">ObjectID</SelectItem>
            <SelectItem value="float">Float</SelectItem>
            <SelectItem value="array">Array</SelectItem>
          </SelectContent>
        </Select>

        {/* Active/Required Switch */}
        <div className="flex items-center space-x-3 col-span-1">
          <Switch
            id={`active-switch-${field.id}`} // Unique ID for accessibility (linking label)
            checked={field.isActive ?? false}
            onCheckedChange={(checked) =>
              // Call the parent's update function when switch changes
              onUpdateField(path, field.id, { isActive: checked })
            }
          />
          <Label htmlFor={`active-switch-${field.id}`}></Label>
        </div>
      </div>

      {/* Action button: Delete Field */}
      <div className="field-actions"> {/* Custom class for layout (from index.css) */}
        <Button
          variant="ghost" // ShadCN ghost style for a subtle button
          size="icon" // ShadCN icon size for a small, square button
          onClick={() => onDeleteField(path, field.id)} // Call parent's delete function
          className="delete-button" // Custom class for specific styling (from index.css)
        >
          <X className="h-4 w-4 font-black" />{/* Lucide-React X icon */}
        </Button>
      </div>

      {/* Conditional rendering for Nested fields container */}
      {/* If the field type is 'nested' or 'array', render a new FieldList */}
      {isNestedOrArray && (
        <div className="nested-fields-container w-full"> {/* Custom class for visual indentation */}
          <FieldList
            fields={field.children || []} // Pass the children array of *this* field to the nested FieldList
            path={currentPath} // Pass the *extended* path to the nested FieldList
            onAddField={onAddField} // Pass the add function down (it will handle the correct path)
            onUpdateField={onUpdateField} // Pass the update function down
            onDeleteField={onDeleteField} // Pass the delete function down
          />
        </div>
      )}
    </div>
  );
};

export default FieldRow;