import request from '@/utils/request'

export function getOssList(query) {
  return request({
    url: '/oss/getList',
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


export function delone(data) {
  return request({
    url: '/oss/business/delone',
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

export function getFile(data) {
  return request({
    url: '/oss/getFile',
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


