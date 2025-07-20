// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react'; // React hooks
import { Button } from '@/components/ui/button'; // ShadCN Button
import FieldList from './components/FieldList'; // FieldList component
import JsonDisplay from './components/JsonDisplay'; // JsonDisplay component
import { generateJsonSchema } from './utils/jsonGenerator'; // Our utility function
import { Plus } from 'lucide-react'; // Plus icon for "Add Top-Level Item"
// import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

function App() {
  // State to hold the entire form structure.
  // Each object in this array represents a top-level field.
  // 'children' array exists if a field's type is 'nested' or 'array'.
  const [formFields, setFormFields] = useState([]);

  // State to hold the formatted JSON string for display in the right pane.
  const [displayedJson, setDisplayedJson] = useState('{}');

  // --- Recursive State Manipulation Functions ---
  // These functions are critical. They handle finding and updating/deleting/adding
  // fields deeply within the nested 'formFields' array while maintaining immutability.

  /**
   * Recursively finds and updates a specific field within the nested 'formFields' structure.
   * It creates new arrays and objects at each level of modification to ensure React's immutability.
   *
   * @param {Array<Object>} currentFields - The current array of fields being processed at this level of recursion.
   * @param {string[]} path - An array of IDs representing the path from the root to the PARENT of the target field.
   * @param {string} fieldId - The ID of the specific field to be updated.
   * @param {object} updates - An object containing the properties to update on the field (e.g., { name: 'new', type: 'string' }).
   * @returns {Array<Object>} A new array of fields with the specified field updated.
   */
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
        // Only recurse into children if it's a 'nested' or 'array' type and has children.
        // Ensure children array exists before passing it for recursion.
        if ((field.type === 'nested' || field.type === 'array') && field.children) {
          return {
            ...field,
            // Recursively call updateFieldInState on the children array
            children: updateFieldInState(field.children, restPath, fieldId, updates),
          };
        }
      }
      return field; // Return field as is if it's not the target parent
    });
  }, []); // Dependencies: This function itself has no external dependencies beyond its arguments

  const deleteFieldFromState = useCallback((
    currentFields,
    path,
    fieldIdToDelete
  ) => {
    // Base Case: If the path is empty, we are at the target list of fields.
    // Filter out the field with the specified ID.
    if (path.length === 0) {
      return currentFields.filter(field => field.id !== fieldIdToDelete);
    }

    // Recursive Step: Path is not empty, recurse deeper.
    const [currentPathId, ...restPath] = path;
    return currentFields.map(field => {
      if (field.id === currentPathId) {
        if ((field.type === 'nested' || field.type === 'array') && field.children) {
          return {
            ...field,
            // Recursively call deleteFieldFromState on the children array
            children: deleteFieldFromState(field.children, restPath, fieldIdToDelete),
          };
        }
      }
      return field;
    });
  }, []); // Dependencies: None

  const addFieldToState = useCallback((
    currentFields,
    path,
    newField
  ) => {
    // Base Case: If the path is empty, we are at the target list (root or immediate child list).
    // Add the new field to the current array.
    if (path.length === 0) {
      return [...currentFields, newField];
    }

    // Recursive Step: Path is not empty, recurse deeper.
    const [currentPathId, ...restPath] = path;
    return currentFields.map(field => {
      if (field.id === currentPathId) {
        // Ensure 'children' array exists. If a 'nested' or 'array' field
        // was just created, its children array might be null or undefined initially.
        const updatedChildren = addFieldToState(field.children || [], restPath, newField);
        return {
          ...field,
          children: updatedChildren,
        };
      }
      return field;
    });
  }, []); // Dependencies: None

  // --- Handlers for FieldList/FieldRow components ---
  // These are passed down as props to the child components and trigger state updates.

  // Handles adding a new field at any level.
  // The 'path' determines where in the nested structure the field is added.
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