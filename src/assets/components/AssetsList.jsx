import React from 'react'
import { Grid } from '@mui/material';
import AssetCard from './AssetCard';

function AssetsList({ assets, setSelected, selected, ...other }) {
  return (
    <Grid container spacing={3} {...other}>
      {assets?.results?.map((asset) => (
        <Grid key={asset?.id} item xs={12} sm={6} md={3}>
          <AssetCard asset={asset} setSelected={setSelected} selected={selected} />
        </Grid>
      ))}
    </Grid>
  );
}

export default AssetsList
