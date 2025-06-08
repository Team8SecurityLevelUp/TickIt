import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface QRCodeResponse {
  qrCode: string;
  secret: string;
  otpauthUrl?: string;
}

const TestQRCode: React.FC = () => {
  const [qrCode, setQrCode] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        const response = await axios.get<QRCodeResponse>('http://localhost:5000/api/user/2fa/setup');
        if (response.data && response.data.qrCode) {
          setQrCode(response.data.qrCode);
        } else {
          setError('No QR code received from server');
        }
      } catch (error) {
        console.error('Error fetching QR code:', error);
        setError('Failed to fetch QR code');
      }
    };

    fetchQRCode();
  }, []);

  return (
    <div style={{ 
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh'
    }}>
      <h1>Test QR Code</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {qrCode ? (
        <img 
          src={qrCode} 
          alt="QR Code" 
          style={{ 
            maxWidth: '256px',
            margin: '20px',
            border: '1px solid #ccc',
            padding: '10px'
          }} 
        />
      ) : (
        <p>Loading QR code...</p>
      )}
    </div>
  );
};

export default TestQRCode;