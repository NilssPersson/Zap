import { Button } from "@/components/ui/button";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { WiggleText } from "@/components/WiggleText";

function Home() {
    const { login, register } = useKindeAuth();

    return (
        <div className="flex-1 flex flex-col items-center justify-center">
            <WiggleText 
                text="GameShack" 
                className="text-7xl font-bold font-display mb-16 fancy-wrap"
            />
            <div className="flex flex-col gap-4">
                <Button className="font-display text-3xl outline outline-3" size="lg" onClick={() => login()}>Login</Button>
                <Button className="font-display text-3xl outline outline-3" size="lg" onClick={() => register()}>Register</Button>
            </div>
        </div>
    )
}

export default Home