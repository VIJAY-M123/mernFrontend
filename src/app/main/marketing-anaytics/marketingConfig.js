import CallCampaignIndex from './Call-Campaign/CallCampaignIndex';
import EmailAnalyticsIndex from './Email-Analytics/EmailAnalyticsIndex';
import SmsCampaignIndex from './Sms-Campaign/SmsCampaignIndex';
import SocialCampaignIndex from './Social-Campaign/SocialCampaignIndex';

const MarketingConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'marketing/email-analytics',
      element: <EmailAnalyticsIndex />,
    },
    {
      path: 'marketing/call-analytics',
      element: <CallCampaignIndex />,
    },
    {
      path: 'marketing/sms-analytics',
      element: <SmsCampaignIndex />,
    },
    {
      path: 'marketing/social-analytics',
      element: <SocialCampaignIndex />,
    },
  ],
};

export default MarketingConfig;
