import { Button } from "@/components/ui/button"
import { HousePlug } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

export function Header() {
  const location = useLocation()

  return (
    <header className="bg-black/20 hidden md:block">
      <div className="container flex h-16 items-center px-4">
        <div className="mr-4 hidden md:flex w-full">
          <nav className="flex items-center space-x-6 font-medium w-full justify-between">
            <Link to="/" className="flex items-center gap-2 text-2xl font-display">
              <HousePlug size={32} />
              GameShack
            </Link>
            <div className="flex items-center font-display">
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
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
} 