
import React from 'react';
import { LogoutButton, BrainCircuitIcon } from './Icons';

const NavLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
    <a href={href} className="relative text-gray-300 hover:text-white transition-colors duration-300 group">
        {children}
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-red-500 to-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-center"></span>
    </a>
);

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-gray-900/50 backdrop-blur-lg border-b border-gray-800">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <BrainCircuitIcon className="w-8 h-8 text-orange-500"/>
          <a href="#" className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            NeuroBright
          </a>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink href="#">Home</NavLink>
          <NavLink href="#">Roadmap Creator</NavLink>
          <NavLink href="#">Collaboration</NavLink>
          <NavLink href="#">Personal Dashboard</NavLink>
        </nav>
        <div className="flex items-center">
            <LogoutButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
