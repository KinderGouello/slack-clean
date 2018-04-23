const deleteFiles = require('../deleteFiles');
const api = require('../../utils/api');
const db = require('../../utils/db');
const axios = require('axios');

jest.mock('../../utils/api');
jest.mock('../../utils/db');
jest.mock('axios');

describe('delete files', () => {
  describe('all files are deleted', () => {
    it('should return a message', async () => {
      const req = {
        callback_id: 'delete',
        user: {
          id: 'YUIRE',
        },
        response_url: 'http://iruei.fr',
      };
      const response = { send: jest.fn() };

      db.get
        .mockImplementationOnce(() => '[{ "id": 1, "title": "File 1", "thumb_360": "http://file1.com"},{ "id": 2, "title": "File 2", "thumb_360": "http://file2.com"}]')
        .mockImplementationOnce(() => '{ "user": { "token": "user-token" }}');
      api.createClient.mockImplementation(() => ({
        deleteFile: () => ({ ok: true }),
      }));

      await deleteFiles(req, response);

      expect(db.get).toHaveBeenCalledWith(req.callback_id);
      expect(db.get).toHaveBeenCalledWith(req.user.id);
      expect(db.del).toHaveBeenCalledWith(req.callback_id);
      expect(axios.post).toHaveBeenCalledWith(req.response_url, {
        attachments: [
          {
            text: 'Le fichier "File 1" a été supprimé.\nLe fichier "File 2" a été supprimé.\n',
            color: '#3eb991',
          },
        ],
      });
    });
  });
  describe('all files aren\'t deleted', () => {
    it('should return an error message', async () => {
      const req = {
        callback_id: 'delete',
        user: {
          id: 'YUIRE',
        },
        response_url: 'http://iruei.fr',
      };
      const response = { send: jest.fn() };

      db.get
        .mockImplementationOnce(() => '[{ "id": 1, "title": "File 1", "thumb_360": "http://file1.com"},{ "id": 2, "title": "File 2", "thumb_360": "http://file2.com"}]')
        .mockImplementationOnce(() => '{ "user": { "token": "user-token" }}');
      api.createClient.mockImplementation(() => ({
        deleteFile: () => ({ ok: false }),
      }));

      await deleteFiles(req, response);

      expect(db.get).toHaveBeenCalledWith(req.callback_id);
      expect(db.get).toHaveBeenCalledWith(req.user.id);
      expect(db.del).toHaveBeenCalledWith(req.callback_id);
      expect(axios.post).toHaveBeenCalledWith(req.response_url, {
        attachments: [
          {
            text: 'Le fichier "File 1" n’a pas pu être supprimé.\nLe fichier "File 2" n’a pas pu être supprimé.\n',
            color: '#3eb991',
          },
        ],
      });
    });
  });
});
