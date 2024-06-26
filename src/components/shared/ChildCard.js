import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardContent, Divider } from '@mui/material';

const ChildCard = ({ title, children, color, bgcolor }) => (

  <Card sx={{ padding: 0,  borderColor: color , backgroundColor: bgcolor}} variant="outlined" > 
    {title ? (
      <>
        <CardHeader title={title} />
        <Divider sx={{ borderColor: color }} variant="middle" flexItem={true}/>{' '}
      </>
    ) : (
      ''
    )}

    <CardContent>{children}</CardContent>
  </Card>
);

ChildCard.propTypes = {
  title: PropTypes.string,
  color: PropTypes.string,
  bgcolor: PropTypes.string,
  children: PropTypes.node,
  footer: PropTypes.node,
};

export default ChildCard;
