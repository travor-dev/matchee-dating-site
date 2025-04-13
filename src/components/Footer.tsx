
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Instagram, Twitter, Facebook, Download, Smartphone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-border pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 text-matchee-primary">
              <Heart className="w-6 h-6" fill="#FF6B6B" />
              <span className="font-bold text-xl">Matchee</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Find your perfect match, not just a date. Connect with people who share your interests and values.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-matchee-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-matchee-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-matchee-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-matchee-primary transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/careers" className="text-muted-foreground hover:text-matchee-primary transition-colors">Careers</Link>
              </li>
              <li>
                <Link to="/press" className="text-muted-foreground hover:text-matchee-primary transition-colors">Press</Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-matchee-primary transition-colors">Blog</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-muted-foreground hover:text-matchee-primary transition-colors">Help Center</Link>
              </li>
              <li>
                <Link to="/safety" className="text-muted-foreground hover:text-matchee-primary transition-colors">Safety Tips</Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-matchee-primary transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link to="/community" className="text-muted-foreground hover:text-matchee-primary transition-colors">Community Guidelines</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-matchee-primary transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-matchee-primary transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link to="/cookies" className="text-muted-foreground hover:text-matchee-primary transition-colors">Cookie Policy</Link>
              </li>
            </ul>
            
            {/* App Download Buttons */}
            <div className="mt-6">
              <h4 className="font-medium mb-3">Get the App</h4>
              <div className="flex flex-col space-y-2">
                <a 
                  href="#" 
                  className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
                >
                  <Smartphone className="h-5 w-5" />
                  <div>
                    <p className="text-xs leading-none">Download on the</p>
                    <p className="font-bold">App Store</p>
                  </div>
                </a>
                
                <a 
                  href="#" 
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  <Download className="h-5 w-5" />
                  <div>
                    <p className="text-xs leading-none">Get it on</p>
                    <p className="font-bold">Google Play</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Matchee. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
