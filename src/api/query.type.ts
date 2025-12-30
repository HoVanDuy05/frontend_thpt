import { UseQueryResult, UseMutationResult } from "@tanstack/react-query";

export type TQuery<TData, TError = Error> = UseQueryResult<TData, TError>;
export type TMutation<TData, TVariables, TError = Error> = UseMutationResult<TData, TError, TVariables>;
