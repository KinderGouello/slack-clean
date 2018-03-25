const express = require('express');
const bodyParser = require('body-parser');

const isSlackResponse = require('./middlewares/isSlackResponse.middleware');
const isAuthenticated = require('./middlewares/isAuthenticated.middleware');
const getTokenRoute = require('./routes/getToken.route');
const activateRoute = require('./routes/activate.route');
const deleteFilesRoute = require('./routes/deleteFiles.route');

const port = process.env.PORT || 9000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/activate', activateRoute);
app.get('/get-token', isSlackResponse, getTokenRoute);
app.post('/delete-files', isAuthenticated, deleteFilesRoute);

app.listen(port, () => {
  console.log('Server listening on port :', port);
});
