import request from '@/utils/request'

export function loginByUsername(username, password, vcode) {
  const data = 'username=' + username + '&password=' + password + '&VerificationCode=' + vcode + '&grant_type=password' + '&scope=read'
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'get'
  })
}

export function getUserInfo() {
  return request({
    url: '/user/getuserinfo',
    method: 'post'
  })
}

