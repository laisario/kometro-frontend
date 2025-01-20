import { useQuery } from 'react-query';
import {axios} from '../../api'

const useUsers = (id) => {
  const { 
    users, 
    errorUsers, 
    isLoadingUsers, 
    refetchUsers 
  } = useQuery(['users', id], async () => {
    if (id) {
      const response = await axios.get(`/users/${id}`, { params: { page_size: 9999 } });
      return response?.data;
    }
    const response = await axios.get('/users', { params: { page_size: 9999 } });
    return response?.data?.results;
  });

  return {
    users, 
    errorUsers, 
    isLoadingUsers, 
    refetchUsers 
  }
}

export default useUsers;