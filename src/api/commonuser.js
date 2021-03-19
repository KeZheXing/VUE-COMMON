import request from '@/utils/request'

export function getUserList(query) {
  return request({
    url: '/user/getUserList',
    method: 'get',
    params: query
  })
}

export function getDetail(data) {
  return request({
    url: '/oss/business/getDetail',
    method: 'post',
    data
  })
}

export function saveUser(data) {
  return request({
    url: '/user/addUser',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/user/editUser',
    method: 'post',
    data
  })
}


export function delone(data) {
  return request({
    url: '/user/delone',
    method: 'post',
    data
  })
}

export function getpanel(data) {
  return request({
    url: '/user/getpanel',
    method: 'post',
    data
  })
}

export function saveFile(data) {
  return request({
    url: '/oss/business/saveFile',
    method: 'post',
    data
  })
}



export function preUpload(data) {
  return request({
    url: '/oss/preUpload',
    method: 'post',
    data
  })
}


