import { Button } from "@/components/ui/button"
import { useKindeAuth } from "@kinde-oss/kinde-auth-react"
import { HousePlug } from "lucide-react"
import { Link } from "react-router-dom"

export function Header() {
  const { login, logout, register, isAuthenticated } = useKindeAuth() 
  return (
    <header className="border-b bg-background">
      <div className="container flex h-16 items-center px-4 bg-background">
        <div className="mr-4 hidden md:flex w-full">
          <nav className="flex items-center space-x-6 font-medium font-display content-between">
            <Link to="/" className="flex items-center gap-2 text-2xl mr-8">
              <HousePlug size={32} />
              GameShack
            </Link>
            <div className="flex items-center">
              <Link to="/">
                <Button variant="ghost" className="text-lg">Home</Button>
              </Link>
              <Link to="/about">
                <Button variant="ghost" className="text-lg">About</Button>
              </Link>
            </div>
            <div>
              {isAuthenticated ? (
                <Button onClick={logout} type="button">Logout</Button>
              ) : (
                <>
                  <Button onClick={() => register()} type="button" variant="outline">Register</Button>
                  <Button onClick={() => login()} type="button">Login</Button>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
} 