
import React, { useState } from 'react';
import { Sliders, Filter, MapPin, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MatcheeCard, { Profile } from '@/components/MatcheeCard';
import { toast } from '@/hooks/use-toast';

// Sample profiles
const sampleProfiles: Profile[] = [
  {
    id: '1',
    name: 'Sarah',
    age: 28,
    location: 'New York, NY',
    distance: '3 miles',
    bio: 'Coffee enthusiast, dog lover, and hiking addict. Looking for someone who enjoys the outdoors as much as I do!',
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60',
    ],
    interests: [
      { id: 'i1', name: 'Hiking' },
      { id: 'i2', name: 'Coffee' },
      { id: 'i3', name: 'Dogs' },
      { id: 'i4', name: 'Travel' },
    ],
    compatibilityScore: 85,
    isVerified: true,
  },
  {
    id: '2',
    name: 'Michael',
    age: 32,
    location: 'Brooklyn, NY',
    distance: '5 miles',
    bio: 'Musician and foodie exploring the best restaurants in the city. Looking for someone to share adventures with!',
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60',
    ],
    interests: [
      { id: 'i5', name: 'Music' },
      { id: 'i6', name: 'Food' },
      { id: 'i7', name: 'Concerts' },
      { id: 'i8', name: 'Photography' },
    ],
    compatibilityScore: 72,
    isVerified: true,
  },
  {
    id: '3',
    name: 'Emma',
    age: 27,
    location: 'Manhattan, NY',
    distance: '2 miles',
    bio: 'Yoga instructor who loves art museums, reading, and trying new vegetarian recipes. Looking for meaningful connections.',
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60',
    ],
    interests: [
      { id: 'i9', name: 'Yoga' },
      { id: 'i10', name: 'Art' },
      { id: 'i11', name: 'Reading' },
      { id: 'i12', name: 'Cooking' },
    ],
    compatibilityScore: 90,
    isVerified: false,
  },
  {
    id: '4',
    name: 'Alex',
    age: 30,
    location: 'Queens, NY',
    distance: '8 miles',
    bio: 'Tech entrepreneur who loves running, craft beer, and board games. Looking for someone with a sense of adventure.',
    photos: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60',
    ],
    interests: [
      { id: 'i13', name: 'Running' },
      { id: 'i14', name: 'Tech' },
      { id: 'i15', name: 'Board Games' },
      { id: 'i16', name: 'Beer' },
    ],
    compatibilityScore: 68,
    isVerified: true,
  },
  {
    id: '5',
    name: 'Olivia',
    age: 26,
    location: 'Hoboken, NJ',
    distance: '10 miles',
    bio: 'Marketing professional who enjoys painting, wine tasting, and weekend road trips. Looking for genuine connections.',
    photos: [
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTV8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60',
    ],
    interests: [
      { id: 'i17', name: 'Art' },
      { id: 'i18', name: 'Wine' },
      { id: 'i19', name: 'Travel' },
      { id: 'i20', name: 'Marketing' },
    ],
    compatibilityScore: 76,
    isVerified: true,
  },
  {
    id: '6',
    name: 'James',
    age: 34,
    location: 'Manhattan, NY',
    distance: '4 miles',
    bio: 'Finance professional by day, amateur chef by night. Love trying new restaurants and improving my cooking skills.',
    photos: [
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTN8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60',
    ],
    interests: [
      { id: 'i21', name: 'Cooking' },
      { id: 'i22', name: 'Finance' },
      { id: 'i23', name: 'Food' },
      { id: 'i24', name: 'Travel' },
    ],
    compatibilityScore: 81,
    isVerified: false,
  },
];

const interestOptions = [
  'Adventure', 'Art', 'Books', 'Coffee', 'Cooking', 'Dancing', 'Fashion', 'Fitness',
  'Food', 'Gaming', 'Hiking', 'Movies', 'Music', 'Photography', 'Sports', 'Technology',
  'Travel', 'Wine', 'Yoga'
];

