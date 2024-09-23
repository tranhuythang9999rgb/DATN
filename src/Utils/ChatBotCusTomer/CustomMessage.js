// CustomLinkMessage.js
import React from 'react';

const CustomLinkMessage = ({ url, label }) => {
  return (
    <div>
      {label}: <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
    </div>
  );
};

export default CustomLinkMessage;
