import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './partials/Navbar'
import StoreBanner from './components/Store/StoreBanner';

export default function MainLayout() {

  const location = useLocation();

  return (
    <div className="site-wrapper">
      <Navbar />
      {location.pathname === "/" && <StoreBanner />}
      <div className="pages-container">
        <Outlet />
      </div>
    </div>
  );
}