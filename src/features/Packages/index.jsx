import React, { useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';

import CustomButton from '../../common/components/CustomButton';
import { packagesData } from './mockedData';

import styles from './packages.module.scss';

const Packages = () => {
  const [buttonClicked, setButtonClicked] = useState(new Array(packagesData.length).fill(false));

  const handleButtonClick = (index) => {
    const newButtonClicked = [...buttonClicked];
    newButtonClicked[index] = !newButtonClicked[index];
    setButtonClicked(newButtonClicked);
  };

  return (
    <div className={styles.mainContainer}>
      <Grid
        container
        rowSpacing={6}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        justifyContent="center"
      >
        {packagesData.map((packageItem, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={6}
            lg={6}
            key={index}
          >
            <Box
              px={3}
              py={2}
              className={styles.customBoxShadow}
            >
              {packageItem.popular && (
                <div className={styles.popular}>
                  <p>{packageItem.popular}</p>
                </div>
              )}
              <Box
                mb={2}
                backgroundColor={packageItem.backgroundColor}
                py={0.5}
                width="100%"
              />
              <div style={{ height: '165px' }}>
                <Typography
                  fontSize={'23px'}
                  fontStyle={600}
                >
                  {packageItem.title}
                </Typography>
                <Typography fontSize={'14px'}>{packageItem.description}</Typography>
                <Typography
                  fontSize={'33px'}
                  fontStyle={600}
                  color={'primary'}
                >
                  {packageItem.price}
                </Typography>
                <CustomButton
                  variant={buttonClicked[index] ? 'contained' : 'outlined'}
                  color={'primary'}
                  classes={styles.btn}
                  sx={{ color: buttonClicked[index] && 'white' }}
                  onClick={() => handleButtonClick(index)}
                >
                  Select
                </CustomButton>
              </div>
              <Box
                border="1px solid #DCDCDC"
                mt={2}
                width={'100%'}
              />
              {packageItem.features.map((feature, featureIndex) => (
                <Box
                  key={featureIndex}
                  mt={2}
                  display="flex"
                  alignItems="center"
                >
                  <img
                    src={feature.icon}
                    alt="tick"
                  />
                  <Typography
                    ml={1}
                    fontSize={'13px'}
                    color={'#5D5251'}
                    fontWeight={500}
                  >
                    {feature.text}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Packages;
