import Mock from 'mockjs'

const database = [
]

Mock.mock('/sample/sampling/task', 'get', function () {
  const list = [{
    inspectClassify: '来料检验',
    unSampled: database.filter(it => it.taskStatus === 'unSampled' && it.inspectClassify === '来料检验').length,
    sampling: database.filter(it => it.taskStatus === 'sampling' && it.inspectClassify === '来料检验').length,
    completed: database.filter(it => it.taskStatus === 'completed' && it.inspectClassify === '来料检验').length
  }, {
    inspectClassify: '制程检验',
    unSampled: database.filter(it => it.taskStatus === 'unSampled' && it.inspectClassify === '制程检验').length,
    sampling: database.filter(it => it.taskStatus === 'sampling' && it.inspectClassify === '制程检验').length,
    completed: database.filter(it => it.taskStatus === 'completed' && it.inspectClassify === '制程检验').length
  }, {
    inspectClassify: '生产辅助检验',
    unSampled: database.filter(it => it.taskStatus === 'unSampled' && it.inspectClassify === '生产辅助检验').length,
    sampling: database.filter(it => it.taskStatus === 'sampling' && it.inspectClassify === '生产辅助检验').length,
    completed: database.filter(it => it.taskStatus === 'completed' && it.inspectClassify === '生产辅助检验').length
  }, {
    inspectClassify: '临时检验',
    unSampled: database.filter(it => it.taskStatus === 'unSampled' && it.inspectClassify === '临时检验').length,
    sampling: database.filter(it => it.taskStatus === 'sampling' && it.inspectClassify === '临时检验').length,
    completed: database.filter(it => it.taskStatus === 'completed' && it.inspectClassify === '临时检验').length
  }]
  // database.forEach(item => {
  //   if (!list.find(it => it.inspectClassify === item.inspectClassify)) {
  //     list.push({
  //       inspectClassify: item.inspectClassify,
  //       unSampled: database.filter(it => it.taskStatus === 'unSampled' && it.inspectClassify === item.inspectClassify).length,
  //       sampling: database.filter(it => it.taskStatus === 'sampling' && it.inspectClassify === item.inspectClassify).length,
  //       completed: database.filter(it => it.taskStatus === 'completed' && it.inspectClassify === item.inspectClassify).length
  //     })
  //   }
  // })

  return Mock.mock({
    code: 200,
    list,
    msg: 'success'
  })
})
// 查询
Mock.mock('/sample/sampling/list', 'post', function (option) {
  const data = JSON.parse(option.body)

  let list = JSON.parse(JSON.stringify(database))
  if (data.inspectClassify) {
    list = list.filter(it => it.inspectClassify === data.inspectClassify)
  }

  const { current, size } = data
  const total = list.length

  return Mock.mock({
    code: 200,
    data: {
      records: list.splice((current - 1) * size, current * size),
      current: current,
      size: size,
      total
    },
    msg: 'success'
  })
})
// 新增
Mock.mock('/sample/sampling/taskAdd', 'post', function (option) {
  const data = JSON.parse(option.body)
  if (data.id) {
    const index = database.findIndex(it => it.id === data.id)
    if (index !== -1) {
      database[index] = data
    }
  } else {
    data.taskStatus = 'unSampled'
    data.sampleCode = Math.floor(Math.random() * 999999).toString()
    data.id = Math.random().toString(36).substr(3, 10) + Date.now()
    database.push(data)
  }
  return Mock.mock({
    code: 200,
    msg: 'success'
  })
})
