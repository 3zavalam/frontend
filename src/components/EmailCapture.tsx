import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const EmailCapture = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from("waitlist")
        .insert([{ email }]);

      if (error) {
        if (error.code === '23505' || error.message.includes('duplicate') || error.message.includes('already exists')) {
          toast({
            title: "Already registered!",
            description: "This email is already on our waitlist.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: "Something went wrong. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Success!",
          description: "Thanks for joining! We'll be in touch soon.",
        });
        setEmail("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="flex-1 h-12 px-4 text-base bg-white/90 backdrop-blur-sm border-white/20 focus:border-primary placeholder:text-muted-foreground"
      />
      <Button
        type="submit"
        size="lg"
        disabled={isLoading}
        className="h-12 px-8 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
      >
        {isLoading ? "Adding..." : "Get Started"}
      </Button>
    </form>
  );
};

export default EmailCapture;