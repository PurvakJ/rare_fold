import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

function Layout() {
  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">
        <Outlet />
        <Footer />
      </main>
    </div>
  );
}

export default Layout;