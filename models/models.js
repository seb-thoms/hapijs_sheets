const Sequelize = require('sequelize');

const sequelize = new Sequelize('airbnb', 'edwin', '', {
  dialect: 'postgres',
  define: {
    timestamps: false,
    freezeTableName: true
  }
})

const Model = Sequelize.Model

//MODEL DEFINITIONS
class User extends Model { }
User.init({
  username: {
    type: Sequelize.STRING,
    primaryKey: true,
    field: 'username'
  },
  firstName: {
    type: Sequelize.STRING,
    field: 'firstname'
  },
  lastName: {
    type: Sequelize.STRING,
    field: 'lastname'
  },
  isHost: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    field: 'ishost'
  }
}, {
    sequelize,
    modelName: 'users',
    //paranoid: true
  });

class Spreadsheet extends Model { }
Spreadsheet.init({
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
    field: 'id'
  },
  sheetId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    field: 'sheetid'
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'name'
  }
}, {
    sequelize,
    modelName: 'spreadsheets',

  })
module.exports.User = User
module.exports.Spreadsheet = Spreadsheet