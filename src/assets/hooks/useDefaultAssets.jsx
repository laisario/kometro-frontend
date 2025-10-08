import React, { useEffect, useState } from 'react'
import { axios } from "../../api";
import _, {debounce} from 'lodash';
import { useQuery, useInfiniteQuery } from "react-query";

function useDefaultAssets() {
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [search, setSearch] = useState('')
  
  const { 
    data, 
    error,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['instrumentos-empresa', debouncedSearch], 
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axios.get(`/instrumentos-empresa/`, { params: { 
        page: pageParam,
        page_size: 5,  
        search: debouncedSearch 
      }});
      return response?.data;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      const url = new URL(lastPage.next);
      return url.searchParams.get('page');
    },
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const handleSearch = debounce((value) => setDebouncedSearch(value));
  useEffect(() => { handleSearch(search) }, [search, handleSearch]);
  
  const allResults = data?.pages?.flatMap(page => page.results) || [];

  return {
    defaultAssets: { results: allResults, count: data?.pages?.[0]?.count || 0 },
    errorDefaultAssets: error,
    search,
    setSearch,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  }
}

export default useDefaultAssets


