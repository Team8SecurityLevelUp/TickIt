import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import TickItLogo from '../assets/TickItLogo.png';
import './AuthPages.css';
import { fetcher } from '../utils/fetcher';

export const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const hasFetched = useRef(false); // 🛑 prevents multiple fetches

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const email = searchParams.get('email');
    const token = searchParams.get('token');

    if (!email || !token) {
      setStatus('failed');
      return;
    }

    fetcher(`/user/verify-email?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`)
      .then((res) => {
        if (res?.message === 'Email verified successfully') {
          setStatus('success');
        } else {
          setStatus('failed');
        }
      })
      .catch((err) => {
        console.error('Verification failed:', err);
        setStatus('failed');
      });
  }, [searchParams]);

  return (
    <main className="auth-wrapper">
      <section className="auth-form">
        <header>
          <img src={TickItLogo} alt="App Logo" className="auth-logo" />
          <h1 className="auth-title">Email Verification</h1>
        </header>

        {status === 'loading' && <p role="status">Verifying your email...</p>}

        {status === 'success' && (
          <section className="verification-message">
            <p role="alert">Your email has been successfully verified! You can now log in.</p>
            <nav>
              <button type="button" onClick={() => navigate('/login')}>Go to Login</button>
            </nav>
          </section>
        )}

        {status === 'failed' && (
          <section className="verification-message">
            <p role="alert">Verification failed. The link may be invalid or expired.</p>
            <nav>
              <button type="button" onClick={() => navigate('/signup')}>Sign Up Again</button>
            </nav>
          </section>
        )}
      </section>
    </main>
  );
};
