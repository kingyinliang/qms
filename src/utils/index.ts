import { RouteMeta, Router, RouteRecordRaw } from 'vue-router'

export interface MenuList {
  menuUrl: string;
  menuType: string;
  id: string;
  menuIcon?: string;
  menuName: string;
  list: MenuList[];
}
// eslint-disable-next-line
const importTarget = process.env.NODE_ENV !== 'local' ? (file: string) => () => import('@/project/' + file + '.vue') : (file: string) => require('@/project/' + file + '.vue').default

export function fnAddDynamicMenuRoutes (menuList: MenuList[] = [], routes: RouteRecordRaw[] = [], router: Router, mainRouter: RouteRecordRaw): void {
  let temp: MenuList[] = []
  for (let i = 0; i < menuList.length; i++) {
    if (menuList[i].list && menuList[i].list.length >= 1) {
      temp = temp.concat(menuList[i].list)
    }
    if (menuList[i].menuUrl && /\S/.test(menuList[i].menuUrl)) {
      menuList[i].menuUrl = menuList[i].menuUrl.replace(/^\//, '')
      const route: RouteRecordRaw = {
        path: '/' + menuList[i].menuUrl.replace(/\//g, '-'),
        name: menuList[i].menuUrl.replace(/\//g, '-'),
        component: {},
        meta: {
          componentName: '',
          menuId: menuList[i].id,
          title: menuList[i].menuName,
          isDynamic: true,
          isTab: true,
          iframeUrl: ''
        }
      }
      if (/^http[s]?:\/\/.*/.test(menuList[i].menuUrl)) {
        route.path = `i-${menuList[i].id}`
        route.name = `i-${menuList[i].id}`;
        (route.meta as RouteMeta).iframeUrl = menuList[i].menuUrl
      } else {
        try {
          route.component = importTarget(`${menuList[i].menuUrl}`) || null;
          (route.meta as RouteMeta).componentName = route.component.name
        } catch (e) {
          //
        }
      }
      routes.push(route)
    }
  }
  if (temp.length >= 1) {
    fnAddDynamicMenuRoutes(temp, routes, router, mainRouter)
  } else {
    mainRouter.children = mainRouter.children?.concat(routes)
    router.addRoute(mainRouter)
    sessionStorage.setItem('dynamicMenuRoutes', JSON.stringify(routes || []))
    console.log('\n')
    console.log('%c!<-------------------- ??????(??????)?????? s -------------------->', 'color:blue')
    console.log(routes)
    console.log('%c!<-------------------- ??????(??????)?????? e -------------------->', 'color:blue')
  }
}

export function isAuth (key: string): boolean {
  let authReturn = true
  if (key === '') {
    authReturn = true
  } else {
    authReturn = JSON.parse(sessionStorage.getItem('permissions') || '[]').indexOf(key) !== -1 || false
  }
  return authReturn
}

/**
 * ??????????????????
 * @param {*} data
 */
export interface MenuBbj {
  id: string;
  parentId: string;
  _level: number;
  menuOrder: number;
  deptIdList: never[];
  terminal: string;
  menuName: string;
  parentName: string;
  menuUrl: string;
  menuType: string;
  permission: string;
  menuIcon: string;
  remark: string;
  children: MenuBbj[]
}
// interface Temp {
//   [key: string]: MenuBbj
// }

export function treeDataTranslate (data: any[], id: string, pid: string): any[] {
  const res: any[] = []
  const temp: any = {}
  for (let i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i]
  }
  for (let k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]].children) {
        temp[data[k][pid]].children = []
      }
      if (!temp[data[k][pid]]._level) {
        temp[data[k][pid]]._level = 1
      }
      data[k]._level = temp[data[k][pid]]._level + 1
      temp[data[k][pid]].children.push(data[k])
    } else {
      res.push(data[k])
    }
  }
  return res
}
export interface TreeDataBbj {
  id: string;
  _level: number;
  parentId: string;
  privilegeCode: string;
  privilegeIdentity: string;
  privilegeIdentityName: string;
  privilegeName: string;
  children: TreeDataBbj[]
}

