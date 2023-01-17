import request from "supertest";
import server from '../src/server';

describe('Api', () => {
  const mockUser = { username: 'username', age: 18, hobbies: ['test'] };
  const testServer = request(server);

  describe('with success status', () => {
    it('getUsers: should return object with empty data array by default with status 200', async () => {
      const { body, statusCode } = await testServer.get("/api/users");

      expect(statusCode).toStrictEqual(200);
      expect(body).toStrictEqual([]);
    });

    it('postUser: should create user and return it with status 201', async () => {
      const { body, statusCode } = await testServer.post('/api/users').send(mockUser);

      expect(statusCode).toStrictEqual(201);
      expect(body.username).toStrictEqual(mockUser.username);
      expect(body.age).toStrictEqual(mockUser.age);
      expect(body.hobbies).toStrictEqual(mockUser.hobbies);
    });

    it('getUserById: should return correct user with status 200', async () => {
      const { body: { id } } = await testServer.post('/api/users').send(mockUser);
      const { body, statusCode } = await testServer.get(`/api/users/${id}`);

      expect(statusCode).toStrictEqual(200);
      expect(body).toStrictEqual({ ...mockUser, id });
    });

    it('putUserById: should return updated user with status 200', async () => {
      const { body: { id } } = await testServer.post('/api/users').send(mockUser);
      const { body, statusCode } = await testServer.put(`/api/users/${id}`).send({ ...mockUser, username: 'vasia' });

      expect(statusCode).toStrictEqual(200);
      expect(body).toStrictEqual({ ...mockUser, id, username: 'vasia' });
    });

    it('deleteUserById: should return updated user with status 204', async () => {
      const { body: { id } } = await testServer.post('/api/users').send(mockUser);
      const { body, statusCode } = await testServer.delete(`/api/users/${id}`);

      expect(statusCode).toStrictEqual(204);
      expect(body).toStrictEqual('');
    });
  });

  describe('with bad request status', () => {
    it('getUserById: should return correct error message with status 400', async () => {
      const { body, statusCode } = await testServer.get('/api/users/123');

      expect(statusCode).toStrictEqual(400);
      expect(body).toStrictEqual('Incorrect uuid');
    });

    it('postUser: should return correct error message with status 400', async () => {
      const { body, statusCode } = await testServer.post('/api/users').send({});

      expect(statusCode).toStrictEqual(400);
      expect(body).toStrictEqual('Body does not contain required fields');
    });

    it('putUserById: should return correct error message with status 400', async () => {
      const { body, statusCode } = await testServer.put('/api/users/123');

      expect(statusCode).toStrictEqual(400);
      expect(body).toStrictEqual('Incorrect uuid');
    });

    it('deleteUserById: should return correct error message with status 400', async () => {
      const { body, statusCode } = await testServer.delete('/api/users/123');

      expect(statusCode).toStrictEqual(400);
      expect(body).toStrictEqual('Incorrect uuid');
    });
  });

  describe('with not found status for unknown id', () => {
    const uuid = '65e683d9-d030-48ec-9e78-f1c8ba17a6d5';

    it('getUserById: should return correct error message with status 404', async () => {
      const { body, statusCode } = await testServer.get(`/api/users/${uuid}`);

      expect(statusCode).toStrictEqual(404);
      expect(body).toStrictEqual(`User with id ${uuid} is not found`);
    });

    it('putUserById: should return correct error message with status 404', async () => {
      const { body, statusCode } = await testServer.put(`/api/users/${uuid}`).send(mockUser);

      expect(statusCode).toStrictEqual(404);
      expect(body).toStrictEqual(`User with id ${uuid} is not found`);
    });

    it('deleteUserById: should return correct error message with status 404', async () => {
      const { body, statusCode } = await testServer.delete(`/api/users/${uuid}`);

      expect(statusCode).toStrictEqual(404);
      expect(body).toStrictEqual(`User with id ${uuid} is not found`);
    });
  });

  describe('with not found status for unknown url', () => {
    const url = '/some-non/existing/resource';
    const errorMessage = "Incorrect endpoint";

    it('get method: should return correct error message with status 404', async () => {
      const { body, statusCode } = await testServer.get('/api//users');

      expect(statusCode).toStrictEqual(404);
      expect(body).toStrictEqual(errorMessage);
    });

    it('get method: should return correct error message with status 404', async () => {
      const { body, statusCode } = await testServer.get(url);

      expect(statusCode).toStrictEqual(404);
      expect(body).toStrictEqual(errorMessage);
    });

    it('post method: should return correct error message with status 404', async () => {
      const { body, statusCode } = await testServer.post(url).send(mockUser);

      expect(statusCode).toStrictEqual(404);
      expect(body).toStrictEqual(errorMessage);
    });

    it('put method: should return correct error message with status 404', async () => {
      const { body, statusCode } = await testServer.put(url).send({ ...mockUser, username: 'vasia' });

      expect(statusCode).toStrictEqual(404);
      expect(body).toStrictEqual(errorMessage);
    });

    it('delete method: should return correct error message with status 404', async () => {
      const { body, statusCode } = await testServer.delete(url);

      expect(statusCode).toStrictEqual(404);
      expect(body).toStrictEqual(errorMessage);
    });

    it('patch method: should return correct error message with status 404', async () => {
      const { body, statusCode } = await testServer.patch('/api/users');

      expect(statusCode).toStrictEqual(404);
      expect(body).toStrictEqual("Incorrect endpoint");
    });
  });

  describe('with server error', () => {
    it('post method: should return correct error message with status 500', async () => {
      const { body, statusCode } = await testServer.post('/api/users').send(JSON.stringify('test'));

      expect(statusCode).toStrictEqual(500);
      expect(body).toStrictEqual('Server error');
    });
  });
});