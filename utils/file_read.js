const fs = require('fs')
const JSON5 = require('json5')
const path = require('path')
/**
 * json5文件读取
 * @param {string} filePath
 * @returns Promise
 */
module.exports.fileRead = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (error, data) => {
      if (error) {
        reject(error)
      } else {
        resolve(JSON5.parse(data))
      }
    })
  })
}
/**
 * modules目录文件读取
 * @param {Array} fileListPath
 * @returns Promise
 */
module.exports.fileListRead = async (fileListPath) => {
  const totalList = Object.create(null)
  for (const pt of fileListPath) {
    const totalPath = path.join(__dirname, '../modules/' + pt)
    const result = await this.fileRead(totalPath)
    Object.assign(totalList, result)
  }
  return totalList
}
