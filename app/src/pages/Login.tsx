import { Link } from 'react-router-dom';
import { useState } from 'react';
import { fetcher } from '../utils/fetcher';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { Loading } from '../components/Loading';
import './AuthPages.css';

export const Login = () => {
  const { user, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (loading) return <Loading />;
  if (user) return <Navigate to='/' replace />;

  const login = () => {
    fetcher('/login', {
      method: 'POST',
      body: { email, password },
    })
      .then(() => {
        window.location.href = '/';
      })
      .catch(() => alert('Invalid credentials')); // TODO add better error handling
  };

  return (
    <main className='auth-wrapper'>
      <form className='auth-form' onSubmit={(e) => e.preventDefault()}>
        <h1 className='auth-title'>Log In</h1>

        <label htmlFor='email'>Email</label>
        <input id='email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label htmlFor='password'>Password</label>
        <input id='password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button type='submit' onClick={login}>Log In</button>

        <p>
          Already have an account? <Link to='/signup'>Sign up</Link>
        </p>
      </form>
    </main>
  );
};
