import { Outlet } from 'react-router-dom';
import Navbar from '../partials/Navbar';

function MainLayout() {
  return (
    <>
      <Navbar />
      <div className="pages-container">
        <Outlet />
      </div>
    </>
  );
}

export default MainLayout;