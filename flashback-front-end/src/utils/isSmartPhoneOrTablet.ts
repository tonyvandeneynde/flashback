export const isMobileOrTablet = () => {
  return /Mobi|Android|iPad|iPhone/i.test(navigator.userAgent);
};
