<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.wxAccount"
        :placeholder="$t('table.name')"
        style="width: 180px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <!--      <el-select v-model="listQuery.status" :placeholder="$t('table.importance')" clearable style="width: 180px" class="filter-item">-->
      <!--        <el-option v-for="item in typelist" :key="item" :label="item" :value="item" />-->
      <!--      </el-select>-->
      <!--      <el-select v-model="listQuery.channel" :placeholder="$t('table.channel')" clearable style="width: 180px" class="filter-item">-->
      <!--        <el-option v-for="item in channellist" :key="item" :label="item" :value="item" />-->
      <!--      </el-select>-->

      <el-item class="filter-item">
        <el-date-picker
          v-model="time"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="创建日期"
          end-placeholder="结束日期"
          align="right"
        />
      </el-item>
      <!--      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">-->
      <!--        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />-->
      <!--      </el-select>-->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{
        $t('table.search') }}
      </el-button>
      <el-button v-waves class="filter-item" type="primary" @click="handleCreate">清粉生成</el-button>
      <el-button v-waves class="filter-item" type="primary" @click="handleFilter2">地推生成</el-button>
      <!--      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>-->
      <!--      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>-->
      <!--      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">{{ $t('table.reviewer') }}</el-checkbox>-->
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
      <el-table-column :label="$t('table.num')" prop="num" sortable="custom" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.num }}</span>
        </template>
      </el-table-column>

      <el-table-column label="清粉标题" prop="num" sortable="custom" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column label="清粉短链" prop="num" sortable="custom" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.shortUrl }}</span>
        </template>
      </el-table-column>



      <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">

          <el-button type="primary" icon="document" @click="delone(scope.row.id)">删除</el-button>
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
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="editfans"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >

        <el-form-item :label="$t('table.title')" prop="title">
          <el-input v-model="editfans.title" placeholder="不同内容请用; 间隔" />
        </el-form-item>

        <el-form-item label="推广内容" prop="content">
          <el-input v-model="editfans.content" />
        </el-form-item>

        <el-form-item label="公众号APPID" prop="accounts">
          <el-input v-model="editfans.accounts" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('table.confirm') }}
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
import {
  addFand,
  getExchange,
  gettype,
  pickup,
  delall,
  getchannel,
  getreset,
  reset,
  delone
} from '@/api/rabbit'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import axios from 'axios'
import ClipboardDemo from '../../clipboard'
import { Message, MessageBox } from 'element-ui'
import clip from '@/utils/clipboard' // use clipboard directly
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
      typelist: [{ 'key': undefined, 'display_name': '全部' }, {
        'key': 'true',
        'display_name': '已提取'
      }, { 'key': 'false', 'display_name': '未提取' }],
      channellist: undefined,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      time: undefined,
      listQuery: {
        isPickup: undefined,
        page: 1,
        limit: 10,
        status: undefined,
        channel: undefined,
        wxAccount: undefined,
        WxPassword: undefined,
        username: undefined,
        importance: undefined,
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
      editfans: {
        title: '',
        content: '',
        accounts: ''
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
        title: [{ required: true, message: '标题不能为空', trigger: 'blur' }]
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
    handleCopy(text) {
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
      getExchange(this.listQuery).then(res => {
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
          this.getList()
          // Just to simulate the time of the request
        })
      } catch (e) {

      } finally {
        this.listLoading = false
        this.getList()
      }
    },
    del() {
      MessageBox.confirm('删除后数据不可恢复！请谨慎操作！', {
        confirmButtonText: '立即删除',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        this.listQuery.isPickup = true
        console.log(this.listQuery)
        try {
          delall(this.listQuery).then(res => {
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
    delone(id) {
      MessageBox.confirm('删除（单条数据）后数据不可恢复！请谨慎操作！', {
        confirmButtonText: '立即删除',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        try {
          delone({ id: id }).then(res => {
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
      this.dialogStatus = 'create'
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
    createData() {
      if (this.editfans.title === undefined || this.editfans.title === '') {
        this.$notify({
          title: '输入错误',
          message: '清粉标题不能为空',
          type: 'error',
          duration: 2000
        })
      }
      addFand(this.editfans).then(res => {
        if (res.data.val === 200) {
          this.$notify({
            title: '成功',
            message: '清粉添加成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$message({
            type: 'error',
            message: res.data
          })
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
