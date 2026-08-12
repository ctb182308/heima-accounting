// 跨平台 dev 启动脚本：清除 ELECTRON_RUN_AS_NODE 后启动 electron-vite
const { spawn } = require('child_process')
const path = require('path')

// 清除导致问题的环境变量
delete process.env.ELECTRON_RUN_AS_NODE

// 直接用 node 执行 electron-vite 的入口 JS 文件，避免 Windows 上 spawn .cmd 的兼容问题
const entryPoint = path.resolve(__dirname, '..', 'node_modules', 'electron-vite', 'bin', 'electron-vite.js')

const child = spawn(process.execPath, [entryPoint, 'dev'], {
  stdio: 'inherit',
  env: process.env
})

child.on('exit', (code) => {
  process.exit(code)
})
