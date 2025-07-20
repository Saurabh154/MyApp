import React from 'react';

const JsonDisplay = ({ jsonData }) => {
  return (
    <div className="json-output-container w-full h-full">
      <pre>{jsonData}</pre>
    </div>
  );
};

export default JsonDisplay;
