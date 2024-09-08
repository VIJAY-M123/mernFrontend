import { Backdrop, CircularProgress } from '@mui/material';
import { selectFuseLoader } from 'app/store/fuse/loaderSlice';
import { useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';

const rotateBefore = keyframes` 
  from {
    transform: rotateX(60deg) rotateY(45deg) rotateZ(0deg);
  }
  to {
    transform: rotateX(60deg) rotateY(45deg) rotateZ(-360deg);
  }
`;

const rotateAfter = keyframes`
  from {
    transform: rotateX(240deg) rotateY(45deg) rotateZ(0deg);
  }
  to {
    transform: rotateX(240deg) rotateY(45deg) rotateZ(360deg);
  }
`;

const base64 = `PHN2ZyB3aWR0aD0iMjY2cHgiIGhlaWdodD0iMjk3cHgiIHZpZXdCb3g9IjAgMCAyNjYgMjk3IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnNrZXRjaD0iaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoL25zIiBzdHlsZT0iY29sb3I6ICMwZjE3MmE7Ij4KICAgIDx0aXRsZT5zcGlubmVyPC90aXRsZT4KICAgIDxkZXNjcmlwdGlvbj5DcmVhdGVkIHdpdGggU2tldGNoIChodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gpPC9kZXNjcmlwdGlvbj4KICAgIDxkZWZzLz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSIjZWNlY2VjIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHNrZXRjaDp0eXBlPSJNU1BhZ2UiPgogICAgICAgIDxwYXRoIGQ9Ik0xNzEuNTA3ODEzLDMuMjUwMDAwMzggQzIyNi4yMDgxODMsMTIuODU3NzExMSAyOTcuMTEyNzIyLDcxLjQ5MTI4MjMgMjUwLjg5NTU5OSwxMDguNDEwMTU1IEMyMTYuNTgyMDI0LDEzNS44MjAzMSAxODYuNTI4NDA1LDk3LjA2MjQ5NjQgMTU2LjgwMDc3NCw4NS43NzM0MzQ2IEMxMjcuMDczMTQzLDc0LjQ4NDM3MjEgNzYuODg4NDYzMiw4NC4yMTYxNDYyIDYwLjEyODkwNjUsMTA4LjQxMDE1MyBDLTE1Ljk4MDQ2ODUsMjE4LjI4MTI0NyAxNDUuMjc3MzQ0LDI5Ni42Njc5NjggMTQ1LjI3NzM0NCwyOTYuNjY3OTY4IEMxNDUuMjc3MzQ0LDI5Ni42Njc5NjggLTI1LjQ0OTIxODcsMjU3LjI0MjE5OCAzLjM5ODQzNzUsMTA4LjQxMDE1NSBDMTYuMzA3MDY2MSw0MS44MTE0MTc0IDg0LjcyNzU4MjksLTExLjk5MjI5ODUgMTcxLjUwNzgxMywzLjI1MDAwMDM4IFoiIGlkPSJQYXRoLTEiIGZpbGw9IiNlY2VjZWMiIHNrZXRjaDp0eXBlPSJNU1NoYXBlR3JvdXAiLz4KICAgIDwvZz4KPC9zdmc+`;

const Spinner = styled.div`
  &:before {
    transform: rotateX(60deg) rotateY(45deg) rotateZ(45deg);
    animation: 750ms ${rotateBefore} infinite linear reverse;
  }

  &:after {
    transform: rotateX(240deg) rotateY(45deg) rotateZ(45deg);
    animation: 750ms ${rotateAfter} infinite linear;
  }

  &:before,
  &:after {
    content: '';
    position: fixed;
    top: 50%;
    left: 50%;
    margin-top: -5em;
    margin-left: -5em;
    width: 10em;
    height: 10em;
    transform-style: preserve-3d;
    transform-origin: 50%;
    transform: rotateY(50%);
    perspective-origin: 50% 50%;
    perspective: 340px;
    background-size: 10em 10em;
    background-image: url(data:image/svg+xml;base64,${base64});
  }
`;

const Loader = (props) => {
  const open = useSelector(selectFuseLoader);
  return (
    <>
      <Backdrop sx={{ color: '#fff', zIndex: 10000 + 1 }} open={open}>
        {props.spinner ? <Spinner /> : <CircularProgress color="inherit" />}
      </Backdrop>
      {props.children}
    </>
  );
};

export default Loader;
