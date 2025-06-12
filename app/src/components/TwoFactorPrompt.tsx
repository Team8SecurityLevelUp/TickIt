import { useState } from 'react';
import { fetcher } from '../utils/fetcher';

const TwoFactorPrompt = ({ onVerified }: { onVerified: () => void }) => {
  const [code, setCode] = useState('');

  const handleVerify = async () => {
    try {
      const res = await fetcher('/user/2fa/verify', {
        method: 'POST',
        body: { token: code }
      });

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
