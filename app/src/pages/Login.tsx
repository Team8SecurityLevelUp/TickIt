import { Link } from 'react-router-dom';
import { useState } from 'react';
import { fetcher } from '../utils/fetcher';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { Loading } from '../components/Loading';
import { TwoFactorSetup } from '../components/TwoFactorSetup';
import { TwoFactorLogin } from '../components/TwoFactorLogin';
import './AuthPages.css';
import type { FetchError } from '../types/FetchError';
import TickItLogo from '../assets/TickItLogo.png';

export const Login = () => {
  const { user, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);
  const [showTwoFactorLogin, setShowTwoFactorLogin] = useState(false);

  if (loading) return <Loading />;
  if (user) return <Navigate to='/' replace />;

  const handleLogin = async () => {
    setFormError('');
    setSubmitting(true);

    if (!email || !password) {
      setFormError('Please enter both email and password');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetcher('/user/login', {
        method: 'POST',
        body: { email, password }
      });

      if (response.requires2FA) {
        setShowTwoFactorLogin(true);
      } else {
        setShowTwoFactorSetup(true);
      }
    } catch (error) {
      const fetchError = error as FetchError;
      if (fetchError.status === 401) {
        setFormError('Invalid email or password.');
      } else if (fetchError.status === 403) {
        setFormError('Email not verified.');
      } else if (fetchError.message) {
        setFormError(fetchError.message);
      } else {
        setFormError('An error occurred. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (showTwoFactorSetup) {
    return (
      <TwoFactorSetup
        onVerified={() => (window.location.href = '/')}
        onCancel={() => (window.location.href = '/')}
      />
    );
  }

  if (showTwoFactorLogin) {
    return (
      <TwoFactorLogin
        onSuccess={() => (window.location.href = '/')}
        onCancel={() => setShowTwoFactorLogin(false)}
      />
    );
  }

  return (
    <main className='auth-wrapper'>
      <form
        className='auth-form'
        onSubmit={(e) => e.preventDefault()}
      >

        <img
          src={TickItLogo}
          alt="App Logo"
          className="auth-logo"
        />

        <h1
          className='auth-title'
        >
          Log In
        </h1>

        {formError && (
          <p className="form-error" role="alert">
            {formError}
          </p>
        )}

        <label
          htmlFor='email'
        >
          Email
        </label>

        <input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='example@email.com'
        />

        <label>
          Password
        </label>
        <input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Enter your password'
        />

        <button
          type='submit'
          onClick={handleLogin}
          disabled={submitting}
        >
          {submitting ? 'Logging in...' : 'Log In'}
        </button>

        <p>
          Don't have an account?{' '}
          <Link
            to='/signup'
          >
            Sign up
          </Link>
        </p>
      </form>
    </main>
  );
};
