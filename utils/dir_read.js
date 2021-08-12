const fs = require('fs')
/**
 * modules目录读取
 * @param {string} dirPath
 * @returns Promise
 */
module.exports.dirRead = async (dirPath) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, 'utf8', (error, data) => {
      if (error) {
        reject(error)
      } else {
        resolve(data)
      }
    })
  })
}
