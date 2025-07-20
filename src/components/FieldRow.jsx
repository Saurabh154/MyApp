import React from 'react';
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
import { X } from 'lucide-react';
import FieldList from './FieldList'; 
const FieldRow = ({
  field,
  path,
  onUpdateField,
  onDeleteField,
  onAddField,
}) => {
 
  const isNestedOrArray = field.type === 'nested' || field.type === 'array';


  const currentPath = [...path, field.id];

  return (
    <div className="field-row flex gap-3"> 
      <div className="field-main-controls flex gap-3"> 
        <Input
          type="text"
          placeholder="Field Name"
          value={field.name}
          onChange={(e) =>
          
            onUpdateField(path, field.id, { name: e.target.value })
          }
          className="col-span-1" 
        />

        {/* Field Type Select Dropdown */}
        <Select
          value={field.type}
          onValueChange={(value) =>
            
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
            id={`active-switch-${field.id}`} 
            checked={field.isActive ?? false}
            onCheckedChange={(checked) =>
              onUpdateField(path, field.id, { isActive: checked })
            }
          />
          <Label htmlFor={`active-switch-${field.id}`}></Label>
        </div>
      </div>

      {/* Action button: Delete Field */}
      <div className="field-actions"> 
        <Button
          variant="ghost" 
          size="icon" 
          onClick={() => onDeleteField(path, field.id)} 
          className="delete-button" 
        >
          <X className="h-4 w-4 font-black" />
        </Button>
      </div>

      {/* Conditional rendering for Nested fields container */}
      {/* If the field type is 'nested' or 'array', render a new FieldList */}
      {isNestedOrArray && (
        <div className="nested-fields-container w-full"> 
          <FieldList
            fields={field.children || []} 
            path={currentPath} 
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
