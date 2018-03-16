const selectUploadImage = (state = {}) => {
  return state.upload ? state.upload.image : null ;
};
export default selectUploadImage;
