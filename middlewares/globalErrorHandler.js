exports.globalErrorHandler = (err, req, res, next) => {
  //Stack

  // message
  const stack = err?.stack;
  const status = err?.statusCode ? err.statusCode : 500;
  const message = err?.message;
  res.status(status).json({
    stack,
    message,
  });
};

// 404 handler
exports.notFound = (req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} not found`);
  next(err);
};
