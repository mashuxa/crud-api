# [CRUD API](https://github.com/mashuxa/crud-api/pull/1)
[TASK](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/crud-api/assignment.md) |
[SCORE](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/crud-api/score.md)

> Please, leave your discord contact. Thank you!

## Getting Started

Rename .env.example => .env and set your variables, for example:
```bash
PORT=4000
HOST=localhost
```

Install all dependencies:

```bash
npm i
```

Run linter:

```bash
npm run lint
```

Run tests:

```bash
npm run test
```

Run dev server:

```bash
npm run start:dev
```

Run prod server:

```bash
npm run start:prod
```

Run multi server:

```bash
npm run start:multi
```

## API 

### Endpoint: `api/users`

---

### Request:

**GET** `api/users` is used to get all persons

### Response:

Status: `200`
```
[{
  id: string;
  username: string;
  age: number;
  hobbies: string[];
},
...]
```

---

### Request:

**GET** `api/users/{userId}`  is used to get user by id

### Response:

Status: `200`
```
{
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}
```

---

### Request:

**POST** `api/users` is used to create record about new user and store it in database
```
{
  username: string;  [required]
  age: number;       [required]
  hobbies: string[]; [required]
}
```

### Response:

Status: `201`
```
{
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}
```

---

### Request:

**PUT** `api/users/{userId}` is used to update existing user
```
{
  username: string;
  age: number;
  hobbies: string[];
}
```

### Response:

Status: `200`
```
{
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}
```

---

### Request:

**DELETE** `api/users/{userId}` is used to delete existing user from database

### Response:

Status: `204`

---

## Error responses:

### If user is not found:

Status: `404` with message `User with id {userId} is not found`

### If user id is invalid:

Status: `400` with message `Incorrect uuid`

### If request body does not contain required fields:

Status: `400` with message `Body does not contain required fields`

### If request send to non-existing endpoints:

Status: `404` with message `Incorrect endpoint`

### If some error on server side:

Status: `500` with message `Server error`