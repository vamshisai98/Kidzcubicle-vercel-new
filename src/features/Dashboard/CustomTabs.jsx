import React from 'react';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import PropTypes from 'prop-types';

import './CustomTabs.scss';

const CustomTabs = ({ tabsList, onTabChange, tabValue }) => {
  return (
    <Grid>
      <Tabs
        className="CustomTabs__tabs"
        aria-label="custom_tabs"
        value={tabValue}
        onChange={onTabChange}
      >
        {tabsList.map((tab, index) => {
          return (
            <Tab
              sx={{ display: 'flex', justifyContent: 'space-around' }}
              key={index}
              label={tab}
              id={`custom-tab-${index}`}
              aria-controls={`custom-tabpanel-${index}`}
            />
          );
        })}
      </Tabs>
    </Grid>
  );
};
CustomTabs.defaultProps = {
  tabValue: null,
  tabsList: [],
  onTabChange: () => {},
};

CustomTabs.propTypes = {
  tabsList: PropTypes.arrayOf(PropTypes.string),
  tabValue: PropTypes.number,
  onTabChange: PropTypes.func,
};

export default CustomTabs;
