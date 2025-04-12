
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed w-full top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-matchee-primary"
          >
            <Heart className="w-6 h-6 animate-pulse-heart text-matchee-primary" fill="#FF6B6B" />
            <span className="font-bold text-xl">Matchee</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/discover" className="font-medium hover:text-matchee-primary transition-colors">
              Discover
            </Link>
            <Link to="/matches" className="font-medium hover:text-matchee-primary transition-colors">
              Matches
            </Link>
            <Link to="/messages" className="font-medium hover:text-matchee-primary transition-colors">
              Messages
            </Link>
            <Link to="/events" className="font-medium hover:text-matchee-primary transition-colors">
              Events
            </Link>
          </nav>
          
          <div className="hidden md:flex items-center gap-4">
            <Button variant="outline" className="matchee-button">
              Log In
            </Button>
            <Button className="matchee-button matchee-gradient">
              Sign Up
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute w-full bg-white border-b border-border animate-slide-up">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link 
              to="/discover" 
              className="py-2 font-medium hover:text-matchee-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Discover
            </Link>
            <Link 
              to="/matches" 
              className="py-2 font-medium hover:text-matchee-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Matches
            </Link>
            <Link 
              to="/messages" 
              className="py-2 font-medium hover:text-matchee-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Messages
            </Link>
            <Link 
              to="/events" 
              className="py-2 font-medium hover:text-matchee-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Events
            </Link>
            <div className="flex flex-col gap-2 pt-2">
              <Button variant="outline" className="matchee-button w-full">
                Log In
              </Button>
              <Button className="matchee-button matchee-gradient w-full">
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
