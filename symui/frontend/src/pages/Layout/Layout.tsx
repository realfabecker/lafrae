import * as React from 'react';
import { Outlet } from 'react-router';
import Header from './Header';
import SideNav from './SideNav';

export default function Layout() {
  return (
    <>
      <header>
        <Header />
      </header>
      <nav>
        <SideNav />
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  );
}
