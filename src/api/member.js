import request from '@/utils/request'

export function getExchange(query) {
  return request({
    url: '/member/findMember',
    method: 'get',
    params: query
  })
}
export function selbind(query) {
  return request({
    url: '/member/selbind',
    method: 'get',
    params: query
  })
}





export function updateBind(query) {
  return request({
    url: '/member/updateBind',
    method: 'post',
    params: query
  })
}

export function reducebind(query) {
  return request({
    url: '/member/reducebind',
    method: 'post',
    params: query
  })
}
export function del(query) {
  return request({
    url: '/member/deleteMember',
    method: 'post',
    params: query
  })
}

export function updatePwd(query) {
  return request({
    url: '/member/updatePwd',
    method: 'post',
    params: query
  })
}


export function updateByp(query) {
  return request({
    url: '/member/updatePwdByP',
    method: 'post',
    params: query
  })
}

export function disable(query) {
  return request({
    url: '/member/disableMember',
    method: 'post',
    params: query
  })
}

export function invest(query) {
  return request({
    url: '/member/updateMoney',
    method: 'post',
    params: query
  })
}
export function createUser(query) {
  return request({
    url: '/member/addMember',
    method: 'post',
    params: query
  })
}
export function createChild(query) {
  return request({
    url: '/member/addChildUser',
    method: 'post',
    params: query
  })
}

export function createbind(query) {
  return request({
    url: '/member/createbind',
    method: 'post',
    params: query
  })
}
export function toBindPhone(query) {
  return request({
    url: '/member/toBindPhone',
    method: 'post',
    params: query
  })
}

export function getBindPhone(query) {
  return request({
    url: '/member/getBindPhone',
    method: 'post',
    params: query
  })
}

export function createAgent(query) {
  return request({
    url: '/member/addAgent',
    method: 'post',
    params: query
  })
}
