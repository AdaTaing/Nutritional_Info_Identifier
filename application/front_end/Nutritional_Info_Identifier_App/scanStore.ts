let latestPhotoUri: string | null = null;

export const setLatestPhoto = (uri: string) => {
  latestPhotoUri = uri;
};

export const getLatestPhoto = () => {
  return latestPhotoUri;
<<<<<<< HEAD
};

export const clearLatestPhoto = () => {
  latestPhotoUri = null;
=======
>>>>>>> ec664cb35920a3350f4212e618738d6223eb6201
};