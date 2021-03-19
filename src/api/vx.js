import request from '@/utils/request'

export function geterCode(query) {
  return request({
    url: '/vx/geterCode',
    method: 'get',
    params: query
  })
}

export function checkStatus(query) {
  return request({
    url: '/vx/checkStatus',
    method: 'get',
    params: query
  })
}


