
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import MatcheeCard, { Profile } from '@/components/MatcheeCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Matches = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*');

        if (error) {
          throw error;
        }

        // Transform to Profile format
        const formattedProfiles = data.map((profile) => ({
          id: profile.id,
          name: profile.full_name || 'Anonymous',
          age: 0, // You would calculate this from DOB if available
          location: profile.location || 'Unknown location',
          distance: 'Unknown distance',
          bio: profile.bio || 'No bio available',
          photos: [profile.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'],
          interests: [], // Would need a separate query for interests
          compatibilityScore: Math.floor(Math.random() * 100), // Random for now
          isVerified: true, // Default to true for demo
        }));

        setProfiles(formattedProfiles);
        setFilteredProfiles(formattedProfiles);
      } catch (error) {
        console.error('Error fetching profiles:', error);
        toast({
          title: "Error",
          description: "Could not fetch profiles. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [toast]);

  // Filter profiles based on search term
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredProfiles(profiles);
    } else {
      const filtered = profiles.filter((profile) =>
        profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.bio.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProfiles(filtered);
    }
  }, [searchTerm, profiles]);

  const handleLike = (id: string) => {
    toast({
      title: "Profile Liked",
      description: "You've liked this profile!"
    });
  };
  
  const handleSpark = (id: string) => {
    toast({
      title: "Spark Sent!",
      description: "You've sent a spark to this profile!"
    });
  };

  const handleViewProfile = (id: string) => {
    navigate(`/user/${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Find Your Match</h1>
          
          <div className="relative">
            <Input
              type="text"
              placeholder="Search by name, location, or interests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-matchee-primary"></div>
          </div>
        ) : filteredProfiles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">No matches found. Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((profile) => (
              <MatcheeCard
                key={profile.id}
                profile={profile}
                onLike={() => handleLike(profile.id)}
                onSpark={() => handleSpark(profile.id)}
                onViewProfile={() => handleViewProfile(profile.id)}
              />
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Matches;
