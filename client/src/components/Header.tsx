import { Button } from "@/components/ui/button";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { Zap } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function Header() {
  const location = useLocation();
  const { isAuthenticated, logout } = useKindeAuth();

  return (
    <header className="bg-black/40A hidden md:block">
      <div className="container flex h-16 items-center px-4">
        <div className="mr-4 hidden md:flex w-full">
          <nav className="flex items-center space-x-6 font-medium w-full justify-between">
            <Link
              to="/"
              className="flex items-center gap-2 text-2xl font-display"
            >
              <Zap className="text-yellow-400" size={32} />
              <span className="fancy-wrap">Zap!</span>
            </Link>
            <div className="flex items-center font-display gap-1">
              <Link to="/">
                <Button
                  variant={location.pathname === "/" ? "default" : "ghost"}
                  className="text-lg"
                >
                  Home
                </Button>
              </Link>
              <Link to="/about">
                <Button
                  variant={location.pathname === "/about" ? "default" : "ghost"}
                  className="text-lg"
                >
                  About
                </Button>
              </Link>
              {isAuthenticated && (
                <>
                  <Link to="/profile">
                    <Button
                      variant={
                        location.pathname === "/profile" ? "default" : "ghost"
                      }
                      className="text-lg"
                    >
                      Profile
                    </Button>
                  </Link>
                  <Button variant="ghost" className="text-lg" onClick={logout}>
                    Logout
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
