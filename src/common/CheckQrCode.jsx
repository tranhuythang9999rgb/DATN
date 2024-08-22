import React, { useState } from 'react';
import QrReader from 'react-qr-scanner';
import jsQR from 'jsqr';

const CheckQrCode = () => {
  const [result, setResult] = useState('No result');
  const [scanning, setScanning] = useState(false);

  const handleScan = (data) => {
    if (data) {
      setResult(data.text);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const toggleScanning = () => {
    setScanning(!scanning);
  };

  return (
    <div>
      <h1>QR Code Scanner</h1>
      <button onClick={toggleScanning}>
        {scanning ? 'Stop Scanning' : 'Start Scanning'}
      </button>
      {scanning && (
        <QrReader
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: '100%' }}
        />
      )}
      <p>{result}</p>
    </div>
  );
};

export default CheckQrCode;
