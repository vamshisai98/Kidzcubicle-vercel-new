import React from 'react'

import { Grid } from '@mui/material';

import './Footer.scss'

const Footer = () => {
  return (
    <Grid container alignItems={'center'}  className='Footer--container'>
    <Grid item xs={12} textAlign={'center'}>
    © Copyright KidzCubicle | All Rights Reserved • Privacy Policy
    </Grid>
  </Grid>
  )
}

export default Footer