import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AvatarCustomizer } from "@/components/ui/avatar-customizer";
import { useUser } from "@/hooks/use-user";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/chat", label: "Co-Pilot" },
  { href: "/recommendations", label: "Recommendations" },
  { href: "/discover", label: "Discover" },
  { href: "/documents", label: "Documents" },
  { href: "/community", label: "Community" },
];

export default function Navbar() {
  const [location] = useLocation();
  const { user } = useUser();
  const [showAvatarCustomizer, setShowAvatarCustomizer] = useState(false);

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo />
            <span className="hidden font-bold sm:inline-block">
              Pivot Health
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  location === item.href
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.avatarUrl} alt={user?.username} />
                  <AvatarFallback>
                    {user?.username?.slice(0, 2)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowAvatarCustomizer(true)}>
                Customize Avatar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Avatar Customizer Modal */}
      <Dialog open={showAvatarCustomizer} onOpenChange={setShowAvatarCustomizer}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Customize Your Avatar</DialogTitle>
          </DialogHeader>
          <AvatarCustomizer 
            initialAvatarUrl={user?.avatarUrl}
            onSave={(url) => {
              setShowAvatarCustomizer(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </nav>
  );
}