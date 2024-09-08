import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <Box role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </Box>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const CustomizedTabs = ({
  appBar,
  appBarProps,
  swipeable,
  swipeableProps,
  tabs,
  tabsProps,
  variant,
  selectedTab,
}) => {
  const theme = useTheme();
  const [value, setValue] = useState(selectedTab || 0);

  useEffect(() => {
    if (selectedTab) setValue(selectedTab);
  }, [selectedTab]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const tabsProp = {
    value,
    onChange: handleChange,
    indicatorColor: 'primary',
    textColor: 'inherit',
    variant: variant || 'scrollable',
    scrollButtons: 'auto',
    ...tabsProps,
  };

  return (
    <Box sx={{ bgcolor: 'background.paper' }}>
      {appBar ? (
        <AppBar className="rounded-md" color="transparent" position="static" {...appBarProps}>
          <Tabs {...tabsProp}>
            {tabs.map((tab, i) => (
              <Tab icon={tab.icon} iconPosition="start" key={i} {...tab.tab} />
            ))}
          </Tabs>
        </AppBar>
      ) : (
        <Tabs {...tabsProp}>
          {tabs.map((tab, i) => (
            <Tab icon={tab.icon} iconPosition="start" key={i} {...tab.tab} />
          ))}
        </Tabs>
      )}
      {swipeable ? (
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={value}
          onChangeIndex={handleChangeIndex}
          {...swipeableProps}
        >
          {tabs.map((tab, i) => (
            <TabPanel key={i} value={value} index={i} dir={theme.direction} {...tab.panel.props}>
              {tab.panel.children}
            </TabPanel>
          ))}
        </SwipeableViews>
      ) : (
        tabs.map((tab, i) => (
          <TabPanel key={i} value={value} index={i} dir={theme.direction} {...tab.panel.props}>
            {tab.panel.children}
          </TabPanel>
        ))
      )}
    </Box>
  );
};

export default CustomizedTabs;