export function treeDataTranslateOfNormal (data: TreeDataBbj[]): TreeDataBbj[] {
  const res: TreeDataBbj[] = []
  const temp: {
    [key: string]: TreeDataBbj
  } = {}
  for (let i = 0; i < data.length; i++) {
    temp[data[i].id] = data[i]
  }
  for (let k = 0; k < data.length; k++) {
    if (temp[data[k].parentId] && data[k].id !== data[k].parentId) {
      if (!temp[data[k].parentId].children) {
        temp[data[k].parentId].children = []
      }
      if (!temp[data[k].parentId]._level) {
        temp[data[k].parentId]._level = 1
      }
      data[k]._level = temp[data[k].parentId]._level + 1
      temp[data[k].parentId].children.push(data[k])
      // temp[data[k].parentId].children.sort((a:TreeDataBbj, b:TreeDataBbj) => {
      //   return a.id - b.id
      // })
    } else {
      res.push(data[k])
      // res.sort((a, b) => {
      //   return a.id - b.id
      // })
    }
  }
  return res
}

/**
 * ????????????
 * @param {date} date ????????????
 * @param {string} fmt ????????????
 */
export function dateFormat (date: Date, fmt: string): string {
  const o: {
    [propName: string]: number
  } = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds()
  }
  let fmtTemp = ''
  if (/(y+)/.test(fmt)) fmtTemp = fmt.replace(RegExp.$1, String(date.getFullYear()).substr(4 - RegExp.$1.length))
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmtTemp)) {
      fmtTemp = fmtTemp.replace(RegExp.$1, RegExp.$1.length === 1 ? String(o[k]) : ('00' + o[k]).substr(String(o[k]).length))
    }
  }
  return fmtTemp
}

export function checkNum (obj:HTMLInputElement, intNum = 0, decNum = 0):string {
  let value = obj.value
  let changeValue, t1, t2
  switch (decNum) {
    case 0:
      value = value.replace(/[^\d]/g, '')// ???????????????????????????????????????????????????????????????????????????/[^\-\d]/g
      value = value.replace(/^0\d+/g, '0')// ?????????????????????'00'?????????
      if (intNum !== 0) {
        value = value.substr(0, intNum)
      }
      break
    default:
      value = value.replace(/[^\d.]/g, '')// ???????????????????????????????????????????????????????????????????????????????????????/[^\-\d.]/g
      value = value.replace(/^[^\d]/g, '')// ??????????????????????????????????????????????????????????????????????????????/^[^\-\d]/g
      value = value.replace(/\.{2}/g, '.')// ????????????????????????
      value = value.replace(/^0\d+/g, '0')
      changeValue = value.split('.')
      if (changeValue.length > 1) { // ?????????????????????????????????????????????
        if (intNum === 0) {
          t1 = changeValue[0]
        } else {
          t1 = changeValue[0].substr(0, intNum)
        }
        t2 = changeValue[1].substr(0, decNum)
        value = t1 + '.' + t2
      } else {
        if (intNum !== 0) {
          value = value.substr(0, intNum)
        }
      }
      break
  }
  if (obj.value !== value) {
    obj.value = value
  }
  return value
}

export function merge (tableData:any[], fieldName:string): number[] {
  const spanOneArr: number[] = []
  let concatOne = 0
  tableData.forEach((item, index) => {
    if (index === 0) {
      spanOneArr.push(1)
    } else if (item.materialH === '') {
      spanOneArr.push(1)
      concatOne = index
    } else if (item[fieldName] === tableData[index - 1][fieldName]) {
      spanOneArr[concatOne] += 1
      spanOneArr.push(0)
    } else {
      spanOneArr.push(1)
      concatOne = index
    }
  })
  return spanOneArr
}
