let latestPhotoUri: string | null = null;

export const setLatestPhoto = (uri: string) => {
  latestPhotoUri = uri;
};

export const getLatestPhoto = () => {
  return latestPhotoUri;
};

export const clearLatestPhoto = () => {
  latestPhotoUri = null;
};