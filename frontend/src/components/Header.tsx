import { GraduationCap, LogOut, User } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  userName: string;
}

export function Header({ userName }: HeaderProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = () => {
    logout();
    navigate("/login");
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border/50 bg-card/60 backdrop-blur-xl px-4 md:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            QuizMaster
          </h1>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{userName}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="gap-2 hover:bg-destructive/20 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </Button>
      </div>
    </header>
  );
}
