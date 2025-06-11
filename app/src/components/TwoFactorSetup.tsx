import { useState, useEffect } from 'react';
import { fetcher } from '../utils/fetcher';
import './TwoFactorSetup.css';

interface TwoFactorSetupProps {
  onVerified: () => void;
  onCancel: () => void;
}

export const TwoFactorSetup = ({ onVerified, onCancel }: TwoFactorSetupProps) => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQrCode();
  }, []);

  const fetchQrCode = async () => {
    try {
      const response = await fetcher('/user/2fa/setup');
      setQrCode(response.qrCode);
    } catch (err) {
      setError('Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    try {
      await fetcher('/user/2fa/verify', {
        method: 'POST',
        body: { token: verificationCode }
      });
      onVerified();
    } catch (err) {
      setError('Invalid verification code');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="two-factor-setup">
      <h2>Set Up Two-Factor Authentication</h2>
      
      <div className="setup-content">
        {qrCode && (
          <div className="qr-section">
            <h3>1. Scan QR Code</h3>
            <p>Use Google Authenticator or any other 2FA app to scan:</p>
            <img src={qrCode} alt="2FA QR Code" />
          </div>
        )}

        <div className="verification-section">
          <h3>2. Enter Verification Code</h3>
          <p>Enter the 6-digit code from your authenticator app:</p>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            maxLength={6}
            placeholder="000000"
          />
          {error && <div className="error-message">{error}</div>}
          
          <div className="button-group">
            <button 
              className="btn-primary"
              onClick={handleVerify}
              disabled={verificationCode.length !== 6}
            >
              Verify & Enable 2FA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
