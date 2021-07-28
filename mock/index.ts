import Mock from 'mockjs'

// Mock.XHR.prototype.withCredentials = true
Mock.XHR.prototype.__send = Mock.XHR.prototype.send
Mock.XHR.prototype.send = function (...args) {
  if (this.custom.xhr) {
    this.custom.xhr.withCredentials = this.withCredentials || false
  }
  this.__send(...args)
}

require('./BasicData')
