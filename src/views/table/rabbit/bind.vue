<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.nickname"
        :placeholder="$t('table.name')"
        style="width: 180px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.bindstatus"
        :placeholder="$t('table.importance')"
        clearable
        class="filter-item"
        style="width: 180px"
      >
        <el-option v-for="item in typelist" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{
        $t('table.search') }}
      </el-button>
      <el-button v-waves class="filter-item" type="primary" @click="handleCreate">添加关联</el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column :label="$t('table.num')" prop="num" sortable="custom" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.num }}</span>
        </template>
      </el-table-column>

      <el-table-column label="用户名" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="昵称" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>

      <el-table-column label="已提取数量" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.countIsPickup }}</span>
        </template>
      </el-table-column>

      <el-table-column label="未提取数量" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.countIsNotPickup }}</span>
        </template>
      </el-table-column>
      <el-table-column label="绑定状态" min-width="80">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.status==true?"激活": "解除" }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.actions')"
        align="center"
        min-width="320"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">

          <el-button size="mini" round @click="toinvest(scope.row.bindid,scope.row.status)">{{ scope.row.status==true?"解除": "激活" }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form>
        <!--        ref="dataForm"-->
        <!--        :rules="rules"-->
        <!--        :model="temp"-->
        <!--        label-position="left"-->
        <!--        label-width="70px"-->
        <!--        style="width: 400px; margin-left:50px;"-->
        <!--      >-->

        <el-form-item :label="$t('table.username')" prop="username">
          <el-input v-model="temp.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item :label="$t('table.password')" prop="password">
          <el-input v-model="temp.password" placeholder="请输入密码" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus=='createUser'?createUser():updateBind()">{{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
    <input id="file" type="file" hidden @change="uploadfile">
  </div>
</template>

<script>
import { selbind, reducebind, del, disable, createbind, createAgent, updateByp,updateBind } from '@/api/member'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import axios from 'axios'
import ClipboardDemo from '../../clipboard'
import { Message, MessageBox } from 'element-ui'
import clip from '@/utils/clipboard'
import checkPermission from '@/utils/permission' // 权限判断函数
const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination, ClipboardDemo },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      reset: '读取中',
      fileList: [],
      typelist: [{ 'key': undefined, 'display_name': '全部' }, { 'key': true, 'display_name': '激活状态' }, {
        'key': false,
        'display_name': '解除状态'
      }],
      channellist: undefined,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      time: undefined,
      listQuery: {
        userType: undefined,
        isPickup: undefined,
        page: 1,
        limit: 10,
        status: undefined,
        channel: undefined,
        wxAccount: undefined,
        username: undefined,
        importance: undefined,
        nickname: undefined,
        name: undefined,
        type: undefined,
        sort: '+id',
        time: [],
        startTime: undefined,
        endTime: undefined
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published',
        username: undefined,
        password: undefined,
        nickname: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  watch: {
    time(value) {
      console.log(value)
      if (value == undefined) {
        this.listQuery.startTime = undefined
        this.listQuery.endTime = undefined
      } else {
        this.listQuery.startTime = value[0]
        this.listQuery.endTime = value[1]
      }
    }
  },
  created() {
    // this.getreset()
    // this.getchannel()
    // this.gettype()
    this.getList()
  },
  methods: {

    checkPermission,

    createUser() {
      if (this.temp.username == undefined || this.temp.username.trim().length == 0) {
        this.$notify.error({
          title: '错误',
          message: '登陆名不能为空'
        })
        return
      }
      if (this.temp.password == undefined || this.temp.password.trim().length == 0) {
        this.$notify.error({
          title: '错误',
          message: '登陆密码不能为空'
        })
        return
      }

      if (this.temp.username == undefined || this.temp.username.trim().length == 0) {
        this.$notify.error({
          title: '错误',
          message: '登陆名不能为空'
        })
        return
      }
      createbind(this.temp).then(response => {
        this.$notify({
          title: '成功',
          message: '添加关联用户',
          type: 'success'
        })
      })
    },

    updateBind() {
      if (this.temp.username == undefined || this.temp.username.trim().length == 0) {
        this.$notify.error({
          title: '错误',
          message: '登陆名不能为空'
        })
        return
      }
      if (this.temp.password == undefined || this.temp.password.trim().length == 0) {
        this.$notify.error({
          title: '错误',
          message: '登陆密码不能为空'
        })
        return
      }

      updateBind(this.temp).then(response => {
        this.$notify({
          title: '成功',
          message: '激活关联成功',
          type: 'success'
        })
      })
    },

    createAgent() {
      if (this.temp.username == undefined || this.temp.username.trim().length == 0) {
        this.$notify.error({
          title: '错误',
          message: '登陆名不能为空'
        })
        return
      }
      if (this.temp.password == undefined || this.temp.password.trim().length == 0) {
        this.$notify.error({
          title: '错误',
          message: '登陆密码不能为空'
        })
        return
      }
      if (this.temp.nickname == undefined || this.temp.nickname.trim().length == 0) {
        this.$notify.error({
          title: '错误',
          message: '用户昵称不能为空'
        })
        return
      }
      createAgent(this.temp).then(response => {
        this.$notify({
          title: '成功',
          message: '添加新的代理用户',
          type: 'success'
        })
      })
    },
    toinvest(userId, status) {
      if (status == false) {
        this.resetTemp()
        this.dialogStatus = 'updateBind'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
        return
      }

      MessageBox.confirm('解除关联同时解除数据关联', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        reducebind({ id: userId }).then(res => {
          this.$notify({
            title: '成功',
            message: '解除绑定成功',
            type: 'success'
          })
          this.getList()
        })
      })
    },
    updateByp(userId) {
      this.$prompt('请输入新密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputErrorMessage: '新密码输入成功'
      }).then(({ value }) => {
        updateByp({ id: userId, newpwd: value }).then(res => {
          this.$notify({
            title: '成功',
            message: '密码修改成功',
            type: 'success'
          })
          this.getList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    handleCopy(text, event) {
      this.$notify({
        title: '成功',
        message: '微信数据已成功加入剪切板',
        type: 'success'
      })
      clip(text, event)
    },
    uploadfile() {
      var fileObj = document.getElementById('file').files[0]
      // // FormData 对象
      console.log(this.fileList)
      var form = new FormData()
      // 文件对象

      form.append('file', fileObj)
      axios({
        method: 'post',
        url: 'http://localhost:8080/api/user/save',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: form
      }).then(res => {
        if (res.data.val === 200) {
          MessageBox.confirm('上传完成,' + JSON.stringify(res.data.data), {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'success'
          }).then(() => {
          })

          // this.$message({
          //   type: 'success',
          //   message: res.data
          // })
          this.attachMentCode = res.data.data.attachmentCode// 附件编码
          this.attachmentId = res.data.data.attachmentId// 标志
          this.gettype()
          this.getchannel()
        } else {
          this.$message({
            type: 'error',
            message: res.data
          })
        }
      })
    },
    gettype() {
      this.listLoading = true
      gettype(this.listQuery.channel).then(response => {
        var data = response.data.data
        this.listLoading = false
        this.typelist = data
        // Just to simulate the time of the request
      })
    },
    getchannel() {
      this.listLoading = true
      getchannel().then(response => {
        var data = response.data.data
        this.listLoading = false
        this.channellist = data
        // Just to simulate the time of the request
      })
    },
    doreset() {
      this.listLoading = true
      reset({ key: 'reset' }).then(response => {
        var data = response.data.data
        this.listLoading = false
        this.getreset()
        // Just to simulate the time of the request
      })
    },
    getreset() {
      this.listLoading = true
      getreset({ key: 'reset' }).then(response => {
        var data = response.data.data
        this.listLoading = false
        this.reset = data == 0 ? '已关闭' : '已开启'
        // Just to simulate the time of the request
      })
    },
    getList() {
      this.listLoading = true
      selbind(this.listQuery).then(res => {
        var data = res.data.data
        this.listLoading = false
        for (var i = 0; i < data.records.length; i++) {
          data.records[i].num = i + (data.current - 1) * 10
        }
        this.list = data.records
        this.total = data.total
        this.listQuery.page = data.current
        // Just to simulate the time of the request
        // this.gettype()
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    showInput() {
      document.getElementById('file').click()
    },
    handleFilter2() {
      this.listLoading = true
      getout(this.listQuery).then(response => {
        var data = response.data.data
        this.listLoading = false
        // 定义文件内容，类型必须为Blob 否则createObjectURL会报错
        const content = new Blob([data])
        // 生成url对象
        const urlObject = window.URL || window.webkitURL || window
        const url = urlObject.createObjectURL(content)
        // 生成<a></a>DOM元素
        const el = document.createElement('a')
        // 链接赋值
        el.href = url
        el.download = 'todo文件导出.txt'
        // 必须点击否则不会下载
        el.click()
        // 移除链接释放资源
        urlObject.revokeObjectURL(url)
        // Just to simulate the time of the request
      })
    },
    handleFilter3() {
      this.listLoading = true
      try {
        pickup(this.listQuery).then(response => {
          var data = response.data.data
          this.listLoading = false
          // 定义文件内容，类型必须为Blob 否则createObjectURL会报错
          const content = new Blob([data])
          // 生成url对象
          const urlObject = window.URL || window.webkitURL || window
          const url = urlObject.createObjectURL(content)
          // 生成<a></a>DOM元素
          const el = document.createElement('a')
          // 链接赋值
          el.href = url
          el.download = 'todo文件导出.txt'
          // 必须点击否则不会下载
          el.click()
          // 移除链接释放资源
          urlObject.revokeObjectURL(url)
          // Just to simulate the time of the request
        })
      } catch (e) {

      } finally {
        this.listLoading = false
        this.getList()
      }
    },
    del(userId) {
      MessageBox.confirm('删除后数据不可恢复！请谨慎操作！', {
        confirmButtonText: '立即删除',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        try {
          del({ id: userId }).then(res => {
            if (res.data.val === 200) {
              MessageBox.confirm('删除完成,' + JSON.stringify(res.data.data), {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'success'
              }).then(() => {
                this.listLoading = false
                this.getList()
              })
            } else {
              this.$message({
                type: 'error',
                message: res.data
              })
            }
          })
        } catch (e) {

        } finally {
          this.listQuery.isPickup = undefined
          this.getList()
        }
      })
    },
    disable(userId) {
      MessageBox.confirm('禁用后用户将失去部分功能！请谨慎操作！', {
        confirmButtonText: '立即禁用',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        try {
          disable({ id: userId }).then(res => {
            if (res.data.val === 200) {
              MessageBox.confirm('禁用成功', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'success'
              }).then(() => {
                this.listLoading = false
                this.getList()
              })
            } else {
              this.$message({
                type: 'error',
                message: res.data
              })
            }
          })
        } catch (e) {

        } finally {
          this.listQuery.isPickup = undefined
          this.getList()
        }
      })
    },
    delall() {
      MessageBox.confirm('全部删除后数据不可恢复！请谨慎操作！', {
        confirmButtonText: '全部删除！',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        this.listLoading = true
        delall(this.listQuery).then(res => {
          if (res.data.val === 200) {
            MessageBox.confirm('全部删除完成,' + JSON.stringify(res.data.data), {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'success'
            }).then(() => {
              this.listLoading = false
              this.getList()
            })
          } else {
            this.$message({
              type: 'error',
              message: res.data
            })
          }
        })
      })
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'createUser'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCreate2() {
      this.resetTemp()
      this.dialogStatus = 'createAgenr'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          // updateArticle(tempData).then(() => {
          //   for (const v of this.list) {
          //     if (v.id === this.temp.id) {
          //       const index = this.list.indexOf(v)
          //       this.list.splice(index, 1, this.temp)
          //       break
          //     }
          //   }
          //   this.dialogFormVisible = false
          //   this.$notify({
          //     title: '成功',
          //     message: '更新成功',
          //     type: 'success',
          //     duration: 2000
          //   })
          // })
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      // fetchPv(pv).then(response => {
      //   this.pvData = response.data.pvData
      //   this.dialogPvVisible = true
      // })
    },
    handleDownload() {
      this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
          const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'table-list'
          })
          this.downloadLoading = false
        })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
