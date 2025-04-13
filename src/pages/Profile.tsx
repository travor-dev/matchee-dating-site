
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Camera, User, MapPin, Globe, Mail, Smartphone, Download } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

const profileSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }).optional(),
  full_name: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  bio: z.string().max(160, { message: "Bio cannot exceed 160 characters" }).optional(),
  website: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  location: z.string().max(100, { message: "Location cannot exceed 100 characters" }).optional(),
});

const Profile = () => {
  const { user, profile, loading, updateProfile, signOut } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State for photo editing
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [coverDialogOpen, setCoverDialogOpen] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: profile?.username || "",
      full_name: profile?.full_name || "",
      bio: profile?.bio || "",
      website: profile?.website || "",
      location: profile?.location || "",
    },
    values: {
      username: profile?.username || "",
      full_name: profile?.full_name || "",
      bio: profile?.bio || "",
      website: profile?.website || "",
      location: profile?.location || "",
    },
  });

  // Update form when profile data changes
  useEffect(() => {
    if (profile) {
      form.reset({
        username: profile.username || "",
        full_name: profile.full_name || "",
        bio: profile.bio || "",
        website: profile.website || "",
        location: profile.location || "",
      });
    }
  }, [profile, form]);

  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    setIsUpdating(true);
    await updateProfile(data);
    setIsUpdating(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleViewProfile = () => {
    navigate(`/user/${user?.id}`);
  };

  // Photo handling functions
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCoverFile(e.target.files[0]);
    }
  };

  const uploadAvatar = async () => {
    if (!avatarFile || !user) return;
    
    setIsUploading(true);
    
    try {
      // Upload to storage
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${user.id}-avatar-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, avatarFile);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);
      
      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      // Update local state
      updateProfile({ avatar_url: publicUrl });
      
      toast({
        title: "Profile updated",
        description: "Your profile picture has been updated",
      });
      
      setAvatarDialogOpen(false);
      
    } catch (error: any) {
      console.error("Error uploading avatar:", error.message);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setAvatarFile(null);
    }
  };

  const uploadCover = async () => {
    if (!coverFile || !user) return;
    
    setIsUploading(true);
    
    try {
      // Upload to storage
      const fileExt = coverFile.name.split('.').pop();
      const fileName = `${user.id}-cover-${Date.now()}.${fileExt}`;
      const filePath = `covers/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, coverFile);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);
      
      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ cover_url: publicUrl })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      // Update local state
      updateProfile({ cover_url: publicUrl });
      
      toast({
        title: "Profile updated",
        description: "Your cover photo has been updated",
      });
      
      setCoverDialogOpen(false);
      
    } catch (error: any) {
      console.error("Error uploading cover:", error.message);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setCoverFile(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-matchee-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container max-w-4xl py-10 px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-matchee-primary/20 text-matchee-primary text-xl">
                  {profile?.full_name?.charAt(0) || user?.email?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <Button 
                size="icon" 
                variant="outline" 
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                onClick={() => setAvatarDialogOpen(true)}
                aria-label="Upload avatar"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold">{profile?.full_name || "Your Profile"}</h1>
              <p className="text-muted-foreground">
                {profile?.username ? `@${profile.username}` : user?.email}
              </p>
              <Button 
                variant="link" 
                className="p-0 h-auto text-matchee-primary"
                onClick={handleViewProfile}
              >
                View public profile
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your profile information</CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <span className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted text-muted-foreground">@</span>
                            <Input className="rounded-l-none" placeholder="username" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us a little about yourself"
                            {...field} 
                            className="resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <div className="flex">
                              <span className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted">
                                <Globe className="h-4 w-4 text-muted-foreground" />
                              </span>
                              <Input className="rounded-l-none" placeholder="https://your-website.com" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <div className="flex">
                              <span className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                              </span>
                              <Input className="rounded-l-none" placeholder="City, Country" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between">
                  <Button
                    type="submit"
                    className="matchee-button matchee-gradient w-full sm:w-auto"
                    disabled={isUpdating || !form.formState.isDirty}
                  >
                    {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSignOut}
                    className="w-full sm:w-auto"
                  >
                    Sign Out
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Download Matchee Mobile App</CardTitle>
              <CardDescription>Get the full experience with our mobile app</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a 
                  href="#" 
                  className="flex items-center justify-center border border-border rounded-lg p-4 hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-black text-white rounded-lg p-2">
                      <Smartphone className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs">Download on the</p>
                      <p className="font-bold text-lg -mt-1">App Store</p>
                    </div>
                  </div>
                </a>

                <a 
                  href="#" 
                  className="flex items-center justify-center border border-border rounded-lg p-4 hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-green-500 text-white rounded-lg p-2">
                      <Download className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs">Get it on</p>
                      <p className="font-bold text-lg -mt-1">Google Play</p>
                    </div>
                  </div>
                </a>
              </div>

              <div className="bg-accent/50 rounded-lg p-4 text-sm">
                <p className="font-medium">Why download our mobile app?</p>
                <ul className="mt-2 space-y-1 list-disc pl-5">
                  <li>Get instant notifications for new matches</li>
                  <li>Message on the go with mobile-optimized chat</li>
                  <li>Swipe through potential matches with ease</li>
                  <li>Access exclusive mobile-only features</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Avatar Upload Dialog */}
      <Dialog open={avatarDialogOpen} onOpenChange={setAvatarDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Profile Picture</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {avatarFile && (
              <div className="relative w-40 h-40 mx-auto">
                <img 
                  src={URL.createObjectURL(avatarFile)} 
                  alt="Avatar Preview" 
                  className="w-full h-full object-cover rounded-full"
                />
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute top-1 right-1 h-6 w-6 rounded-full bg-white/80"
                  onClick={() => setAvatarFile(null)}
                >
                  <Camera className="h-3 w-3" />
                </Button>
              </div>
            )}
            
            <div className="space-y-2">
              {!avatarFile && (
                <div className="flex justify-center">
                  <label className="cursor-pointer">
                    <div className="bg-primary/10 hover:bg-primary/20 transition-colors rounded-md py-12 px-6 text-center">
                      <Camera className="mx-auto h-8 w-8 text-primary mb-2" />
                      <p className="text-sm font-medium">Select an image</p>
                      <p className="text-xs text-muted-foreground">JPG, PNG, GIF up to 10MB</p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={handleAvatarChange}
                      accept="image/*"
                    />
                  </label>
                </div>
              )}
              
              <div className="flex justify-end gap-2 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setAvatarFile(null);
                    setAvatarDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  className="matchee-button matchee-gradient"
                  onClick={uploadAvatar}
                  disabled={!avatarFile || isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : "Upload"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Cover Upload Dialog */}
      <Dialog open={coverDialogOpen} onOpenChange={setCoverDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Cover Photo</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {coverFile && (
              <div className="relative w-full h-40 mx-auto">
                <img 
                  src={URL.createObjectURL(coverFile)} 
                  alt="Cover Preview" 
                  className="w-full h-full object-cover rounded-md"
                />
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute top-1 right-1 h-6 w-6 rounded-full bg-white/80"
                  onClick={() => setCoverFile(null)}
                >
                  <Camera className="h-3 w-3" />
                </Button>
              </div>
            )}
            
            <div className="space-y-2">
              {!coverFile && (
                <div className="flex justify-center">
                  <label className="cursor-pointer w-full">
                    <div className="bg-primary/10 hover:bg-primary/20 transition-colors rounded-md py-12 px-6 text-center">
                      <Camera className="mx-auto h-8 w-8 text-primary mb-2" />
                      <p className="text-sm font-medium">Select an image</p>
                      <p className="text-xs text-muted-foreground">Choose a wide image for best results</p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={handleCoverChange}
                      accept="image/*"
                    />
                  </label>
                </div>
              )}
              
              <div className="flex justify-end gap-2 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setCoverFile(null);
                    setCoverDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  className="matchee-button matchee-gradient"
                  onClick={uploadCover}
                  disabled={!coverFile || isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : "Upload"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Profile;
