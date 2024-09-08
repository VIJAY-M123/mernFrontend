import { Button, Box, Card, CardContent, Typography } from '@mui/material';
import { lighten } from '@mui/material/styles';
import { selectFiles, selectFilesHeight, setFiles } from 'app/store/viewerSlice';
import { useDispatch, useSelector } from 'react-redux';
import utils from 'src/@utils';
import axios from 'axios';
import { selectUser } from 'app/store/userSlice';
import { format } from 'date-fns';
import FileItem from './FileItem';

const { fileToBuffer, handleFileType } = utils;

const FileUpload = () => {
  const dispatch = useDispatch();

  const height = useSelector(selectFilesHeight);
  const files = useSelector(selectFiles);
  const user = useSelector(selectUser);

  const handleFiles = (e) => {
    const count = files.length && files.at(-1).id + 1;
    const uploadedFiles = Object.values(e.target.files);
    const completedFiles = [];

    uploadedFiles.forEach((file, index) => {
      fileToBuffer(file)
        .then((base64) => {
          const i = file.name.lastIndexOf('.');
          const ext = file.name.slice(i);
          const newName = file.name.slice(0, i) + format(new Date(), 'yyyyMMHHmmSS') + ext;

          const data = {
            account_name: user.data.blob_acc_name,
            account_key: user.data.blob_acc_key,
            account_container: user.data.blob_acc_cntr,
            VIA_BASE64: base64,
            VIA_FILE_NAME: newName,
          };

          const status = {
            id: count + index,
            type: handleFileType(ext.slice(1)),
            name: newName,
          };

          axios
            .post('api/TransportOrder/PostVendInvAttachments', data)
            .then(() => {
              completedFiles.push(status);
              if (completedFiles.length === uploadedFiles.length) {
                const newFiles = [...files, ...completedFiles.filter((c) => !c.failed)].sort(
                  (a, b) => a.id - b.id
                );

                dispatch(setFiles(newFiles));
              }
            })
            .catch((err) => {
              console.log('err', err);
              status.failed = true;
              completedFiles.push(status);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  return (
    <>
      <Card
        sx={{ borderColor: 'primary.light' }}
        className="flex items-center justify-center mb-12 p-12"
      >
        <CardContent>
          <Box className="flex flex-col items-center justify-center">
            <Typography variant="div" className="text-lg font-semibold mb-12">
              Upload files here
            </Typography>
            <Button color="primary" variant="contained" component="label" onChange={handleFiles}>
              Upload
              <input hidden multiple type="file" />
            </Button>
          </Box>
        </CardContent>
      </Card>
      {files.length > 0 && (
        <Box
          className={`p-16 w-full rounded-16 mb-24 border overflow-scroll ${height}`}
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? lighten(theme.palette.background.default, 0.4)
                : lighten(theme.palette.background.default, 0.02),
          }}
        >
          <Typography className="font-medium">Files</Typography>

          <div className="flex flex-wrap -m-8 mt-8">
            {files.map((item) => (
              <FileItem key={item.id} item={item} />
            ))}
          </div>
        </Box>
      )}
    </>
  );
};

export default FileUpload;
