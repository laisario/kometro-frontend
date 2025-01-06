import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router';
import { Box, Link } from '@mui/material';


const Logo = forwardRef(({ disabledLink = false, sx }, ref) => {
  const logo = (
    <Box
      component="img"
      src="/assets/images/logo.png"
      sx={{ cursor: !disabledLink && 'pointer',  ...sx }}
    />
  );


  if (disabledLink) {
    return <>{logo}</>;
  }

  return (
    <Link to="/" component={RouterLink} sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
});

Logo.propTypes = {
  sx: PropTypes.object,
  disabledLink: PropTypes.bool,
};

export default Logo;
