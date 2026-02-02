import { createUseQuery } from "soda-tanstack-query"

import { getAccount } from "@/apis/getAccount"

export const useGetAccount = createUseQuery({
    queryFn: getAccount,
    queryKey: "get-account",
    staleTime: Infinity,
    gcTime: Infinity,
})
