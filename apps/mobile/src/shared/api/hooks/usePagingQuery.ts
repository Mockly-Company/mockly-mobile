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
  initialPageParam = 1,
  ...props
}: Omit<
  UseInfiniteQueryOptions<
    T,
    TError,
    TData,
    TQueryKey,
    ApiPagingResponse['total']
  >,
  'getNextPageParam' | 'queryFn' | 'initialPageParam'
> & {
  queryFn: QueryFunction<T, TQueryKey, never>;
  initialPageParam?: ApiPagingResponse['total'];
}) {
  return useInfiniteQuery({
    // 타입 일치 문제가 있지만 공통 페이징 객체 쓰기때문에 강제 타입 캐스팅. (보이는 타입은 실제 공통 타입과 일치,)
    // 강제 캐스팅 구체 이유 -> queryKey Store가 infiniteQuery에 대한 타입 지원이 안되기 때문에 실제 사용하는 공통 페이징 객체에 맞게 타입 캐스팅
    ...(props as UseInfiniteQueryOptions<
      T,
      TError,
      TData,
      TQueryKey,
      ApiPagingResponse['total']
    >),
    initialPageParam,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return lastPage.total < nextPage * 10 ? null : nextPage;
    },
  });
}

export function useSuspensePagingQuery<
  T extends ApiPagingResponse,
  TError = Error,
  TData = InfiniteData<T, unknown>,
  TQueryKey extends QueryKey = readonly unknown[],
>({
  initialPageParam = 1,
  ...props
}: Omit<
  UseSuspenseInfiniteQueryOptions<
    T,
    TError,
    TData,
    TQueryKey,
    ApiPagingResponse['total']
  >,
  'getNextPageParam' | 'queryFn' | 'initialPageParam'
> & {
  queryFn: QueryFunction<T, TQueryKey, never>;
  initialPageParam?: ApiPagingResponse['total'];
}) {
  return useSuspenseInfiniteQuery({
    // 타입 일치 문제가 있지만 공통 페이징 객체 쓰기때문에 강제 타입 캐스팅. (보이는 타입은 실제 공통 타입과 일치)
    ...(props as UseSuspenseInfiniteQueryOptions<
      T,
      TError,
      TData,
      TQueryKey,
      ApiPagingResponse['total']
    >),
    initialPageParam,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return lastPage.total < nextPage * 10 ? null : nextPage;
    },
  });
}

interface ApiPagingResponse {
  total: number;
}
