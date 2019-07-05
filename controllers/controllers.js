const Services = require('./../services/services')
const SheetsHelper = require('./../sheets')

const accessToken = "ya29.GmA8Bydaa6dLVvvsYwDFDGWgtOIc2P49td1E2kAgYFP6g3_CtfcM0gtQrprWSmnyaiN4ZhkmlaCJA93Ns_xGPHHwd8v7SJZUrOTJEA9VnHtw4qxsbajKWwE5se-n-Goa2xk"

module.exports = {

  //INDEX PAGE
  index: async (request, reply) => {
    const users = await Services.viewuser()
    return reply.response(users)
  },

  //GOOGLE LOGIN
  oauth: async function (request, reply) {
    if (!request.auth.isAuthenticated) {
      return 'Authentication failed due to: ' + request.auth.error.message;
    }
    authentication = request.auth.credentials
    console.log('Succesful google authentication.Token : ', authentication.token)
    const profile = request.auth.credentials.profile;
    request.cookieAuth.set({
      id: profile.id,
      email: profile.email,
    });
    return reply.redirect('/')
  },

  //CREATE SHEETS
  createsheets: async function (request, reply) {
    let model = {}
    var helper = new SheetsHelper(accessToken);
    var title = 'Users (' + new Date().toLocaleTimeString() + ')';
    //console.log('title: ', title)
    console.log("helper", typeof (helper))
    try {
      const sheets = await helper.createSpreadsheet(title)
      console.log(sheets)
      model = {
        id: sheets.spreadsheetId,
        sheetId: sheets.sheets[0].properties.sheetId,
        name: sheets.properties.title
      }
      try {
        model = await Services.createsheets(model)
      }
      catch (err) {
        console.log("error in creating model db : ", err)
      }
    }
    catch (err) {
      console.log("error : ", err)

    }
    const data = {
      msg: 'Spreadsheet created'
    }
    return reply.response(data)
  },

  //SYNC SHEETS
  sync: async function (request, reply) {
    const spreadsheet = await Services.findSheet(request.params.id)
    const users = await Services.viewuser()
    var helper = new SheetsHelper(accessToken);
    try {
      const sync = await helper.sync(spreadsheet.id, spreadsheet.sheetId, users)
      console.log(sync)
    }
    catch (err) {
      console.log("Error : ", err)
    }
    const data = {
      msg: 'Sync complete'
    }
    return reply.response(data)
  },

  //APPEND SHEETS
  append: async function (request, reply) {
    var helper = new SheetsHelper(accessToken);
    let range = "A1:D11"
    let values = [['user10', 'user10', 'user10', 'true']]
    try {
      const append = await helper.append(request.params.id, range, values)
      console.log(append)
    }
    catch (err) {
      console.log("Error : ", err)
    }
    const data = {
      msg: 'Append complete'
    }
    return reply.response(data)
  },

  //ADD SHEETS
  addsheet: async function (request, reply) {
    var helper = new SheetsHelper(accessToken);
    try {
      const add = await helper.addSheet(request.params.id)
      console.log(add)
    }
    catch (err) {
      console.log("error :  ", err)
    }
    const data = {
      msg: 'Sheet added'
    }
    return reply.response(data)
  },


  //LOGOUT
  logout: async (request, reply) => {
    request.cookieAuth.clear();
    return reply.redirect('/');
  },
}