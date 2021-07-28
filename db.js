const firebase = require('firebase')
firebase.initializeApp(process.env)
module.exports = firebase.database()