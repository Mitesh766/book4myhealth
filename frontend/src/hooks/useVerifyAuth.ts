import { useQuery } from "@tanstack/react-query";
import { verifyAuth } from "../api/auth";

export const useVerifyAuth = () => {
    return useQuery({
        queryKey: ["verifyAuth"],
        queryFn: verifyAuth,
        retry: false
    })
}