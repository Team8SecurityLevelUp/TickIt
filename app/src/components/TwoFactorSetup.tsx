import { useEffect, useState } from 'react';
import axios from 'axios';

interface QRCodeResponse {
  qrCode: string;
  secret: string;
}

const TwoFactorSetup = ({ onVerified }: { onVerified: () => void }) => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [code, setCode] = useState('');

  useEffect(() => {
    const fetchQrCode = async () => {
      try {
        const res = await axios.get<QRCodeResponse>('/api/2fa/setup', { withCredentials: true });
        setQrCode(res.data.qrCode);
      } catch (err) {
        console.error('Failed to fetch QR code', err);
      }
    };

    fetchQrCode();
  }, []);

  const handleVerify = async () => {
    try {
      const res = await axios.post('/api/2fa/verify', { token: code }, { withCredentials: true });
      if (res.status === 200) {
        onVerified();
      } else {
        alert('Invalid 2FA token');
      }
    } catch (err) {
      alert('Verification failed');
    }
  };

  return (
    <div>
      <h2>Set up Two-Factor Authentication</h2>
      {qrCode && (
        <div>
          <p>Scan this QR code with your authenticator app:</p>
          <img src={qrCode} alt="2FA QR Code" />
        </div>
      )}
      <input
        type="text"
        placeholder="Enter 6-digit code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        maxLength={6}
      />
      <button onClick={handleVerify}>Verify</button>
    </div>
  );
};

export default TwoFactorSetup;
