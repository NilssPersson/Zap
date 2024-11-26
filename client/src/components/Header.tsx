import { Button } from "@/components/ui/button";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { Zap } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export function Header() {
  const location = useLocation();
  const { isAuthenticated, logout } = useKindeAuth();
  const [showHeader, setShowHeader] = useState(false);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (location.pathname.endsWith("/lobby")) {
        if (e.clientY < 100) {
          // Clear any existing timeout
          if (timeoutId) clearTimeout(timeoutId);
          // Set a new timeout
          const id = window.setTimeout(() => {
            setShowHeader(true);
          }, 300); // 300ms delay
          setTimeoutId(id);
        } else {
          // Clear timeout if mouse moves away
          if (timeoutId) clearTimeout(timeoutId);
          setShowHeader(false);
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [location.pathname, timeoutId]);

  if (location.pathname.endsWith("/lobby") && !showHeader) {
    return null;
  }

  return (
    <header className={`bg-black/40 hidden md:block transition-opacity duration-200 ${
      location.pathname.endsWith("/lobby") ? "absolute top-0 left-0 right-0" : ""
    }`}>
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
