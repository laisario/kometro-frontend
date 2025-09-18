import AssetsContext from "../components/context";
import { useQuery } from 'react-query';
import { axios } from '../../api';
import useAuth from "../../auth/hooks/useAuth";

export const buildTreeItems = (sector, parentId = null) => {
  const children = [];

  if (sector?.subsetores?.length) {
    sector.subsetores.forEach((sub) => {
      children.push(buildTreeItems(sub, sector.id));
    });
  }

  if (sector?.instrumentos?.length) {
    sector.instrumentos.forEach((instr) => {
      children.push({
        id:`instrument-${instr.id}`,
        label: instr.tag || instr.numeroDeSerie || 'Instrumento',
        itemType: 'instrument',
        instrumentoData: instr,
        parentId: String(sector.id),
      });
    });
  }

  return {
    id: String(sector?.id),
    label: sector.nome,
    itemType: "sector",
    parentId: parentId ? String(parentId) : null,
    children,
  };
};

const AssetsProvider = ({ children }) => {
  const { user } = useAuth();

  const { 
    data: sectors,
    isFetching: isLoadingSectors,
  } = useQuery(
    {
      queryKey: ['setores'], 
      queryFn: async () => {
        const params = {
          cliente_id: user?.cliente,
        };

        const response = await axios.get('/setores/hierarquia/', { params });

        const items = response?.data?.map((sect) => buildTreeItems(sect));

        return items
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect:false,
    }

  );


  return (
    <AssetsContext.Provider
      value={{
        sectors,
        isLoadingSectors,
      }}
    >
      {children}
    </AssetsContext.Provider>
  );
};

export default AssetsProvider;
