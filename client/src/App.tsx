import { KindeProvider } from "@kinde-oss/kinde-auth-react";
import { Header } from "./components/Header";
import { AppRoutes } from "./routes/AppRoutes";

function App() {
  return (
    <div className="min-h-screen bg-[url('/assets/bg-mobile.svg')] md:bg-[url('/assets/bg-desktop.svg')] bg-cover bg-no-repeat bg-center text-white">
      <main className="min-h-screen flex flex-col">
        <KindeProvider
          clientId="7b50afa95aec4cba88bad0abb4b94dfa"
          domain="https://gameshack.kinde.com"
          redirectUri="http://localhost:5173/builder"
          logoutUri="http://localhost:5173"
        >
          <Header />
          <AppRoutes />
        </KindeProvider>
      </main>
    </div>
  );
}

export default App;
