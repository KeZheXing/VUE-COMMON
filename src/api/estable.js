import request from '@/utils/request'

export function getzone(query) {
  return request({
    url: '/service-core/crawler/selZone',
    method: 'get',
    params: query
  })
}
export function selpoi(query) {
  return request({
    url: '/service-core/crawler/selPoi',
    method: 'get',
    params: query
  })
}
export function crawlerPoi(data) {
  return request({
    url: '/service-core/crawler/crawlerPoi',
    method: 'post',
    data
  })
}

export function dataAnalysis(data) {
  return request({
    url: '/service-core/crawler/dataAnalysis',
    method: 'post',
    data
  })
}
export function workCloudAnalysis(data) {
  return request({
    url: '/service-core/crawler/workCloudAnalysis',
    method: 'post',
    data
  })
}
