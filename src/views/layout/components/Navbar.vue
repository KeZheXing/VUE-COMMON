<template>
  <div>
    <div class="navbar">

      <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container" />

      <breadcrumb class="breadcrumb-container" />

      <div class="right-menu">
        <template v-if="device!=='mobile'" />

        <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
          <div class="avatar-wrapper">
            <img :src="avatar" class="user-avatar">
            <i class="el-icon-caret-bottom" />
          </div>
          <el-dropdown-menu slot="dropdown">
            <router-link to="/">
              <el-dropdown-item>
                {{ $t('navbar.dashboard') }}
              </el-dropdown-item>
            </router-link>
            <el-dropdown-item divided>
              <span style="display:block;" @click="update">修改密码</span>
            </el-dropdown-item>

            <el-dropdown-item divided>
              <span class="safe" style="display:block;" @click="bindPhone">安全设置</span>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <span style="display:block;" @click="logout">{{ $t('navbar.logOut') }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <div>
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
      >
        <el-form>
          <el-form-item label="旧密码" prop="username">
            <el-input v-model="temp.password" placeholder="请输入旧密码" />
          </el-form-item>
          <el-form-item label="新密码" prop="password">
            <el-input v-model="temp.newpwd" placeholder="请输入新密码" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="updatePwdto">确 定</el-button>
        </span>
      </el-dialog>

    </div>

    <div>
      <el-dialog
        title="提示"
        :visible.sync="dialogVisiblebind"
        width="30%"
        :before-close="handleClose"
      >
        <el-form>
          <el-form-item label="绑定手机" prop="phone">
            <el-input v-model="temp.phone" placeholder="绑定手机号,绑定后登陆强制要求" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="toBindPhone()">更新绑定信息</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getExchange, invest, del, disable, createUser, createAgent, updateByp, toBindPhone, getBindPhone } from '@/api/member'
import Driver from 'driver.js' // import driver.js
import 'driver.js/dist/driver.min.css' // import driver.js css
import steps from './defineSteps'
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import LangSelect from '@/components/LangSelect'
import ThemePicker from '@/components/ThemePicker'
import Search from '@/components/HeaderSearch'
import { updatePwd } from '@/api/member'
export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    LangSelect,
    ThemePicker,
    Search
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar',
      'device'
    ])
  },
  data() {
    return {
      driver: null,
      dialogVisiblebind: false,
      temp: {
        phone: undefined,
        password: undefined,
        newpwd: undefined
      },
      dialogVisible: false
    }
  },
  mounted() {
    this.driver = new Driver({
      // 此处为api
      animate: false,
      opacity: 0.70,
      allowClose: false,
      doneBtnText: '',
      closeBtnText: '',
      nextBtnText: '',
      prevBtnText: '',

      onReset: (Element) => {
        // 这里写逻辑回调
      }
    })
    setTimeout(() => {
      // 添加延时器为了操作dom
      this.guide()
    }, 400)
  },
  created() {

  },
  methods: {
    bindPhone(row) {
      getBindPhone().then(res => {
        if (res.data.val === 200) {
          this.dialogVisiblebind = true
          this.temp.phone = res.data.data
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
        }
      })
    },
    toBindPhone() {
      toBindPhone({ phone: this.temp.phone.trim() }).then(res => {
        if (res.data.val === 200) {
          this.$message({
            type: 'success',
            message: '更新绑定信息'
          })
        }
      })
    },
    updatePwdto() {
      this.dialogVisible = false
      updatePwd(this.temp).then(response => {
        this.$notify({
          title: '成功',
          message: '密码修改成功',
          type: 'success'
        })
      })
    },
    update() {
      // this.resetTemp()
      console.log(123)
      this.dialogVisible = true
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].clearValidate()
      // })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {
        })
    },
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .navbar {
    height: 50px;
    overflow: hidden;

    .hamburger-container {
      line-height: 46px;
      height: 100%;
      float: left;
      cursor: pointer;
      transition: background .3s;

      &:hover {
        background: rgba(0, 0, 0, .025)
      }
    }

    .breadcrumb-container {
      float: left;
    }

    .errLog-container {
      display: inline-block;
      vertical-align: top;
    }

    .right-menu {
      float: right;
      height: 100%;
      line-height: 50px;

      &:focus {
        outline: none;
      }

      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: text-bottom;

        &.hover-effect {
          cursor: pointer;
          transition: background .3s;

          &:hover {
            background: rgba(0, 0, 0, .025)
          }
        }
      }

      .avatar-container {
        margin-right: 30px;

        .avatar-wrapper {
          margin-top: 5px;
          position: relative;

          .user-avatar {
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }

          .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
