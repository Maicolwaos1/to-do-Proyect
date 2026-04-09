const express = require("express");

const taskController = require("../controllers/taskController");
const {
  validateTaskId,
  validateCreateTask,
  validateUpdateTask,
} = require("../middlewares/validateTask");

const router = express.Router();

router.patch("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Task retrieved successfully",
  });
});
router.get("/", taskController.getAllTasks);
router.get("/:id", validateTaskId, taskController.getTaskById);
router.post("/", validateCreateTask, taskController.createTask);
router.put(
  "/:id",
  validateTaskId,
  validateUpdateTask,
  taskController.updateTask,
);

router.delete("/:id", validateTaskId, taskController.deleteTask);

module.exports = router;
