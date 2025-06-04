import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { fetcher } from '../utils/fetcher';
import { Loading } from '../components/Loading';
import { useAuth } from '../auth/useAuth';
import './AuthPages.css';

export const Signup = () => {
  const navigate = useNavigate();
  const { loading } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  if (loading) return <Loading />;

  const signup = () => {
    setFormError('');

    fetcher('/user/sign-up/', {
      method: 'POST',
      body: { username, email, password },
    })
      .then(() => navigate('/login'))
      .catch((err: { message?: string }) => {
        setFormError(err.message || 'Signup failed');
      });
  };

  return (
    <main 
      className='auth-wrapper'
    >
      <form
        className='auth-form'
        onSubmit={(e) => e.preventDefault()}
      >
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
        />

        <label>
          Email
        </label>
        <input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>
          Password
        </label>
        <input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          Already have an account? 
          <Link 
            to='/login'
          >
            Login
          </Link>
        </p>
      </form>
    </main>
  );
};
