const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const util = require('util');

var SheetsHelper = function (accessToken) {
  var auth = new OAuth2Client();
  auth.credentials = {
    access_token: accessToken
  };
  this.service = google.sheets({ version: 'v4', auth: auth });
};

module.exports = SheetsHelper;

SheetsHelper.prototype.createSpreadsheet = function (title) {
  return new Promise((resolve, reject) => {
    var self = this;
    console.log("self", self)
    var request = {
      resource: {
        properties: {
          title: title
        },
        sheets: [
          {
            properties: {
              title: 'Data',
              gridProperties: {
                columnCount: 4,
                frozenRowCount: 1
              }
            }
          },
          // TODO: Add more sheets.
        ]
      }
    };

    self.service.spreadsheets.create(request, function (err, response) {
      // if (err) {
      //   console.log("Unauthorized:", err)
      //   return callback(err);
      // }
      //console.log('response', response)
      var spreadsheet = response.data;
      //console.log("spreadsheet: ", spreadsheet)
      // TODO: Add header rows.
      var dataSheetId = spreadsheet.sheets[0].properties.sheetId;
      var requests = [
        buildHeaderRowRequest(dataSheetId),
      ];
      var request = {
        spreadsheetId: spreadsheet.spreadsheetId,
        resource: {
          requests: requests
        }
      };
      self.service.spreadsheets.batchUpdate(request, function (err, response) {
        if (err) {
          reject(err)
        }
        resolve(spreadsheet);
      });
    });

  }
  )
}

SheetsHelper.prototype.addSheet = function (spreadsheetId) {
  return new Promise((resolve, reject) => {
    var self = this
    var requests = []
    requests.push({
      addSheet: {
        properties: {
          title: "Deposits",
          gridProperties: {
            "rowCount": 20,
            "columnCount": 12
          },
        }
      }
    })
    var request = {
      spreadsheetId: spreadsheetId,
      resource: {
        requests: requests
      }
    }
    self.service.spreadsheets.batchUpdate(request, function (err, response) {
      if (err) {
        reject(err)
      }
      resolve('Sheet added')
    })
  }
  )
}
// SheetsHelper.prototype.createSpreadsheet = function (title, callback) {
//   var self = this;
//   var request = {
//     resource: {
//       properties: {
//         title: title
//       },
//       sheets: [
//         {
//           properties: {
//             title: 'Data',
//             gridProperties: {
//               columnCount: 4,
//               frozenRowCount: 1
//             }
//           }
//         },
//         // TODO: Add more sheets.
//       ]
//     }
//   };
//   self.service.spreadsheets.create(request, function (err, response) {
//     // if (err) {
//     //   console.log("Unauthorized:", err)
//     //   return callback(err);
//     // }
//     //console.log('response', response)
//     var spreadsheet = response.data;
//     //console.log("spreadsheet: ", spreadsheet)
//     // TODO: Add header rows.
//     var dataSheetId = spreadsheet.sheets[0].properties.sheetId;
//     var requests = [
//       buildHeaderRowRequest(dataSheetId),
//     ];
//     var request = {
//       spreadsheetId: spreadsheet.spreadsheetId,
//       resource: {
//         requests: requests
//       }
//     };
//     self.service.spreadsheets.batchUpdate(request, function (err, response) {
//       if (err) {
//         return callback(err);
//       }
//       return callback(null, spreadsheet);
//     });
//   });
// };

SheetsHelper.prototype.append = function (spreadsheetId, range, values) {
  return new Promise((resolve, reject) => {
    let resource = {
      values,
    }
    this.service.spreadsheets.values.append({
      spreadsheetId: spreadsheetId,
      resource: resource,
      valueInputOption: 'RAW',
      range: range
    }, function (err, response) {
      if (err) {
        reject(err)
      }
      resolve('Appended the values')
    })
  })
}

// SheetsHelper.prototype.append = function (spreadsheetId, range, values, callback) {
//   let resource = {
//     values,
//   }
//   this.service.spreadsheets.values.append({
//     spreadsheetId: spreadsheetId,
//     resource: resource,
//     valueInputOption: 'RAW',
//     range: range
//   });

// }

SheetsHelper.prototype.sync = function (spreadsheetId, sheetId, users) {
  return new Promise((resolve, reject) => {
    var requests = [];
    // Resize the sheet.
    requests.push({
      updateSheetProperties: {
        properties: {
          sheetId: sheetId,
          gridProperties: {
            rowCount: users.length + 1,
            columnCount: COLUMNS.length
          }
        },
        fields: 'gridProperties(rowCount,columnCount)'
      }
    });
    // Set the cell values.
    requests.push({
      updateCells: {
        start: {
          sheetId: sheetId,
          rowIndex: 1,
          columnIndex: 0
        },
        rows: buildRowsForOrders(users),
        fields: '*'
      }
    });
    // Send the batchUpdate request.
    var request = {
      spreadsheetId: spreadsheetId,
      resource: {
        requests: requests
      }
    };
    this.service.spreadsheets.batchUpdate(request, function (err) {
      if (err) {
        console.log("unauthorised : ", err)
        reject(err)
      }
      resolve('Sync complete')
    });
  })
}

// SheetsHelper.prototype.sync = function (spreadsheetId, sheetId, users, callback) {
//   var requests = [];
//   // Resize the sheet.
//   requests.push({
//     updateSheetProperties: {
//       properties: {
//         sheetId: sheetId,
//         gridProperties: {
//           rowCount: users.length + 1,
//           columnCount: COLUMNS.length
//         }
//       },
//       fields: 'gridProperties(rowCount,columnCount)'
//     }
//   });
//   // Set the cell values.
//   requests.push({
//     updateCells: {
//       start: {
//         sheetId: sheetId,
//         rowIndex: 1,
//         columnIndex: 0
//       },
//       rows: buildRowsForOrders(users),
//       fields: '*'
//     }
//   });
//   // Send the batchUpdate request.
//   var request = {
//     spreadsheetId: spreadsheetId,
//     resource: {
//       requests: requests
//     }
//   };
//   this.service.spreadsheets.batchUpdate(request, function (err) {
//     // if (err) {
//     //   console.log("unauthorised : ",err)
//     //   return callback(err);
//     // }
//     return callback();
//   });
// };

var COLUMNS = [
  { field: 'username', header: 'Username' },
  { field: 'firstName', header: 'First Name' },
  { field: 'lastName', header: 'Last Name' },
  { field: 'isHost', header: 'is host' },
];

function buildHeaderRowRequest(sheetId) {
  var cells = COLUMNS.map(function (column) {
    return {
      userEnteredValue: {
        stringValue: column.header
      },
      userEnteredFormat: {
        textFormat: {
          bold: true
        }
      }
    }
  });
  return {
    updateCells: {
      start: {
        sheetId: sheetId,
        rowIndex: 0,
        columnIndex: 0
      },
      rows: [
        {
          values: cells
        }
      ],
      fields: 'userEnteredValue,userEnteredFormat.textFormat.bold'
    }
  };
}

function buildRowsForOrders(orders) {
  return orders.map(function (order) {
    var cells = COLUMNS.map(function (column) {
      switch (column.field) {
        default:
          return {
            userEnteredValue: {
              stringValue: order[column.field].toString()
            }
          };
      }
    });
    return {
      values: cells
    };
  });
}