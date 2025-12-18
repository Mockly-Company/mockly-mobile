import {
  InfiniteData,
  QueryFunction,
  QueryKey,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  useSuspenseInfiniteQuery,
  UseSuspenseInfiniteQueryOptions,
} from '@tanstack/react-query';

export function usePagingQuery<
  T extends ApiPagingResponse,
  TError = Error,
  TData = InfiniteData<T, unknown>,
  TQueryKey extends QueryKey = readonly unknown[],
>({
  initialPageParam = '',
  ...props
}: Omit<
  UseInfiniteQueryOptions<
    T,
    TError,
    TData,
    TQueryKey,
    ApiPagingResponse['cursor']
  >,
  'getNextPageParam' | 'queryFn' | 'initialPageParam'
> & {
  queryFn: QueryFunction<T, TQueryKey, never>;
  initialPageParam?: ApiPagingResponse['cursor'];
}) {
  return useInfiniteQuery({
    // 타입 일치 문제가 있지만 공통 페이징 객체 쓰기때문에 강제 타입 캐스팅.
    ...(props as UseInfiniteQueryOptions<
      T,
      TError,
      TData,
      TQueryKey,
      ApiPagingResponse['cursor']
    >),
    initialPageParam,
    getNextPageParam: lastPage => {
      return lastPage.nextCursor;
    },
  });
}

export function useSuspensePagingQuery<
  T extends ApiPagingResponse,
  TError = Error,
  TData = InfiniteData<T, unknown>,
  TQueryKey extends QueryKey = readonly unknown[],
>({
  initialPageParam = '',
  ...props
}: Omit<
  UseSuspenseInfiniteQueryOptions<
    T,
    TError,
    TData,
    TQueryKey,
    ApiPagingResponse['cursor']
  >,
  'getNextPageParam' | 'queryFn' | 'initialPageParam'
> & {
  queryFn: QueryFunction<T, TQueryKey, never>;
  initialPageParam?: ApiPagingResponse['cursor'];
}) {
  return useSuspenseInfiniteQuery({
    // 타입 일치 문제가 있지만 공통 페이징 객체 쓰기때문에 강제 타입 캐스팅. (보이는 타입은 실제 공통 타입과 일치)
    ...(props as UseSuspenseInfiniteQueryOptions<
      T,
      TError,
      TData,
      TQueryKey,
      ApiPagingResponse['cursor']
    >),
    initialPageParam,
    getNextPageParam: lastPage => {
      return lastPage.nextCursor;
    },
  });
}

interface ApiPagingResponse {
  cursor: string;
  nextCursor: string;
}
