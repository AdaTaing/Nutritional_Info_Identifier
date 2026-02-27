let latestPhotoUri: string | null = null;

export const setLatestPhoto = (uri: string) => {
  latestPhotoUri = uri;
};

export const getLatestPhoto = () => {
  return latestPhotoUri;
};