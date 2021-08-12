const chalk = require('chalk')
const Mock = require('mockjs')
const path = require('path')
const chokidar = require('chokidar')
const { dirRead } = require('./utils/dir_read')
const { fileListRead } = require('./utils/file_read')
const TIMEOUT = process.env.MOCK_TIMEOUT
const mockDir = path.join(process.cwd(), 'mock')
// 清除路由stack
function clearRouteStack (app) {
  const stacks = app._router.stack
  stacks.forEach((stack, idx) => {
    const route = stack.route && stack.route.path
    if ((/^\/api\/.*$/).test(route)) {
      delete stacks[idx]
    }
  })

  app._router.stack = stacks.filter(Boolean)
  // console.log('app._router.stack111---->', app._router.stack)
}

// 清除路由缓存
function clearRoutesCache () {
  Object.keys(require.cache).forEach(i => {
    if (i.includes(mockDir)) {
      delete require.cache[require.resolve(i)]
    }
  })
}

async function initRoutes (app) {
  const dirPath = path.join(__dirname, './modules')
  try {
    // 读取modules目录下的所有文件
    const jsonFiles = await dirRead(dirPath)

    // 读取modules目录下的所有文件的内容
    const jsonTotal = await fileListRead(jsonFiles)

    for (const key in jsonTotal) {
      if (Object.hasOwnProperty.call(jsonTotal, key)) {
        const ele = jsonTotal[key]
        app.post('/api/' + key, (req, res) => {
          const resultValue = {
            code: 0,
            data: Mock.mock(ele)
          }

          setTimeout(() => {
            res.json(resultValue)
          }, TIMEOUT)
        })
      }
    }
  } catch (error) {
    console.log(chalk.red('读取modules目录下的所有文件出错---->' + error.toString()))
  }
}
module.exports = (app) => {
  initRoutes(app)
  chokidar.watch(mockDir, {
    ignored: '**/*.js',
    ignoreInitial: true
  }).on('all', (event, path) => {
    if (event === 'change' || event === 'add') {
      clearRouteStack(app)
      clearRoutesCache()
      initRoutes(app)
      console.log(chalk.redBright(`\n Mock所在文件夹发生变更，变更文件为--->${path}\n`))
    }
  })
}
