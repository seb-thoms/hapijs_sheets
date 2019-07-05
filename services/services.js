const Sequelize = require('sequelize')
const Models = require('./../models/models')
const User = Models.User
const Spreadsheet = Models.Spreadsheet

module.exports = {

  //RETURN ALL USERS
  viewuser: async function () {
    const users = await User.findAll({
      attributes: ['username', 'firstName', 'lastName', 'isHost']
    })
    return users
  },

  //CREATE SPREADSHEETS
  createsheets: async function (model) {
    console.log(model)
    let success = true
    try {
      await Spreadsheet.create({
        id: model.id,
        sheetId: model.sheetId,
        name: model.name
      })
    }
    catch (err) {
      console.log(err)
      success = false
    }
    return success
  },

  //RETURN SPREADSHEET
  findSheet: async function (id) {
    const sheet = await Spreadsheet.findOne({
      where: {
        id: id
      },
      attributes: ['id', 'sheetId']
    })
    return sheet
  },
}