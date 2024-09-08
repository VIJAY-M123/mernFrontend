import { useState } from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab } from '@mui/material';
import SocialMediaCampaign from './SocialMediaCampaign';
import SocialMediaTrackingReport from './SocialMediaTrackingReport';

export default function SocialCampaignIndex() {
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
              <Tab label="Social Media Campaign" value="1" />
              <Tab label="Social Media Tracking Report" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <SocialMediaCampaign />
          </TabPanel>
          <TabPanel value="2">
            <SocialMediaTrackingReport />
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
}
