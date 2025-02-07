import { useQuery } from 'react-query';
import { axios } from '../../api';

export const useDashboard = () => {
  const { 
    data, 
    isLoading, 
  } = useQuery({
    queryKey: ['dashboard'], 
    queryFn: async () =>  await axios.get('/dashboard'),
  });
  return {
    data: data?.data,
    isLoading, 
  }
}
