
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Camera, User, MapPin, Globe, Mail } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

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

  // Redirect if not logged in
  React.useEffect(() => {
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
  React.useEffect(() => {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-matchee-primary" />
      </div>
    );
  }

  return (
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
              disabled={true} // Disable until we implement storage
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
      </div>
    </div>
  );
};

export default Profile;
