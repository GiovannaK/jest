const SessionController = require('./app/controllers/SessionController');
const auth = require('./app/middleware/auth');


const routes = require('express').Router();

routes.post('/sessions', SessionController.store);

routes.use(auth);

routes.get('/dashboard', (req, res) => {
  res.status(200).send();
})

module.exports = routes;