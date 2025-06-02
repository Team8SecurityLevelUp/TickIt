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

  if (loading) return <Loading />;

  const signup = () => {
    fetcher('/signup', {
      method: 'POST',
      body: { username, email, password },
    })
      .then(() => navigate('/login'))
      .catch(() => alert('Signup failed'));
  };

  // TODO add better error handling
  return (
    <main className='auth-wrapper'>
      <form className='auth-form' onSubmit={(e) => e.preventDefault()}>
        <h1 className='auth-title'>Sign Up</h1>

        <label htmlFor='username'>Username</label>
        <input id='username' type='text' value={username} onChange={(e) => setUsername(e.target.value)} required />

        <label htmlFor='email'>Email</label>
        <input id='email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label htmlFor='password'>Password</label>
        <input id='password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button type='submit' onClick={signup}>Sign Up</button>

        <p>
          Already have an account? <Link to='/login'>Login</Link>
        </p>
      </form>
    </main>
  );
};
