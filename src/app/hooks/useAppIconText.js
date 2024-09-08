const useAppIconText = (type = 'text') => {
  const icons = {
    crm: [
      'assets/images/logo/logo-crm-text.svg',
      'assets/images/logo/logo-zealit.svg',
      'Zealit - CRM',
    ],
    shalx: [
      'assets/images/logo/logo-shalx-text.svg',
      'assets/images/logo/logo-shalx.svg',
      'Zealit - LTR',
    ],
    zealit: [
      'assets/images/logo/modifiedLogo.png',
      'assets/images/logo/logo-zealit.svg',
      'Zealit 2.0',
    ],
  };

  const {
    REACT_APP_KEY: key,
    REACT_APP_ICON_TEXT: iconText,
    REACT_APP_ICON: icon,
    REACT_APP_TITLE: title,
  } = process.env;

  const ico = icons[key];

  if (type === 'text') return iconText || ico[0] || icons.shalx[0];
  if (type === 'icon') return icon || ico[1] || icons.shalx[1];
  return title || ico[2] || icons.shalx[2];
};

export default useAppIconText;
