"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import axiosClient from "../axiosClient";
import { ApiMutationType } from "../types/api.type";
import { replaceDynamicValues } from "@/shared/utils/api.util";

export type AppMutationOptions<T extends keyof ApiMutationType> = Omit<
    UseMutationOptions<ApiMutationType[T]["response"], Error, ApiMutationType[T]["payload"]>,
    "mutationFn"
>;

export const useAppMutation = <T extends keyof ApiMutationType>({
    url,
    method = "POST",
    options,
    onSuccess,
    onError,
}: {
    url: ApiMutationType[T]["url"];
    method?: "POST" | "PUT" | "PATCH" | "DELETE";
    options?: AppMutationOptions<T>;
    onSuccess?: (data: ApiMutationType[T]["response"], payload: ApiMutationType[T]["payload"]) => void;
    onError?: (error: any, payload: ApiMutationType[T]["payload"]) => void;
}) => {
    return useMutation<ApiMutationType[T]["response"], Error, ApiMutationType[T]["payload"]>({
        ...options,
        mutationFn: async (payload: ApiMutationType[T]["payload"]): Promise<ApiMutationType[T]["response"]> => {
            // merge urlParams from definition and payload if payload is a plain object and contains urlParams
            const mergedParams = {
                ...(url as any)?.urlParams,
                ...((payload as any)?.urlParams || {}),
                ...((payload as any) instanceof FormData ? {} : (payload as any || {}))
            };

            const urlApi = replaceDynamicValues(
                url.baseUrl,
                mergedParams
            );

            try {
                let response;
                switch (method) {
                    case "PUT":
                        response = await axiosClient.put(urlApi, payload);
                        break;
                    case "PATCH":
                        response = await axiosClient.patch(urlApi, payload);
                        break;
                    case "DELETE":
                        response = await axiosClient.delete(urlApi, { data: payload });
                        break;
                    default:
                        response = await axiosClient.post(urlApi, payload);
                }
                const data = response as ApiMutationType[T]["response"];
                onSuccess?.(data, payload);
                return data;
            } catch (error) {
                onError?.(error, payload);
                return Promise.reject(error);
            } finally {
            }
        },
    });
};

