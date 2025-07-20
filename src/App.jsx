import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button'; 
import FieldList from './components/FieldList'; 
import JsonDisplay from './components/JsonDisplay'; 
import { generateJsonSchema } from './utils/jsonGenerator'; 
import { Plus } from 'lucide-react'; 

function App() {
  // State to hold the entire form structure.
  const [formFields, setFormFields] = useState([]);

  // State to hold the formatted JSON string for display in the right pane.
  const [displayedJson, setDisplayedJson] = useState('{}');

 
  const updateFieldInState = useCallback((
    currentFields,
    path,
    fieldId,
    updates
  ) => {
    // Base Case: If the path is empty, we are at the target list of fields.
    // Find the field by its ID and apply updates.
    if (path.length === 0) {
      return currentFields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      );
    }

    // Recursive Step: Path is not empty, so we need to go deeper.
    // Take the first ID from the path, which is the ID of the current parent field.
    const [currentPathId, ...restPath] = path;
    return currentFields.map(field => {
      // Find the parent field in the current 'currentFields' array
      if (field.id === currentPathId) {
      
        if ((field.type === 'nested' || field.type === 'array') && field.children) {
          return {
            ...field,
         
            children: updateFieldInState(field.children, restPath, fieldId, updates),
          };
        }
      }
      return field; // Return field as is if it's not the target parent
    });
  }, []); 

  const deleteFieldFromState = useCallback((
    currentFields,
    path,
    fieldIdToDelete
  ) => {
  
    if (path.length === 0) {
      return currentFields.filter(field => field.id !== fieldIdToDelete);
    }

  
    const [currentPathId, ...restPath] = path;
    return currentFields.map(field => {
      if (field.id === currentPathId) {
        if ((field.type === 'nested' || field.type === 'array') && field.children) {
          return {
            ...field,
         
            children: deleteFieldFromState(field.children, restPath, fieldIdToDelete),
          };
        }
      }
      return field;
    });
  }, []); 

  const addFieldToState = useCallback((
    currentFields,
    path,
    newField
  ) => {
    
    if (path.length === 0) {
      return [...currentFields, newField];
    }

    // Recursive Step: Path is not empty, recurse deeper.
    const [currentPathId, ...restPath] = path;
    return currentFields.map(field => {
      if (field.id === currentPathId) {
       
        const updatedChildren = addFieldToState(field.children || [], restPath, newField);
        return {
          ...field,
          children: updatedChildren,
        };
      }
      return field;
    });
  }, []); // Dependencies: None


  const handleAddField = useCallback((path, newField) => {
    setFormFields(prevFields => addFieldToState(prevFields, path, newField));
  }, [addFieldToState]); // Dependency: addFieldToState ensures useCallback memoizes correctly

  // Handles updating an existing field's properties at any level.
  const handleUpdateField = useCallback((path, fieldId, updates) => {
    setFormFields(prevFields => updateFieldInState(prevFields, path, fieldId, updates));
  }, [updateFieldInState]); // Dependency: updateFieldInState

  // Handles deleting a field at any level.
  const handleDeleteField = useCallback((path, fieldId) => {
    setFormFields(prevFields => deleteFieldFromState(prevFields, path, fieldId));
  }, [deleteFieldFromState]); // Dependency: deleteFieldFromState

  // --- Effect Hook for Real-time JSON Display ---
  // This useEffect hook runs whenever the 'formFields' state changes.
  // It regenerates the JSON schema and updates the 'displayedJson' state.
  useEffect(() => {
    const jsonOutput = generateJsonSchema(formFields); // Call our utility function
    setDisplayedJson(JSON.stringify(jsonOutput, null, 2)); // Prettify JSON with 2 spaces indentation
  }, [formFields]); // Dependency array: Effect runs only when 'formFields' state changes

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 flex flex-col md:flex-row gap-6">
      {/* Left Pane: Form Builder Interface */}
      <div className="flex-1 bg-white p-7 rounded-lg shadow-lg flex flex-col max-h-[90vh]">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Dynamic Form Builder</h1>

        {/* Scrollable area for the field list */}
        <div className="flex-1 overflow-y-auto pr-2">
          <FieldList
            fields={formFields} // Pass the main formFields state to the top-level FieldList
            path={[]} // The root list has an empty path
            onAddField={handleAddField} // Pass down the central add handler
            onUpdateField={handleUpdateField} // Pass down the central update handler
            onDeleteField={handleDeleteField} // Pass down the central delete handler
          />
        </div>

        {/* Button to add a new top-level item */}
        <Button
          className="mr-5 h-10 w-20 "
          variant="outline"
        >
          Submit
        </Button>
      </div>

      {/* Right Pane: Real-time JSON Output */}
      <div className="md:w-1/3  rounded-lg shadow-lg border-gray-700 overflow-hidden flex flex-col max-h-[90vh]">
        <h2 className="text-xl font-bold p-4 bg-gray-600 text-white border-b border-gray-700">JSON Output</h2>
        <JsonDisplay jsonData={displayedJson} /> {/* Pass the generated JSON string */}
      </div>
    </div>
  );
}

export default App;
