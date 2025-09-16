import { useQuery } from "@tanstack/react-query";
import { verifyAuth } from "../api/auth";
import { useLocation } from "react-router-dom";

export const useVerifyAuth = () => {
    const location = useLocation()
    return useQuery({
        queryKey: ["verifyAuth",location.pathname],
        queryFn: verifyAuth,
        retry: false,
    })
}