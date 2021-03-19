<template>
  <div style="height:100%">
    <el-container style="height:100%">
      <el-header>Header</el-header>
      <el-main style="height:100%">
        <div class="image-preview">
          <div v-show="src!=''" class="image-preview-wrapper">
            <img style="height: 15rem;width: 15rem" :src="src">
          </div>
        </div>
        <el-button :disabled="alterDisable" @click="loginVx">{{ alter }}</el-button>
      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </div>
</template>

<script>
// import openWindow from '@/utils/openWindow'
import {
  geterCode,checkStatus
} from '@/api/vx'

export default {
  name: 'SocialSignin',
  data() {
    return {
      alter: '微信登陆',
      alterDisable: false,
      rc: '',
      src: ''
    }
  },
  created() {
    this.rc = this.uuid()
    console.log('生成随机编码' + this.rc)
  },
  methods: {
    wechatHandleClick(thirdpart) {
      alert('ok')
      // this.$store.commit('SET_AUTH_TYPE', thirdpart)
      // const appid = 'xxxxx'
      // const redirect_uri = encodeURIComponent('xxx/redirect?redirect=' + window.location.origin + '/auth-redirect')
      // const url = 'https://open.weixin.qq.com/connect/qrconnect?appid=' + appid + '&redirect_uri=' + redirect_uri + '&response_type=code&scope=snsapi_login#wechat_redirect'
      // openWindow(url, thirdpart, 540, 540)
    },
    tencentHandleClick(thirdpart) {
      alert('ok')
      // this.$store.commit('SET_AUTH_TYPE', thirdpart)
      // const client_id = 'xxxxx'
      // const redirect_uri = encodeURIComponent('xxx/redirect?redirect=' + window.location.origin + '/auth-redirect')
      // const url = 'https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=' + client_id + '&redirect_uri=' + redirect_uri
      // openWindow(url, thirdpart, 540, 540)
    },
    loginVx() {
      this.alter = '正在获取登陆二维码'
      this.alterDisable = true
      var that = this
      geterCode({ rc: this.rc }).then(e => {
        console.log(e.data.data)
        that.src = e.data.data
        that.alter = '等待扫码'
        setInterval(function() { that.checkStatus() }, 3000)
      }).catch(err => {
        that.alter = '信息获取失败请重试'
        this.alterDisable = false
      })
      // this.$store.commit('SET_AUTH_TYPE', thirdpart)
      // const client_id = 'xxxxx'
      // const redirect_uri = encodeURIComponent('xxx/redirect?redirect=' + window.location.origin + '/auth-redirect')
      // const url = 'https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=' + client_id + '&redirect_uri=' + redirect_uri
      // openWindow(url, thirdpart, 540, 540)
    },
    checkStatus() {
      var that=this
      checkStatus({ rc: this.rc }).then(e => {
        that.alter = e.data.data.data
      })
    },
    uuid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0
        var v = c == 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
    }
  }
}
</script>
<style>
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>
