import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { Box, Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Stack, TextField, Tooltip, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useRef, useState, useEffect } from 'react';
import useAuth from '../../auth/hooks/useAuth';
import CreateInstrument from './CreateInstrument';
import CustomTreeItem from './CustomTreeItem';

const TreeHeader = (props) => {
  const {
    handleCreate,
    openFormCreateInstrument, 
    setOpenFormCreateInstrument,
    defaultAssets,
    cliente,
    mutate,
    selectedItem,
    setSearchDA,
    searchDA,
    isFetching,
  } = props
  return (
    <>
      <Stack direction="row" alignItems="center" spacing={1}>
        <CreateInstrument 
          handleClose={() => setOpenFormCreateInstrument(false)}
          open={openFormCreateInstrument}
          defaultAssets={defaultAssets}
          setor={selectedItem}
          cliente={cliente}
          mutate={mutate}
          setSearchDA={setSearchDA}
          searchDA={searchDA}
          isFetching={isFetching}
        />
        
        <Typography sx={{ flexGrow: 1 }}>Setores</Typography>

        <Button size="small" onClick={() => { handleCreate(); }}>
          Criar setor
        </Button>
        {selectedItem && <Button variant='contained' onClick={() => setOpenFormCreateInstrument(true)} color='info' size="small">Criar instrumento</Button>}
      </Stack>
    </>
  )
}


function SetorTree(props) {
  const { 
    setores, 
    onAddSetor, 
    onEditSetor, 
    openEditSector,
    onDeleteSetor,
    openCreateSectorId,
    handleCreate,
    defaultAssets,
    mutate,
    expandedItems,
    setExpandedItems,
    selectedItem,
    setSelectedItem,
    handleEdit,
    handleCloseCreateSector,
    setSearchDA,
    searchDA,
    isFetching,
  } = props;
  const [openFormCreateInstrument, setOpenFormCreateInstrument] = useState(false)
  const { user } = useAuth();

  const handleSubmit = (sectorName, id) => {
    onEditSetor({id, nome: sectorName })
    handleCloseCreateSector()
  }
  
  const handleItemSelection = (event, id) => {
    event?.preventDefault()

    const findItemById = (id, items) => {
      for (let item of items) {
        if (String(item?.id) === String(id)) return item
        if (item?.children?.length) {
          const found = findItemById(id, item.children);
          if (found) return found;
        }
      }
    }
    const sector = findItemById(id, setores)
    setSelectedItem({id, type: sector?.itemType, parentId: sector?.parentId})
    setExpandedItems(oldExpandedItems => oldExpandedItems?.includes(id) ? oldExpandedItems?.filter((item) => Number(item) !== Number(id)) : [...oldExpandedItems, id])
  };

  return (
    <Box sx={{ minHeight: 352, minWidth: 300 }}>
      <TreeHeader
        handleCreate={handleCreate}
        openFormCreateInstrument={openFormCreateInstrument}
        setOpenFormCreateInstrument={setOpenFormCreateInstrument}
        defaultAssets={defaultAssets}
        cliente={user?.cliente}
        mutate={mutate}
        selectedItem={selectedItem}
        setSearchDA={setSearchDA}
        searchDA={searchDA}
        isFetching={isFetching}
      />
      <RichTreeView
        items={setores}
        onSelectedItemsChange={handleItemSelection}
        expandedItems={expandedItems}
        selectedItems={selectedItem ? [selectedItem?.id] : []}
        slots={{
          item:(props) => <CustomTreeItem 
            setSelectedItem={setSelectedItem} 
            onDeleteSetor={onDeleteSetor} 
            handleEditSector={onEditSetor} 
            selectedItem={selectedItem} 
            handleCreate={handleCreate}
            handleEdit={handleEdit}
            handleCloseCreateSector={handleCloseCreateSector}
            {...props} 
            handleSubmit={(sectorName) => handleSubmit(sectorName, props?.itemId)} 
            isEditing={Number(props?.itemId) === Number(openCreateSectorId)}
          />
        }}
      />
    </Box>
  );
}


export default SetorTree;