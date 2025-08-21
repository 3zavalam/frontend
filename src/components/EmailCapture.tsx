import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const EmailCapture = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Success!",
        description: "Thanks for joining! We'll be in touch soon.",
      });
      setEmail("");
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
        className="h-12 px-8 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        Get Started
      </Button>
    </form>
  );
};

export default EmailCapture;