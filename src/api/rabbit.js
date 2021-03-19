import request from '@/utils/request'

export function getExchange(query) {
  return request({
    url: '/fans/list',
    method: 'get',
    params: query
  })
}

export function pickup(query) {
  return request({
    url: '/storedata/pickupStoreData',
    method: 'get',
    params: query
  })
}

export function getout2(query) {
  return request({
    url: '/storedata/outputStoreData',
    method: 'get',
    params: query
  })
}

export function AESDECODE(query) {
  return request({
    url: '/storedata/aesdecode',
    method: 'get',
    params: query
  })
}

export function delall(query) {
  return request({
    url: '/storedata/delStoreData',
    method: 'post',
    params: query
  })
}
export function delone(query) {
  return request({
    url: '/storedata/delone',
    method: 'post',
    params: query
  })
}

export function delall2(query) {
  return request({
    url: '/user2/delall',
    method: 'post',
    params: query
  })
}
export function del(query) {
  return request({
    url: '/user/del',
    method: 'post',
    params: query
  })
}
export function del2(query) {
  return request({
    url: '/user2/del',
    method: 'post',
    params: query
  })
}

export function setsay(data) {
  return request({
    url: '/user/setsay',
    method: 'post',
    data
  })
}

export function addFand(data) {
  return request({
    url: '/fans/add',
    method: 'post',
    data
  })
}
export function getExchange2(query) {
  return request({
    url: '/fans/list',
    method: 'get',
    params: query
  })
}
export function delsay(data) {
  return request({
    url: '/user/delsay',
    method: 'post',
    data
  })
}

export function getExchange3(query) {
  return request({
    url: '/user/getsayall',
    method: 'get',
    params: query
  })
}
export function gettype(channel) {
  return request({
    url: '/user/gettype',
    method: 'get',
    params: { channel }
  })
}
export function getchannel(query) {
  return request({
    url: '/user/getchannel',
    method: 'get',
    params: query
  })
}
export function getreset(query) {
  return request({
    url: '/user/getreset',
    method: 'get',
    params: query
  })
}
export function reset(query) {
  return request({
    url: '/user/doreset',
    method: 'get',
    params: query
  })
}

export function selMessage(query) {
  return request({
    url: '/service-core/rabbit/selMessage',
    method: 'get',
    params: query
  })
}

export function getTaskInfo() {
  return request({
    url: '/member/getpanel',
    method: 'get'
  })
}
