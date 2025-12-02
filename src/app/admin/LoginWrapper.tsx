import { signIn, useSession } from "next-auth/react";
import React, { useEffect } from "react";

interface Props {
    children: React.ReactNode
}
export default function LoginWrapper(props: Props) {
    const { children } = props
    const { status } = useSession();

    useEffect(() => {
        if (status === "unauthenticated") signIn("google");
    }, [status]);

    if (status === "loading" || status == "unauthenticated") return <div>Loading...</div>;

    return (
        <>
            {children}
        </>
    )
}