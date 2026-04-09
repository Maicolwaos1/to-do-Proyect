const sendValidationError = (res, message) => {
  return res.status(400).json({
    success: false,
    message,
  });
};

const validateTaskId = (req, res, next) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return sendValidationError(res, "Task id must be a positive integer");
  }

  next();
};

const validateCreateTask = (req, res, next) => {
  const { title, completed } = req.body;

  if (!title || typeof title !== "string" || !title.trim()) {
    return sendValidationError(res, "Title is required");
  }

  if (completed !== undefined && typeof completed !== "boolean") {
    return sendValidationError(res, "Completed must be a boolean value");
  }

  req.body.title = title.trim();
  req.body.description =
    typeof req.body.description === "string" && req.body.description.trim()
      ? req.body.description.trim()
      : null;

  next();
};

const validateUpdateTask = (req, res, next) => {
  const { title, completed } = req.body;

  if (!title || typeof title !== "string" || !title.trim()) {
    return sendValidationError(res, "Title is required");
  }

  if (completed === undefined || typeof completed !== "boolean") {
    return sendValidationError(res, "Completed is required and must be a boolean value");
  }

  req.body.title = title.trim();
  req.body.description =
    typeof req.body.description === "string" && req.body.description.trim()
      ? req.body.description.trim()
      : null;

  next();
};

module.exports = {
  validateTaskId,
  validateCreateTask,
  validateUpdateTask,
};
