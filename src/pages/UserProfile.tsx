import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Camera, MapPin, Globe, Send, MoreHorizontal, User, Calendar, Heart, X, Link as LinkIcon, Mail as MailIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { format } from "date-fns";
import PostCard from "@/components/PostCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const UserProfile = () => {
  const { userId } = useParams();
  const { user, profile: currentUserProfile } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [coverDialogOpen, setCoverDialogOpen] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      
      try {
        const profileId = userId || user?.id;
        
        if (!profileId) {
          navigate("/auth");
          return;
        }
        
        setIsOwnProfile(profileId === user?.id);
        
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", profileId)
          .single();
          
        if (profileError) {
          throw profileError;
        }
        
        setProfile(profileData);
        
        const { data: postsData, error: postsError } = await supabase
          .from("posts")
          .select("*, profiles(full_name, username, avatar_url)")
          .eq("user_id", profileId)
          .order("created_at", { ascending: false });
          
        if (postsError) {
          throw postsError;
        }
        
        setPosts(postsData);
        
      } catch (error: any) {
        console.error("Error fetching profile data:", error.message);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [userId, user, navigate, toast]);

  const handleCreatePost = async () => {
    if (!postContent.trim() || !user) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from("posts").insert({
        user_id: user.id,
        content: postContent
      });
      
      if (error) throw error;
      
      const { data: newPosts, error: postsError } = await supabase
        .from("posts")
        .select("*, profiles(full_name, username, avatar_url)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
        
      if (postsError) throw postsError;
      
      setPosts(newPosts);
      setPostContent("");
      
      toast({
        title: "Success",
        description: "Post created successfully",
      });
    } catch (error: any) {
      console.error("Error creating post:", error.message);
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMessageUser = () => {
    navigate(`/messages?userId=${profile.id}`);
  };

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
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${user.id}-avatar-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, avatarFile);
        
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      setProfile({ ...profile, avatar_url: publicUrl });
      
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
      const fileExt = coverFile.name.split('.').pop();
      const fileName = `${user.id}-cover-${Date.now()}.${fileExt}`;
      const filePath = `covers/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, coverFile);
        
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ cover_url: publicUrl })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      setProfile({ ...profile, cover_url: publicUrl });
      
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

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Profile not found</h1>
        <p className="text-muted-foreground mb-8">This user profile does not exist or has been removed.</p>
        <Button onClick={() => navigate("/discover")} className="matchee-button matchee-gradient">
          Discover People
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16">
        <div className="relative h-48 sm:h-64 md:h-80 bg-gray-200 w-full">
          {profile.cover_url ? (
            <img 
              src={profile.cover_url} 
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-matchee-primary/20 to-matchee-secondary/20" />
          )}
          
          {isOwnProfile && (
            <Button 
              size="icon" 
              variant="outline" 
              className="absolute bottom-4 right-4 h-8 w-8 rounded-full bg-white/70 hover:bg-white"
              aria-label="Update cover photo"
              onClick={() => setCoverDialogOpen(true)}
            >
              <Camera className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-20 relative z-10 mb-6">
            <div className="relative mb-4 sm:mb-0">
              <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="bg-matchee-primary/20 text-matchee-primary text-4xl">
                  {profile?.full_name?.charAt(0) || profile?.username?.charAt(0) || <User />}
                </AvatarFallback>
              </Avatar>
              
              {isOwnProfile && (
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="absolute bottom-2 right-0 h-8 w-8 rounded-full bg-white"
                  aria-label="Update profile picture"
                  onClick={() => setAvatarDialogOpen(true)}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="text-center sm:text-left sm:ml-6 flex-grow">
              <h1 className="text-2xl font-bold">{profile.full_name}</h1>
              {profile.username && (
                <p className="text-muted-foreground">@{profile.username}</p>
              )}
            </div>
            
            <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-2">
              {!isOwnProfile ? (
                <>
                  <Button 
                    onClick={handleMessageUser} 
                    className="matchee-button matchee-gradient"
                    disabled={!user}
                  >
                    <MailIcon className="h-4 w-4 mr-2" /> Message
                  </Button>
                  <Button variant="outline" className="matchee-button">
                    <User className="h-4 w-4 mr-2" /> Follow
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outline" 
                  className="matchee-button"
                  onClick={() => navigate("/profile")}
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.bio ? (
                    <p>{profile.bio}</p>
                  ) : (
                    <p className="text-muted-foreground italic">
                      {isOwnProfile ? "Add a bio to your profile" : "No bio added yet"}
                    </p>
                  )}
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    {profile.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>Lives in {profile.location}</span>
                      </div>
                    )}
                    
                    {profile.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a href={profile.website} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="text-matchee-primary hover:underline">
                          {profile.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Joined {format(new Date(profile.created_at), 'MMMM yyyy')}</span>
                    </div>
                  </div>
                  
                  {isOwnProfile && (
                    <>
                      <Separator />
                      <div className="pt-2">
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => navigate("/profile")}
                        >
                          Edit Details
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2 space-y-6">
              <Tabs defaultValue="posts">
                <TabsList className="w-full">
                  <TabsTrigger value="posts" className="flex-1">Posts</TabsTrigger>
                  <TabsTrigger value="photos" className="flex-1">Photos</TabsTrigger>
                  <TabsTrigger value="friends" className="flex-1">Friends</TabsTrigger>
                </TabsList>
                
                <TabsContent value="posts" className="space-y-6 pt-4">
                  {isOwnProfile && (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={currentUserProfile?.avatar_url || undefined} />
                            <AvatarFallback className="bg-matchee-primary/20 text-matchee-primary">
                              {currentUserProfile?.full_name?.charAt(0) || user?.email?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 space-y-3">
                            <Textarea 
                              placeholder="What's on your mind?"
                              value={postContent}
                              onChange={(e) => setPostContent(e.target.value)}
                              className="resize-none"
                            />
                            
                            <div className="flex justify-between">
                              <div className="flex gap-2">
                                {/* Post attachments buttons could go here */}
                              </div>
                              
                              <Button 
                                onClick={handleCreatePost}
                                className="matchee-button matchee-gradient"
                                disabled={!postContent.trim() || isSubmitting}
                              >
                                {isSubmitting ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <Send className="h-4 w-4 mr-2" />
                                )}
                                Post
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {posts.length > 0 ? (
                    posts.map((post) => (
                      <PostCard 
                        key={post.id} 
                        post={post} 
                        currentUserId={user?.id} 
                        onPostUpdate={() => {
                          // Function to refresh posts could go here
                        }}
                      />
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">
                        {isOwnProfile ? "You haven't created any posts yet" : "No posts to show"}
                      </p>
                      {isOwnProfile && (
                        <p className="text-sm mt-2 text-matchee-primary">
                          Create your first post to share with others!
                        </p>
                      )}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="photos" className="pt-4">
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">No photos to show</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="friends" className="pt-4">
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">No friends to display</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
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
                  <X className="h-3 w-3" />
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
                  <X className="h-3 w-3" />
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

export default UserProfile;
