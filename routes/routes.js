const controllers = require('./../controllers/controllers')
module.exports = [

  //INDEX PAGE
  {
    method: 'GET',
    path: '/',
    handler: controllers.index
  },

  //GOOGLE LOGIN
  {
    method: ['GET', 'POST'],
    path: '/login',
    options: {
      auth: 'google',
      handler: controllers.oauth
    }
  },

  //CREATE SPREADSHEET
  {
    method: 'GET',
    path: '/spreadsheets',
    handler: controllers.createsheets
  },

  //SYNC DATA WITH SHEET
  {
    method: 'GET',
    path: '/spreadsheets/{id}/sync',
    handler: controllers.sync

  },

  //APPEND DATA
  {
    method: 'GET',
    path: '/spreadsheets/{id}/append',
    handler: controllers.append
  },

  //ADD A NEW SHEET
  {
    method: 'GET',
    path: '/spreadsheets/{id}/add',
    handler: controllers.addsheet
  },

  //LOGOUT
  {
    method: 'GET',
    path: '/logout',
    handler: controllers.logout
  }
]