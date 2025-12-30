"use client";

import { useQuery, UseQueryOptions, Query } from "@tanstack/react-query";
import { ResponseType } from "axios";
import axiosClient from "../axiosClient";
import { ApiQueryType } from "../types/api.type";
import { parseQueryParams, replaceDynamicValues } from "@/shared/utils/api.util";

export type AppQueryOptions<T extends keyof ApiQueryType> = Omit<
    UseQueryOptions<ApiQueryType[T]["response"]>,
    "queryFn" | "queryKey"
> & { queryKey?: any[] };

export const useAppQuery = <T extends keyof ApiQueryType>({
    url,
    options,
    onSuccess,
    onError,
    responseType = "json",
    retry,
    refetchInterval,
    isArrayParams = false,
}: Omit<ApiQueryType[T], "response"> & {
    options?: AppQueryOptions<T>;
    onSuccess?: (data: ApiQueryType[T]["response"]) => void;
    onError?: (error: any) => void;
    retry?: number;
    responseType?: ResponseType;
    refetchInterval?:
    | number
    | false
    | ((
        query: Query<
            ApiQueryType[T]["response"],
            Error,
            ApiQueryType[T]["response"],
            readonly unknown[]
        >
    ) => number | false | undefined);
    isArrayParams?: boolean;
}) => {
    const queryParams = isArrayParams
        ? parseQueryParams((url as any)?.queryParams)
        : new URLSearchParams((url as any)?.queryParams).toString();

    const urlApi = replaceDynamicValues(
        url.baseUrl,
        (url as any)?.urlParams || {}
    );

    const requestKey = `${urlApi}${queryParams ? `?${queryParams}` : ""}`;

    return useQuery({
        ...options,
        refetchInterval,
        retry: retry ?? false,
        queryKey: [requestKey, ...(options?.queryKey || [])],
        queryFn: async (): Promise<ApiQueryType[T]["response"]> => {
            try {
                const response = await axiosClient.get(urlApi, {
                    params: (url as any)?.queryParams,
                    responseType,
                });
                // Note: axiosClient response interceptor already returns response.data
                // But in the user's snippet they handle it manually. 
                // Our axiosClient returns data directly.
                const data = response as any;
                onSuccess?.(data);
                return data;
            } catch (error) {
                onError?.(error);
                return Promise.reject(error);
            }
        },
    });
};
