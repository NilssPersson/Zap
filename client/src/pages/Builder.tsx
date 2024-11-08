import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import useGetAuthenticatedUser from "@/hooks/useGetAuthenticatedUser";

function Builder() {
    const { user } = useGetAuthenticatedUser();

    console.log(user);

    return (
        <div className="flex-1 flex flex-col items-center justify-center">
            <Card>
                <CardHeader>
                    <CardTitle>My Games</CardTitle>
                </CardHeader>
            </Card>
        </div>
    )
}

export default Builder