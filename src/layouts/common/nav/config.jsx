import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeIcon from '@mui/icons-material/Home';
import ScaleIcon from '@mui/icons-material/Scale';
import DescriptionIcon from '@mui/icons-material/Description';
import Groups2Icon from '@mui/icons-material/Groups2';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

export const navConfigClient = [
  {
    title: 'página inicial',
    path: '/dashboard/app',
    icon: <HomeIcon />,
  },
  {
    title: 'meus instrumentos',
    path: '/dashboard/instrumentos',
    icon: <ScaleIcon />,
  },
  {
    title: 'minhas propostas',
    path: '/dashboard/propostas',
    icon: <ShoppingCartIcon />,
  },
  {
    title: 'Documentos',
    path: '/dashboard/documentos',
    icon: <DescriptionIcon />
  },
  {
    title: 'Acessos',
    path: '/dashboard/acessos',
    icon: <GroupAddIcon />
  },
];

export const navConfigAdmin = [
  {
    title: 'Página inicial',
    path: '/admin/app',
    icon: <HomeIcon />,
  },
  {
    title: 'Clientes',
    path: '/admin/clientes',
    icon: <Groups2Icon />
  },
  {
    title: 'propostas',
    path: '/admin/propostas',
    icon: <ShoppingCartIcon />,
  },
  {
    title: 'Documentos',
    path: '/admin/documentos',
    icon: <DescriptionIcon />
  },
  {
    title: 'Acessos',
    path: '/admin/acessos',
    icon: <GroupAddIcon />
  },
]

