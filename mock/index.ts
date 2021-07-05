import Mock from 'mockjs'

Mock.XHR.prototype.withCredentials = true

require('./BasicData')
