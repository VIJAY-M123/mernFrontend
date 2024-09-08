import { Box } from '@mui/system';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton, Tooltip } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon/FuseSvgIcon';
import { deleteFile } from 'app/store/viewerSlice';
import { selectUser } from 'app/store/userSlice';
import ItemIcon from './ItemIcon';
// import { setSelectedItem } from './store/itemsSlice';

function FileItem(props) {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);

  const { item } = props;

  if (!item) {
    return null;
  }

  const viewFile = () => {
    const { name } = item;

    const link = document.createElement('a');

    link.href = user.data.blob_url + name;
    link.target = '_blank';

    link.click();
  };

  return (
    <Box
      sx={{ backgroundColor: 'background.paper' }}
      className="flex flex-col relative w-full sm:w-160 h-160 m-8 p-16 shadow rounded-16 cursor-pointer"
    >
      <IconButton
        className="absolute z-20 top-0 right-0 m-6 w-32 h-32 min-h-32"
        onClick={() => dispatch(deleteFile(item.id))}
      >
        <FuseSvgIcon size={20} color="error">
          heroicons-solid:x-circle
        </FuseSvgIcon>
      </IconButton>
      <div
        className="flex flex-auto w-full items-center justify-center"
        onClick={viewFile}
        onKeyDown={viewFile}
        role="button"
        tabIndex={0}
      >
        <ItemIcon type={item.type} />
      </div>
      <div className="flex shrink flex-col justify-center text-center">
        <Tooltip title={item.name}>
          <Typography className="truncate text-12 font-medium">{item.name}</Typography>
        </Tooltip>
        {item.contents && (
          <Typography className="truncate text-12 font-medium" color="text.secondary">
            {item.contents}
          </Typography>
        )}
      </div>
    </Box>
  );
}

export default FileItem;
