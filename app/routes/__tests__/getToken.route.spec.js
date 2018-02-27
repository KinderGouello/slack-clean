require('dotenv').config();
const getTokenRoute = require('../getToken.route');
const api = require('../../utils/api');
const db = require('../../utils/db');

jest.mock('../../utils/api');
jest.mock('../../utils/db');

describe('/get-token', () => {
  it('should save user token and return ok message', async () => {
    const response = { end: jest.fn() };

    api.getAccessToken.mockImplementation(() => ({
      user_id: 'USER_ID',
      access_token: 'user-access-token',
    }));

    db.set.mockImplementation(() => true);

    await getTokenRoute({ query: { code: 'code' } }, response);

    expect(db.set).toHaveBeenCalledWith('USER_ID', '{"token":"user-access-token"}');
    expect(response.end).toHaveBeenCalledWith('Ok merci, c’est super cool ! Tu peux maintenant lancer ta commande sur Slack et nettoyer tous tes fichiers');
  });

  it('should not save user token and return error message', async () => {
    const response = { end: jest.fn() };

    api.getAccessToken.mockImplementation(() => ({
      user_id: 'USER_ID',
      access_token: 'user-access-token',
    }));

    db.set.mockImplementation(() => false);

    await getTokenRoute({ query: { code: 'code' } }, response);

    expect(db.set).toHaveBeenCalledWith('USER_ID', '{"token":"user-access-token"}');
    expect(response.end).toHaveBeenCalledWith('Un probleme s est produit pendant la sauvegarde du token, veuillez réessayer');
  });
});
