const path = require('path')

const pages = {
  index: {
    title: '欣和-qms系统',
    entry: 'src/project/LOGIN/main.ts',
    template: 'public/index.html',
    filename: 'index.html',
    chunk: ['chunk-vendors', 'chunk-common', 'index']
  },
  qms: {
    title: '欣和-qms系统',
    entry: 'src/project/qms/main.ts',
    template: 'public/index.html',
    filename: 'qms.html',
    chunk: ['chunk-vendors', 'chunk-common', 'qms']
  },
  sample: {
    title: '欣和-qms系统',
    entry: 'src/project/sample/main.ts',
    template: 'public/index.html',
    filename: 'sample.html',
    chunk: ['chunk-vendors', 'chunk-common', 'sample']
  }
}

const configureWebpack = {
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src')
    }
  }
}

module.exports = {
  devServer: {
    disableHostCheck: true
  },
  pages,
  configureWebpack
}
