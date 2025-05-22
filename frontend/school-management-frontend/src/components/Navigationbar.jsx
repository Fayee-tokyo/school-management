import { Link } from 'react-router-dom';

export default function Navigationbar() {
  return (
    <nav style={{ padding: '1rem', background: '#f4f4f4' }}>
      <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
      <Link to="/about">About</Link>
    </nav>
  );
}