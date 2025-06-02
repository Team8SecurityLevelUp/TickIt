import { Link } from 'react-router-dom';
import './NotFound.css';

export const NotFound = () => {
  return (
    <main className='notfound-wrapper'>
      <h1>404</h1>
      <p>Page not found.</p>
      <Link to='/' className='back-home'>← Back to Home</Link>
    </main>
  );
};
