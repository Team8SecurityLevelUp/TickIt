import { Link } from 'react-router-dom';
import React from 'react';
import { fetcher } from '../utils/fetcher';
import { Loading } from '../components/Loading';
import { useAuth } from '../auth/useAuth';
import TickItLogo from '../assets/TickItLogo.png';
import './AuthPages.css';

export const Signup = () => {
  const { loading } = useAuth();
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [formError, setFormError] = React.useState('');
  const [signupSuccess, setSignupSuccess] = React.useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const usernameRegex = /^[a-zA-Z0-9]+$/;

  if (loading) return <Loading />;

  const signup = () => {
    setFormError('');

    if (!emailRegex.test(email)) {
      setFormError('Please enter a valid email address');
      return;
    }

    if (!usernameRegex.test(username)) {
      setFormError('Username must be alphanumeric (letters and numbers only)');
      return;
    }

    fetcher('/user/sign-up/', {
      method: 'POST',
      body: { username, email, password },
    })
      .then(() => setSignupSuccess(true))
      .catch((err: { message?: string }) => {
        setFormError(err.message || 'Signup failed');
      });
  };

  return (
    <main
      className='auth-wrapper'
    >

      {!signupSuccess && (<form
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
          Sign Up
        </h1>

        <label >
          Username
        </label>
        <input
          type='text'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder='Enter a unique username'
        />

        <label>
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

        {formError && (
          <p
            role='alert'
          >
            {formError}
          </p>
        )}

        <button
          type='submit'
          onClick={signup}
        >
          Sign Up
        </button>

        <p>
          Already have an account?{' '}
          <Link
            to='/login'
          >
            Login
          </Link>
        </p>
      </form>) ||
        (
          <section
            className='auth-form'
          >
            <h1 className='auth-title'>Verify Your Email</h1>
            <p>We've sent a verification link to &nbsp;
              <strong>
                {email}
              </strong>
            </p>
            <p>Please check your inbox to completed your signup.</p>
            <p>
              Once verified, you can &nbsp;
              <Link
                to='/login'
              >
                log in here
              </Link>.
            </p>
          </section>
        )
      }
    </main>
  );
};
