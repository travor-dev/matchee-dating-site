
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Menu, X, LogIn, UserCircle, MessageSquare, Users, Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsMenuOpen(false);
  };

  const goToProfile = () => {
    navigate('/profile');
    setIsMenuOpen(false);
  };

  const goToUserProfile = () => {
    if (user) {
      navigate(`/user/${user.id}`);
      setIsMenuOpen(false);
    }
  };

  const goToAuth = () => {
    navigate('/auth');
    setIsMenuOpen(false);
  };

  // If user is logged in, show different navigation items
  const navigationItems = user ? [
    { name: 'Matches', path: '/matches' },
    { name: 'Messages', path: '/messages' }
  ] : [
    { name: 'Discover', path: '/discover' },
    { name: 'Events', path: '/events' }
  ];

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
            {navigationItems.map((item) => (
              <Link 
                key={item.name}
                to={item.path} 
                className="font-medium hover:text-matchee-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative"
                  onClick={() => navigate('/messages')}
                  aria-label="Messages"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-matchee-primary rounded-full" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  aria-label="Search"
                  onClick={() => navigate('/matches')}
                >
                  <Search className="h-5 w-5" />
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name} />
                        <AvatarFallback className="bg-matchee-primary/20 text-matchee-primary">
                          {profile?.full_name?.charAt(0) || user.email?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex items-center justify-start p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        {profile?.full_name && (
                          <p className="font-medium">{profile.full_name}</p>
                        )}
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={goToUserProfile} className="cursor-pointer">
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>View Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={goToProfile} className="cursor-pointer">
                      <Users className="mr-2 h-4 w-4" />
                      <span>Edit Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleSignOut}
                      className="cursor-pointer"
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="matchee-button"
                  onClick={goToAuth}
                >
                  Log In
                </Button>
                <Button 
                  className="matchee-button matchee-gradient"
                  onClick={() => {
                    navigate('/auth');
                    setTimeout(() => {
                      document.querySelector('[value="signup"]')?.dispatchEvent(
                        new MouseEvent('click', { bubbles: true })
                      );
                    }, 100);
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
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
            {navigationItems.map((item) => (
              <Link 
                key={item.name}
                to={item.path} 
                className="py-2 font-medium hover:text-matchee-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-2">
              {user ? (
                <>
                  <Button 
                    variant="outline" 
                    className="matchee-button w-full flex items-center justify-center gap-2"
                    onClick={goToUserProfile}
                  >
                    <UserCircle className="h-4 w-4" />
                    View Profile
                  </Button>
                  <Button 
                    variant="outline" 
                    className="matchee-button w-full flex items-center justify-center gap-2"
                    onClick={goToProfile}
                  >
                    <Users className="h-4 w-4" />
                    Edit Profile
                  </Button>
                  <Button 
                    className="matchee-button matchee-gradient w-full"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    className="matchee-button w-full flex items-center justify-center gap-2"
                    onClick={goToAuth}
                  >
                    <LogIn className="h-4 w-4" />
                    Log In
                  </Button>
                  <Button 
                    className="matchee-button matchee-gradient w-full"
                    onClick={() => {
                      navigate('/auth');
                      setIsMenuOpen(false);
                      setTimeout(() => {
                        document.querySelector('[value="signup"]')?.dispatchEvent(
                          new MouseEvent('click', { bubbles: true })
                        );
                      }, 100);
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
