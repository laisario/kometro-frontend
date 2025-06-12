import { useQuery } from "react-query";
import useResponsive from "../../theme/hooks/useResponsive";
import { axios } from "../../api";

const useAssets = (id) => {
  const isMobile = useResponsive('down', 'md');

  const { 
    data: asset, 
    error: errorAsset, 
    isLoading: isLoadingAsset, 
    refetch: refetchAsset 
  } = useQuery({
    queryKey: ['instrumentos', id], 
    queryFn: async () => {
      const response = await axios.get(`/instrumentos/${id}/`, { params: { page_size: 9999 } });
      return response?.data;
    },
    enabled: !!id
  });

  return {
    asset, 
    errorAsset, 
    isLoadingAsset, 
    refetchAsset,
    isMobile,
  }
};

export default useAssets;