# Todo List REST API

Simple REST API for managing tasks with Node.js, Express, and MySQL.

## Folder Structure

```text
todo-list-api/
├── config/
│   └── db.js
├── controllers/
│   └── taskController.js
├── middlewares/
│   ├── errorHandler.js
│   ├── notFound.js
│   └── validateTask.js
├── models/
│   └── taskModel.js
├── routes/
│   └── taskRoutes.js
├── sql/
│   └── init.sql
├── .env.example
├── .gitignore
├── app.js
├── package.json
├── README.md
└── server.js
```

## Installation

1. Install Node.js and MySQL.
2. Create the database and table by running the script in `sql/init.sql`.
3. Copy `.env.example` to `.env` and update the MySQL credentials.
4. Install dependencies:

```bash
npm install
```

## Run the Project

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The API will be available at `http://localhost:3000`.

## Endpoints

- `GET /tasks`
- `GET /tasks/:id`
- `POST /tasks`
- `PUT /tasks/:id`
- `DELETE /tasks/:id`

## Postman Testing

Base URL:

```text
http://localhost:3000
```

### 1. Get all tasks

- Method: `GET`
- URL: `/tasks`

### 2. Get one task

- Method: `GET`
- URL: `/tasks/1`

### 3. Create task

- Method: `POST`
- URL: `/tasks`
- Body JSON:

```json
{
  "title": "Read documentation",
  "description": "Review the Express project structure",
  "completed": false
}
```

##### 4. Update task

- Method: `PUT`
- URL: `/tasks/1`
- Body JSON:

```json
{
  "title": "Read updated documentation",
  "description": "Review routes and controllers",
  "completed": true
}
```

### 5. Delete task

- Method: `DELETE`
- URL: `/tasks/1`
