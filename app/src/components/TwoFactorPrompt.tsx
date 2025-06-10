import { useState } from 'react';
import axios from 'axios';

const TwoFactorPrompt = ({ onVerified }: { onVerified: () => void }) => {
  const [code, setCode] = useState('');

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
      <h2>Enter 2FA Code</h2>
      <input
        type="text"
        placeholder="6-digit code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        maxLength={6}
      />
      <button onClick={handleVerify}>Verify</button>
    </div>
  );
};

export default TwoFactorPrompt;
