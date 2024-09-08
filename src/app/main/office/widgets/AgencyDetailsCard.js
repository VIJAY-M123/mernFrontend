import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { AccountCircleOutlined, EmailOutlined, PhoneAndroidOutlined } from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import ItemIcon from 'app/shared-components/FileUpload/ItemIcon';
import { selectUser } from 'app/store/userSlice';
import { useSelector } from 'react-redux';

import utils from 'src/@utils';

const { createDataGridHeader, openLink, handleFileType } = utils;

const headers = [
  createDataGridHeader('APA_ATH_NAME', 'Attachment Name', 0, 1, 100),
  createDataGridHeader('APA_DETAILS', 'Details', 0, 1, 100),
  createDataGridHeader('action', 'Action', 0, 1, 100),
];
const AgencyDetails = ({ agencyDetails }) => {
  const user = useSelector(selectUser);

  const handleDownload = (file) => {
    console.log(file);
    openLink(user.data.blob_url + file.APA_FILE_NAME);
  };

  return (
    <div>
      <Typography variant="h5" className="font-bold">
        {agencyDetails.length ? 'Agency Details' : null}
      </Typography>
      <Grid container spacing={2}>
        {agencyDetails.map((details, index) => (
          <Grid item md={12} key={index}>
            <Card className="p-12 rounded">
              <CardContent>
                <div className="flex justify-between mt-4">
                  <div className="w-1/2">
                    <div className="flex justify-between items-center space-y-8">
                      <div>Agency Name</div>
                      <Tooltip title={details?.CP_NAME}>
                        <div className="font-bold w-1/2">{details.CP_NAME}</div>
                      </Tooltip>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div>Address</div>
                      <Tooltip title={details?.CP_ADD}>
                        <div className="font-bold w-1/2 flex-wrap">{details?.CP_ADD}</div>
                      </Tooltip>
                    </div>
                    {details?.CP_ATTACHMENT_DETAILS && <hr className="my-14" />}
                    {details?.CP_ATTACHMENT_DETAILS && (
                      <Typography variant="h5">Attachments</Typography>
                    )}
                    {details?.CP_ATTACHMENT_DETAILS?.map((r, ind) => (
                      <div className="flex" key={ind}>
                        <Box
                          sx={{ backgroundColor: 'background.paper' }}
                          className="flex flex-col relative sm:w-160 h-160 m-8 p-16 shadow rounded-16 cursor-pointer"
                        >
                          <IconButton
                            className="absolute z-20 top-0 right-0 m-6 w-32 h-32 min-h-32"
                            onClick={() => handleDownload(r)}
                          >
                            <FuseSvgIcon size={20} color="secondary">
                              heroicons-solid:download
                            </FuseSvgIcon>
                          </IconButton>
                          <div
                            className="flex flex-auto w-full items-center justify-center"
                            role="button"
                            tabIndex={0}
                          >
                            <ItemIcon type={r.APA_FILE_NAME.split('.')[1].toUpperCase()} />
                          </div>
                          <div className="flex shrink flex-col justify-center text-center">
                            <Tooltip title={r.APA_FILE_NAME}>
                              <Typography className="truncate text-12 font-medium">
                                {r.APA_FILE_NAME}
                              </Typography>
                            </Tooltip>
                          </div>
                        </Box>
                      </div>
                    ))}
                  </div>
                  <Divider orientation="vertical" flexItem className="border-1 bg-black mx-24" />
                  <div
                    className={`w-1/2 flex-start items-center ${
                      details?.CP_CONTACT_DETAILS && 'h-[calc(100vh-200px)]'
                    } overflow-scroll`}
                  >
                    {details?.CP_CONTACT_DETAILS && <Typography variant="h6" className="mt-18" />}
                    {details?.CP_CONTACT_DETAILS && <hr className="mt-30" />}
                    {details.CP_CONTACT_DETAILS?.map((i, e) => (
                      <div key={e}>
                        <div className="flex justify-between my-12">
                          <div className="flex flex-col space-y-8">
                            <div className="flex gap-4 text-grey-700">
                              <AccountCircleOutlined />
                              Contact Name
                            </div>
                            <div className="flex gap-4 text-grey-700">
                              <PhoneAndroidOutlined />
                              Mobile Number
                            </div>
                            <div className="flex gap-4 text-grey-700">
                              <EmailOutlined />
                              Email
                            </div>
                          </div>
                          <div className="font-bold w-1/2 justify-center flex flex-col space-y-8 truncate ">
                            <div>{i.CCD_NAME}</div>
                            <div>{i.CCD_NUMBER}</div>
                            <div>
                              <Tooltip title={i.CCD_EMAIL}>
                                <div>{i.CCD_EMAIL}</div>
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                        <hr />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};
export default AgencyDetails;
