/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  UseMutationOptions,
  UseQueryOptions,
  UseSuspenseQueryOptions,
} from '@tanstack/react-query';

export type RestUseMutationProps<T extends (...args: any[]) => any> = Omit<
  UseMutationOptions<Awaited<ReturnType<T>>, unknown, Variables<T>, unknown>,
  'mutationKey' | 'mutationFn'
>;

export type RestUseQueryProps<T extends (...args: any[]) => any> = Omit<
  UseQueryOptions<Awaited<ReturnType<T>>, unknown, Variables<T>>,
  'queryKey' | 'queryFn'
>;

export type RestUseSuspenseQueryProps<T extends (...args: any[]) => any> = Omit<
  UseSuspenseQueryOptions<Awaited<ReturnType<T>>, unknown, Variables<T>>,
  'queryKey' | 'queryFn'
>;

type Variables<T extends (...args: any[]) => any> =
  Parameters<T> extends [] ? void : Parameters<T>[0];
