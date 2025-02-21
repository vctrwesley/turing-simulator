// src/components/layout/Layout.tsx
import { ReactNode } from 'react';
import Navbar from './navbar';
import Footer from './footer';
import './layout.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <Navbar />
      <div className="content-wrapper">
        <div className="main-content">
          {children}  {}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
