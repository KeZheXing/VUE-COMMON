import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setTokenByName(name, token) {
  return Cookies.set(name, token)
}

export function getTokenByName(name) {
  return Cookies.get(name)
}

export function removeTokenByName(name) {
  return Cookies.remove(name)
}
