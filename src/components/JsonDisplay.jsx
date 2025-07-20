// src/components/JsonDisplay.jsx
import React from 'react';

/**
 * Displays a JSON string in a pre-formatted block.
 * @param {object} props
 * @param {string} props.jsonData - The JSON string to display.
 */
const JsonDisplay = ({ jsonData }) => {
  return (
    <div className="json-output-container w-full h-full">
      <pre>{jsonData}</pre>
    </div>
  );
};

export default JsonDisplay;