"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import axiosClient from "../axiosClient";
import { ApiMutationType } from "../types/api.type";
import { replaceDynamicValues } from "@/shared/utils/api.util";

type ExtractPayload<T extends keyof ApiMutationType> = ApiMutationType[T] extends { payload: infer P } ? P : undefined;
type ExtractResponse<T extends keyof ApiMutationType> = ApiMutationType[T] extends { response: infer R } ? R : any;
type ExtractUrl<T extends keyof ApiMutationType> = ApiMutationType[T] extends { url: infer U } ? U : any;

export type AppMutationOptions<T extends keyof ApiMutationType> = Omit<
    UseMutationOptions<ExtractResponse<T>, Error, ExtractPayload<T>>,
    "mutationFn"
>;

export const useAppMutation = <T extends keyof ApiMutationType>({
    url,
    method = "POST",
    options,
    onSuccess,
    onError,
}: {
    url: ExtractUrl<T>;
    method?: "POST" | "PUT" | "PATCH" | "DELETE";
    options?: AppMutationOptions<T>;
    onSuccess?: (data: ExtractResponse<T>, payload: ExtractPayload<T>) => void;
    onError?: (error: any, payload: ExtractPayload<T>) => void;
}) => {
    return useMutation<ExtractResponse<T>, Error, ExtractPayload<T>>({
        ...options,
        mutationFn: async (payload: ExtractPayload<T>): Promise<ExtractResponse<T>> => {
            // merge urlParams from definition and payload if payload is a plain object and contains urlParams
            const mergedParams = {
                ...(url as any)?.urlParams,
                ...((payload as any)?.urlParams || {}),
                ...((payload as any) instanceof FormData ? {} : (payload as any || {}))
            };

            const urlApi = replaceDynamicValues(
                (url as any).baseUrl,
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
                const data = response as ExtractResponse<T>;
                onSuccess?.(data, payload);
                return data;
            } catch (error) {
                onError?.(error, payload);
                return Promise.reject(error);
            }
        },
    });
};

