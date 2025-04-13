
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Heart, MessageSquare, Share, MoreHorizontal, Trash } from "lucide-react";
import { format, formatDistanceToNow } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

interface PostCardProps {
  post: any;
  currentUserId?: string;
  onPostUpdate?: () => void;
}

const PostCard = ({ post, currentUserId, onPostUpdate }: PostCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const isAuthor = currentUserId === post.user_id;
  const profileData = post.profiles;
  
  const handleDeletePost = async () => {
    if (!isAuthor) return;
    
    setIsDeleting(true);
    
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', post.id);
        
      if (error) throw error;
      
      toast({
        title: "Post deleted",
        description: "Your post has been successfully deleted",
      });
      
      if (onPostUpdate) onPostUpdate();
    } catch (error: any) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  const navigateToProfile = () => {
    navigate(`/user/${post.user_id}`);
  };
  
  const formatDate = (date: string) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = Math.abs(now.getTime() - postDate.getTime()) / 36e5;
    
    if (diffInHours < 24) {
      return formatDistanceToNow(postDate, { addSuffix: true });
    } else {
      return format(postDate, 'MMM d, yyyy • h:mm aaa');
    }
  };

  return (
    <Card>
      <CardHeader className="pt-4 pb-2 px-4">
        <div className="flex justify-between">
          <div className="flex gap-3">
            <Avatar 
              className="h-10 w-10 cursor-pointer"
              onClick={navigateToProfile}
            >
              <AvatarImage src={profileData?.avatar_url || undefined} />
              <AvatarFallback className="bg-matchee-primary/20 text-matchee-primary">
                {profileData?.full_name?.charAt(0) || profileData?.username?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h3 
                className="font-medium cursor-pointer hover:underline"
                onClick={navigateToProfile}
              >
                {profileData?.full_name || 'Anonymous'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {formatDate(post.created_at)}
              </p>
            </div>
          </div>
          
          {isAuthor && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  className="text-red-500 focus:text-red-500 cursor-pointer"
                  onClick={handleDeletePost}
                  disabled={isDeleting}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="px-4 py-2">
        <p className="whitespace-pre-line">{post.content}</p>
        
        {post.image_url && (
          <div className="mt-3">
            <img 
              src={post.image_url} 
              alt="Post attachment" 
              className="w-full rounded-lg" 
            />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="px-4 py-2 flex flex-col">
        <div className="flex justify-between w-full">
          <Button variant="ghost" size="sm">
            <Heart className="h-4 w-4 mr-1" />
            Like
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowComments(!showComments)}
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            Comment
          </Button>
          <Button variant="ghost" size="sm">
            <Share className="h-4 w-4 mr-1" />
            Share
          </Button>
        </div>
        
        {showComments && (
          <div className="mt-3 w-full">
            <div className="flex gap-2 items-start">
              <Avatar className="h-8 w-8">
                <AvatarImage src={undefined} />
                <AvatarFallback className="bg-matchee-primary/20 text-matchee-primary">
                  {currentUserId ? '?' : 'G'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <Textarea
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="min-h-[60px] text-sm"
                />
                
                <div className="mt-2 flex justify-end">
                  <Button
                    size="sm"
                    className="matchee-button matchee-gradient"
                    disabled={!commentText.trim()}
                  >
                    Post
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Comments coming soon
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default PostCard;
