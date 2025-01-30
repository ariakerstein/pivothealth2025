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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AvatarCustomizer } from "@/components/ui/avatar-customizer";
import { useUser } from "@/hooks/use-user";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/chat", label: "Co-Pilot" },
  { href: "/recommendations", label: "Recommendations" },
  { href: "/discover", label: "Discover" },
  { href: "/documents", label: "Documents" },
];

const communityItems = [
  { href: "/community/patients", label: "Patients Like Me" },
  { href: "/community/topics", label: "Topics" },
  { href: "/community/mentor", label: "Mentor" },
  { href: "/community/success-stories", label: "Success Stories" },
  { href: "/community/groups", label: "Groups" },
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
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

            {/* Desktop Community Dropdown */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/community">
                    <NavigationMenuTrigger>
                      Community
                    </NavigationMenuTrigger>
                  </Link>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-2 p-4">
                      {communityItems.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              location === item.href
                                ? "bg-accent text-accent-foreground"
                                : "text-foreground/60"
                            )}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[280px]">
              <Link href="/" className="flex items-center space-x-2 pb-6">
                <Logo />
                <span className="font-bold">Pivot Health</span>
              </Link>
              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "block px-2 py-1 text-lg transition-colors hover:text-foreground/80",
                      location === item.href
                        ? "text-foreground font-medium"
                        : "text-foreground/60"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}

                {/* Mobile Community Section */}
                <div className="pt-2">
                  <Link href="/community" className="block px-2 py-1 text-lg transition-colors hover:text-foreground/80">
                    Community
                  </Link>
                  {communityItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "block px-4 py-1 text-sm transition-colors hover:text-foreground/80",
                        location === item.href
                          ? "text-foreground font-medium"
                          : "text-foreground/60"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.avatarUrl || undefined} alt={user?.username} />
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
            initialAvatarUrl={user?.avatarUrl || undefined}
            onSave={(url) => {
              setShowAvatarCustomizer(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </nav>
  );
}