const Discover = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [ageRange, setAgeRange] = useState([21, 40]);
  const [distance, setDistance] = useState(25);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedGender, setSelectedGender] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('match');
  
  const handleLike = (id: string) => {
    toast({
      title: "Profile Liked",
      description: "You've liked this profile!"
    });
  };
  
  const handleDislike = (id: string) => {
    toast({
      description: "Profile skipped",
      variant: "default"
    });
  };
  
  const handleMessage = (id: string) => {
    toast({
      title: "Message Started",
      description: "Say hello and start a conversation!"
    });
  };
  
  const handleSpark = (id: string) => {
    toast({
      title: "Spark Sent!",
      description: "You've sent a spark to this profile!",
      variant: "default"
    });
  };
  
  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Discover</h1>
              <p className="text-muted-foreground">Find your perfect match based on compatibility</p>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="match">Highest Match %</SelectItem>
                  <SelectItem value="distance">Closest First</SelectItem>
                  <SelectItem value="newest">Newest Profiles</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                className="flex-shrink-0"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </Button>
            </div>
          </div>
          
          {isFilterOpen && (
            <div className="bg-white rounded-xl border border-border p-6 mb-8 animate-slide-up">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Age Range</h3>
                  <div className="px-2">
                    <Slider
                      defaultValue={ageRange}
                      min={18}
                      max={65}
                      step={1}
                      onValueChange={(value) => setAgeRange(value as number[])}
                    />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{ageRange[0]} years</span>
                    <span className="text-sm text-muted-foreground">{ageRange[1]} years</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Distance</h3>
                  <div className="px-2">
                    <Slider
                      defaultValue={[distance]}
                      min={1}
                      max={100}
                      step={1}
                      onValueChange={(value) => setDistance(value[0])}
                    />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{distance} miles</span>
                    <span className="text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 inline-block mr-1" />
                      New York, NY
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Gender</h3>
                  <Select value={selectedGender} onValueChange={setSelectedGender}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="women">Women</SelectItem>
                      <SelectItem value="men">Men</SelectItem>
                      <SelectItem value="nonbinary">Non-binary</SelectItem>
                      <SelectItem value="all">Everyone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="mt-8 pt-4 border-t border-border">
                <h3 className="text-lg font-medium mb-4">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {interestOptions.map((interest) => (
                    <Badge
                      key={interest}
                      variant={selectedInterests.includes(interest) ? "default" : "outline"}
                      className="cursor-pointer rounded-full px-3 py-1.5 text-sm"
                      onClick={() => toggleInterest(interest)}
                    >
                      {interest}
                      {selectedInterests.includes(interest) && (
                        <span className="ml-1">×</span>
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" onClick={() => {
                  setAgeRange([21, 40]);
                  setDistance(25);
                  setSelectedInterests([]);
                  setSelectedGender('');
                }}>
                  Reset
                </Button>
                <Button className="bg-matchee-primary hover:bg-matchee-primary/90">
                  Apply Filters
                </Button>
              </div>
            </div>
          )}
          
          {/* Featured Matches */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Sparkles className="h-5 w-5 text-matchee-primary mr-2" />
              <h2 className="text-xl font-medium">Featured Matches</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleProfiles.slice(0, 3).map((profile) => (
                <MatcheeCard
                  key={profile.id}
                  profile={profile}
                  onLike={handleLike}
                  onDislike={handleDislike}
                  onMessage={handleMessage}
                  onSpark={handleSpark}
                />
              ))}
            </div>
          </div>
          
          {/* All Matches */}
          <div>
            <h2 className="text-xl font-medium mb-4">All Matches</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sampleProfiles.map((profile) => (
                <MatcheeCard
                  key={profile.id}
                  profile={profile}
                  onLike={handleLike}
                  onDislike={handleDislike}
                  onMessage={handleMessage}
                  onSpark={handleSpark}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Discover;
