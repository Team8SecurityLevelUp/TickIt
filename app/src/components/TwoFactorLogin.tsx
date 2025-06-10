import { useState } from 'react';
import { fetcher } from '../utils/fetcher';
import './TwoFactorLogin.css';

interface TwoFactorLoginProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const TwoFactorLogin = ({ onSuccess, onCancel }: TwoFactorLoginProps) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      await fetcher('/user/2fa/login', {
        method: 'POST',
        body: { otp: code }
      });
      onSuccess();
    } catch (err) {
      setError('Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="two-factor-login">
      <h2>Two-Factor Authentication Required</h2>
      
      <div className="login-content">
        <p>Please enter the verification code from your authenticator app</p>
        
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength={6}
          placeholder="000000"
          disabled={loading}
        />

        {error && <div className="error-message">{error}</div>}

        <div className="button-group">
          <button 
            className="btn-primary"
            onClick={handleSubmit}
            disabled={code.length !== 6 || loading}
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
          <button 
            className="btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};