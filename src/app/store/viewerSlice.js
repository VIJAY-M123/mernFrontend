import { createSlice } from '@reduxjs/toolkit';

const initalExcel = {
  url: '',
  name: '',
  data: [],
  headers: {},
  extraData: {},
  handleClose: null,
  handleUpload: null,
  handleObject: null,
};

const initialUpload = {
  files: [],
  height: 'max-h-[250px]',
};

const initialState = {
  state: false,
  viewer: {
    name: '',
    base64: '',
  },
  alert: {
    state: false,
    title: null,
    content: null,
    actions: null,
    handleAgree: null,
  },
  upload: initialUpload,
  documentURL: '',
  excel: initalExcel,
};

const viewerSlice = createSlice({
  name: 'viewer',
  initialState,
  reducers: {
    setViewer: (state, action) => {
      state.viewer = action.payload;
    },
    openViewer: (state, action) => {
      state.state = action.payload;
    },
    setAlert: (state, action) => {
      state.alert = action.payload;
    },
    setFiles: (state, action) => {
      state.upload.files = action.payload;
    },
    setFilesHeight: (state, action) => {
      state.upload.height = action.payload;
    },
    deleteFile: (state, action) => {
      const { upload } = state;
      upload.files = upload.files.filter(({ id }) => id !== action.payload);
    },
    setDocumentURL: (state, action) => {
      state.documentURL = action.payload;
    },
    setExcelName: (state, action) => {
      state.excel.name = action.payload;
    },
    setExcelURL: (state, action) => {
      state.excel.url = action.payload;
    },
    setExcelData: (state, action) => {
      state.excel.data = action.payload;
    },
    setExcelHeaders: (state, action) => {
      state.excel.headers = action.payload;
    },
    setExcelExtraData: (state, action) => {
      state.excel.extraData = action.payload;
    },
    setExcelHandleClose: (state, action) => {
      state.excel.handleClose = action.payload;
    },
    setExcelHandleUpload: (state, action) => {
      state.excel.handleUpload = action.payload;
    },
    setExcelHandleObject: (state, action) => {
      state.excel.handleObject = action.payload;
    },
    setInitalExcel: (state) => {
      state.excel = initalExcel;
    },
    setInitialUpload: (state) => {
      state.upload = initialUpload;
    },
    setInitialViewer: (state) => {
      state = initialState;
    },
  },
});

export const {
  setViewer,
  openViewer,
  setAlert,
  setFiles,
  setFilesHeight,
  deleteFile,
  setDocumentURL,
  setExcelName,
  setExcelURL,
  setExcelData,
  setExcelHeaders,
  setExcelExtraData,
  setExcelHandleClose,
  setExcelHandleUpload,
  setExcelHandleObject,
  setInitalExcel,
  setInitialUpload,
  setInitialViewer,
} = viewerSlice.actions;

export const selectViewer = ({ viewer }) => viewer.state;

export const selectViewerDetails = ({ viewer }) => viewer.viewer;

export const selectAlert = ({ viewer }) => viewer.alert;

export const selectFiles = ({ viewer }) => viewer.upload.files;

export const selectFilesHeight = ({ viewer }) => viewer.upload.height;

export const selectDocumentURL = ({ viewer }) => viewer.documentURL;

export const selectExcelName = ({ viewer }) => viewer.excel.name;

export const selectExcelURL = ({ viewer }) => viewer.excel.url;

export const selectExcelData = ({ viewer }) => viewer.excel.data;

export const selectExcelHeaders = ({ viewer }) => viewer.excel.headers;

export const selectExcelExtraData = ({ viewer }) => viewer.excel.extraData;

export const selectExcelHandleClose = ({ viewer }) => viewer.excel.handleClose;

export const selectExcelHandleUpload = ({ viewer }) => viewer.excel.handleUpload;

export const selectExcelHandleObject = ({ viewer }) => viewer.excel.handleObject;

export default viewerSlice.reducer;
