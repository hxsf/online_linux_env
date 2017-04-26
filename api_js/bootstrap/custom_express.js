const express = require('express')
express.response.error = function (code, msg) {
   this.status(code).json({msg})
}
module.exports = express;
