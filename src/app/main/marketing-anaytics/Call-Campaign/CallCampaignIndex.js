import { useState } from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab } from '@mui/material';
import CallCampaignReport from './CallCampaignReport';
import CallTrackingReport from './CallTrackingReport';

export default function CallCampaignIndex() {
  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="p-24">
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Call Campaign Report" value="1" />
              <Tab label="Call Tracking Report" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <CallCampaignReport />
          </TabPanel>
          <TabPanel value="2">
            <CallTrackingReport />
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
}
