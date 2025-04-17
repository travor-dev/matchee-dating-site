
import React, { useState } from 'react';
import { Loader2, Shield, BadgeCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface VerifyAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerified: () => void;
}

const VerifyAccountDialog = ({ open, onOpenChange, onVerified }: VerifyAccountDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleVerifyAccount = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ isVerified: true })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      toast({
        title: "Account Verified",
        description: "Your account has been successfully verified!",
      });
      onVerified();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Could not verify your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verify Your Account</DialogTitle>
          <DialogDescription>
            Get a verified badge on your profile to show others that you're a genuine user.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h4 className="font-medium">Account Verification</h4>
              <p className="text-sm text-muted-foreground">
                Verified accounts get a special badge and increased visibility.
              </p>
            </div>
          </div>
          
          <Button
            onClick={handleVerifyAccount}
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <BadgeCheck className="mr-2 h-4 w-4" />
                Verify Account
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerifyAccountDialog;
