import { Outlet } from 'react-router-dom';
import Navbar from './partials/Navbar'

export default function MainLayout() {
  return (
    <div className="site-wrapper">
      <Navbar />
      <div className="pages-container">
        <Outlet />
      </div>
    </div>
  );
}