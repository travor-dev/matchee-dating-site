
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

export const uploadPostImage = async (file: File, userId: string) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${uuidv4()}.${fileExt}`;
    const filePath = `posts/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('posts')
      .upload(filePath, file);
      
    if (uploadError) throw uploadError;
    
    const { data: { publicUrl } } = supabase.storage
      .from('posts')
      .getPublicUrl(filePath);
    
    return publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
