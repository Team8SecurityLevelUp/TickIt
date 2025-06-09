import { Link } from 'react-router-dom';
import { useState } from 'react';
import { fetcher } from '../utils/fetcher';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { Loading } from '../components/Loading';
import './AuthPages.css';
import type { FetchError } from '../types/FetchError';
import TickItLogo from '../assets/TickItLogo.png';

export const Login = () => {
  const { user, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <Loading />;
  if (user) return <Navigate to='/' replace />;

  const login = () => {
    setFormError('');
    setSubmitting(true);

    if (!email || !password) {
      setFormError('Please enter both email and password');
      setSubmitting(false);
      return;
    }

    fetcher('/user/login', {
      method: 'POST',
      body: { email, password },
    })
      .then(() => {
        window.location.href = '/';
      })
      .catch((error: FetchError) => {
        if (error.status === 401) {
          setFormError('Invalid email or password.');
        } else if (error.status === 403) {
          setFormError('Email not verified.');
        } else {
          setFormError('Something went wrong. Please try again.');
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <main
      className='auth-wrapper'>
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
          onClick={login}
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
