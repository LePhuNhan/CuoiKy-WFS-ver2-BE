const requireUser = async (req, res, next) => {
  if (!req.user) throw new Error("You must login");
  return next();
};

export { requireUser };
