import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export function Header() {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center px-4">
        <div className="mr-4 hidden md:flex">
          <nav className="flex items-center space-x-6 font-medium font-display">
            <Link to="/">
              <Button variant="ghost" className="text-lg">Home</Button>
            </Link>
            <Link to="/about">
              <Button variant="ghost" className="text-lg">About</Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
} 