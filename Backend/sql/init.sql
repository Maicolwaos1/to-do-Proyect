CREATE DATABASE IF NOT EXISTS todo_app;
USE todo_app;

DROP TABLE IF EXISTS tasks;

CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  completed TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tasks (title, description, completed) VALUES
  ('Buy groceries', 'Milk, eggs, bread, and fruit', 0),
  ('Finish API project', 'Build controllers, routes, and MySQL integration', 1),
  ('Workout', '30 minutes of cardio', 0);
