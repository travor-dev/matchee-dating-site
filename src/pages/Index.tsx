
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, ArrowRight, Search, Shield, MessageCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MatcheeCard, { Profile } from '@/components/MatcheeCard';
import MatchMeter from '@/components/MatchMeter';
import { toast } from "@/hooks/use-toast";
import { Card, CardContent } from '@/components/ui/card';

// Sample profiles for demonstration
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
];

// Success stories data
const successStories = [
  {
    id: 's1',
    names: 'Amy & David',
    image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y291cGxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60',
    story: 'We matched on Matchee last year and hit it off immediately! After 3 months of dating, we're now living together and planning our future.',
  },
  {
    id: 's2',
    names: 'Zoe & Marcus',
    image: 'https://images.unsplash.com/photo-1597556288511-a8b089c37d3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNvdXBsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60',
    story: 'Thanks to Matchee's interest-based matching, we found each other through our shared love of hiking. Just got engaged during a mountain trek!',
  },
  {
    id: 's3',
    names: 'Taylor & Jordan',
    image: 'https://images.unsplash.com/photo-1517456215183-9a2c3a748f6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y291cGxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60',
    story: 'Our compatibility score was 92%! Matchee knew we'd be perfect for each other before we did. Dating for 6 months and never been happier.',
  },
];

const Index = () => {
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
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-matchee-gradient-start to-matchee-gradient-end text-white py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2 space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold">
                  Find Your Perfect Match, Not Just a Date
                </h1>
                <p className="text-lg md:text-xl opacity-90">
                  Matchee connects you with people who share your interests, values, and lifestyle. 
                  Experience dating that's focused on compatibility and meaningful connections.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Button 
                    className="bg-white text-matchee-primary hover:bg-white/90 rounded-full px-6 py-6 text-lg"
                    asChild
                  >
                    <Link to="/signup">
                      Start Your Journey
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-white text-white hover:bg-white/20 rounded-full px-6 py-6 text-lg"
                    asChild
                  >
                    <Link to="/discover">
                      Browse Matches
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="relative">
                  <div className="rounded-2xl overflow-hidden border-8 border-white/20 shadow-xl rotate-3 animate-float">
                    <MatcheeCard 
                      profile={sampleProfiles[0]} 
                      className="w-64 md:w-80"
                    />
                  </div>
                  <div className="absolute -bottom-10 -left-10 rounded-2xl overflow-hidden border-8 border-white/20 shadow-xl -rotate-6 animate-float" style={{ animationDelay: '0.5s' }}>
                    <MatcheeCard 
                      profile={sampleProfiles[1]} 
                      className="w-64 md:w-72"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Matchee</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our intelligent matching system helps you find compatible partners based on what really matters.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl border border-border p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-matchee-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-matchee-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Matchee Meter</h3>
                <p className="text-muted-foreground">
                  Our compatibility algorithm shows you how well you match with potential partners based on shared interests and values.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl border border-border p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-matchee-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-matchee-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Meaningful Conversations</h3>
                <p className="text-muted-foreground">
                  Start conversations with fun icebreakers designed to help you get to know each other better.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl border border-border p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-matchee-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-matchee-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Safe & Secure</h3>
                <p className="text-muted-foreground">
                  We prioritize your privacy and safety with verification badges, reporting tools, and secure messaging.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 md:py-24 bg-matchee-light">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How Matchee Works</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Finding meaningful connections has never been easier.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-matchee-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                <h3 className="text-xl font-medium mb-2">Create Your Profile</h3>
                <p className="text-muted-foreground">
                  Add your photos, interests, and complete the compatibility quiz.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-matchee-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                <h3 className="text-xl font-medium mb-2">Discover Matches</h3>
                <p className="text-muted-foreground">
                  Browse profiles with Matchee Meter scores to find compatible partners.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-matchee-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                <h3 className="text-xl font-medium mb-2">Connect & Chat</h3>
                <p className="text-muted-foreground">
                  Use icebreakers to start meaningful conversations with your matches.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-matchee-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
                <h3 className="text-xl font-medium mb-2">Meet & Connect</h3>
                <p className="text-muted-foreground">
                  Take your connection offline and build a meaningful relationship.
                </p>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <Button 
                className="matchee-button matchee-gradient px-6 py-6 text-lg"
                asChild
              >
                <Link to="/signup">
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Success Stories */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Real people who found real connections on Matchee.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {successStories.map((story) => (
                <Card key={story.id} className="overflow-hidden">
                  <div className="aspect-[3/2]">
                    <img 
                      src={story.image} 
                      alt={story.names} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-medium mb-2">{story.names}</h3>
                    <p className="text-muted-foreground">{story.story}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-matchee-gradient text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Find Your Perfect Match?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of singles who are finding meaningful connections on Matchee every day.
            </p>
            <Button 
              className="bg-white text-matchee-primary hover:bg-white/90 rounded-full px-10 py-7 text-lg font-medium"
              asChild
            >
              <Link to="/signup">
                Create Your Profile
              </Link>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
