import Mock from 'mockjs'

Mock.mock('/mock/test', {
  code: 200,
  list: [{
    holderNo: 'A02',
    holderStatus: '1',
    ferOrderNo: '0123456789',
    ferMaterialName: '物料物料',
    ferDays: '10'
  }],
  msg: 'success'
})
