export const getSkipLimit = ({ page = 1, per_page = 10 }) => {
  const limit = per_page;
  const skip = (page - 1) * limit;
  return { skip, limit };
};
