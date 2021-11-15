import Mock from 'mockjs'

const database = [
]

Mock.mock('/taskSample/queryUpcomingTaskSample', 'get', function () {
  const data = {
    incoming: {
      execute: database.filter(it => it.taskStatus === 'unSampled' && it.inspectClassify === '来料检验').length,
      progressing: database.filter(it => it.taskStatus === 'sampling' && it.inspectClassify === '来料检验').length,
      completed: database.filter(it => it.taskStatus === 'completed' && it.inspectClassify === '来料检验').length
    },
    process: {
      execute: database.filter(it => it.taskStatus === 'unSampled' && it.inspectClassify === '制程检验').length,
      progressing: database.filter(it => it.taskStatus === 'sampling' && it.inspectClassify === '制程检验').length,
      completed: database.filter(it => it.taskStatus === 'completed' && it.inspectClassify === '制程检验').length
    },
    assist: {
      execute: database.filter(it => it.taskStatus === 'unSampled' && it.inspectClassify === '生产辅助检验').length,
      progressing: database.filter(it => it.taskStatus === 'sampling' && it.inspectClassify === '生产辅助检验').length,
      completed: database.filter(it => it.taskStatus === 'completed' && it.inspectClassify === '生产辅助检验').length
    },
    temp: {
      execute: database.filter(it => it.taskStatus === 'unSampled' && it.inspectClassify === '临时检验').length,
      progressing: database.filter(it => it.taskStatus === 'sampling' && it.inspectClassify === '临时检验').length,
      completed: database.filter(it => it.taskStatus === 'completed' && it.inspectClassify === '临时检验').length
    }
  }

  return Mock.mock({
    code: 200,
    data,
    msg: 'success'
  })
})
// 查询
Mock.mock('/taskSample/queryTaskSample', 'post', function (option) {
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
