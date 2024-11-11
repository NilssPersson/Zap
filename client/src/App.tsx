import { KindeProvider } from "@kinde-oss/kinde-auth-react";
import { Header } from "./components/Header";
import { AppRoutes } from "./routes/AppRoutes";
import { Toaster } from "sonner";

const environment = import.meta.env.VITE_ENVIRONMENT;

const uri = environment === "DEV" ? "http://localhost:5173" : "https://game-shack-iota.vercel.app/";

function App() {
  return (
    <div className="min-h-screen bg-[url('/assets/bg-mobile.svg')] md:bg-[url('/assets/bg-desktop.svg')] bg-cover bg-no-repeat bg-center text-white">
      <main className="min-h-screen max-h-screen flex flex-col">
        <KindeProvider
          clientId="7b50afa95aec4cba88bad0abb4b94dfa"
          domain="https://gameshack.kinde.com"
          redirectUri={uri}
          logoutUri={uri}
        >
          <Header />
          <AppRoutes />
          <Toaster />
        </KindeProvider>
      </main>
    </div>
  );
}

export default App;
