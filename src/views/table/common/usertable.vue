<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.username"
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

      <!--      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">-->
      <!--        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />-->
      <!--      </el-select>-->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{
        $t('table.search') }}
      </el-button>
      <el-button v-waves class="filter-item" type="primary" @click="handleCreate">添加用户</el-button>
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
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label=账号 prop="num" sortable="custom" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column label="密码" prop="num" sortable="custom" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.password }}</span>
        </template>
      </el-table-column>

      <el-table-column label="余额" prop="cost" sortable="custom" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.money }}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" prop="num" sortable="custom" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="消费金额" prop="num" sortable="custom" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.costTotal }}</span>
        </template>
      </el-table-column>

      <el-table-column label="下载次数" prop="num" sortable="custom" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.downloadCount }}</span>
        </template>
      </el-table-column>

      <el-table-column label="最后消费时间" prop="num" sortable="custom" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.lastCostTime }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" icon="document" @click="editUser(scope.row)">编辑</el-button>
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
        :model="editfans"
        label-position="left"
        label-width="70px"
        style="width: 100%; margin-left:50px;"
      >

        <el-form-item label="用户名" prop="title" style="width: 40rem" >
          <el-input :disabled="edit" style="width: 20rem" v-model="userContent.username" placeholder="用于模糊搜索" />
        </el-form-item>

        <el-form-item  label="密码"  style="width: 40rem">
          <el-input  style="width: 20rem" v-model="userContent.password" placeholder="登录密码" />
        </el-form-item>

        <el-form-item  label="余额" prop="cost" style="width: 40rem">
          <el-input  style="width: 20rem" v-model="userContent.money" placeholder="用于下载文件" />
        </el-form-item>


      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="saveFile">{{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
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
    getUserList,
    getDetail,
    saveUser,
    updateUser,
    delone,
    ossClient
  } from '@/api/commonuser'

import {
  addFand,
  gettype,
  pickup,
  delall,
  getchannel,
  getreset,
  reset,
} from '@/api/rabbit'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import axios from 'axios'
import ClipboardDemo from '../../clipboard/index'
import { Message, MessageBox } from 'element-ui'
import clip from '@/utils/clipboard' // use clipboard directly
const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]
  let OSS = require('ali-oss');
  const Base64 = require('js-base64').Base64
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
      imageList:[],
      edit:false,
      uploadFile:undefined,
      uploadFileRaw:undefined,
      upload:undefined,
      enableUpload:true,
      dialogImageUrl: '',
      dialogVisible: false,
      fileList:undefined,
      disabled: false,
      reset: '读取中',
      process:0,
      userContent:{
      },
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
        edit: '编辑',
        create: '添加'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        cost: [{ required: true, message: '请输入单次下载文件的价格', trigger: 'blur' }]
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
    saveFile(){
      var that=this
      if (this.edit==true){
        updateUser(that.userContent).then(response => {
          that.$message.success(`保存成功`);
          this.getList()
          // Just to simulate the time of the request
        })
        this.dialogFormVisible = false
      }else {
        saveUser(that.userContent).then(response => {
          that.$message.success(`保存成功`);
          this.getList()
          // Just to simulate the time of the request
        })
      }

    },
    submitUpload(file){
      file=this.uploadFileRaw
      if (file){
        console.log(file)
        var param=this.ossContent;
       var that=this
        var formData = new FormData();
        var body = JSON.stringify({
          // fileId:guid(),
          fileName: that.ossContent.fileName +"." + file.name,
          uploadTime: new Date().getTime(),
          // uploadBy:global.userId,
          path: param.dir + '/' + that.ossContent.fileName  +"." + file.name,
          // heigth: img.height,
          // width: img.width,
          isActivated: false,
          type: 'WEB'
        });
        var url = that.ossContent.callbackurl
        var callbackbody = JSON.stringify({
          callbackUrl: url,
          callbackBody: body,
          callbackBodyType: "application/json",
        });
        //OSS直连参数
        self.dataParams={
          'OSSAccessKeyId':param.accessid,
          'policy':param.policy,
          'Signature':param.signature,
          'Filename':param.dir + '/' + that.ossContent.fileName  +"." +file.name,
          'key':param.dir + '/' + that.ossContent.fileName +"." + file.name,
          'callback':Base64.encode(callbackbody),
          'success_action_status':200,
          'uid':file.uid,//图片临时id(组件用)
          'oldName':file.name,//图片原名称(组件用)
        }
        var formData = new FormData();
        formData.append('OSSAccessKeyId', self.dataParams.OSSAccessKeyId);
        formData.append('policy', self.dataParams.policy);
        formData.append('Signature', self.dataParams.Signature);
        formData.append('Filename', self.dataParams.Filename);
        formData.append('key', self.dataParams.key);
        formData.append('callback', self.dataParams.callback);
        formData.append('success_action_status', self.dataParams.success_action_status);
        formData.append('file', that.uploadFileRaw);
        formData.append('', "Upload to OSS");
        var tempUid=self.dataParams.uid;//图片uid（组件用）
        var tempName=self.dataParams.oldName;//图片原name（组件用）
        axios({
          url: 'http://oss-common-cost.oss-cn-hangzhou.aliyuncs.com',
          method: 'post',
          data: formData,
          //上传进度
          onUploadProgress: (progressEvent) => {
            let num = progressEvent.loaded / progressEvent.total * 100 | 0;//百分比
            that.process =num
          }
        }).then(data => {
          that.enableUpload=false;
          console.log("上传成功")
        }).catch(error=>{
          console.log("上传失败")
          console.log(error)
        });
      }
    },
    checkParam(){
      if (this.uploadFile==undefined){
        this.$message.warning(`未选择或未读取到文件`);
        return false;
      }
      if (this.ossContent.costCode==undefined){
        this.$message.warning(`未输入单价`);
        return false;
      }
      if (this.ossContent.imageBase64==undefined){
        this.$message.warning(`预览图未选择`);
        return false;
      }
      if (this.ossContent.remark==undefined){
        this.$message.warning(`编号未填写`);
        return false;
      }
      return true;
    }
    ,
    preupload(){
      console.log(this.$refs.upload)
     if (!this.checkParam()){
      return;
     }
      var that = this;
      preUpload(this.ossContent).then(response => {

        that.ossContent.fileName=response.data.data.fileName
        var data = response.data.data
        this.listLoading = false
        this.typelist = data
        that.ossContent.uploadpath=response.data.data.host
        that.ossContent.accessid=response.data.data.accessid
         that.ossContent.policy=response.data.data.policy
         that.ossContent.signature=response.data.data.signature
        that.ossContent.dir=response.data.data.dir
        that.ossContent.callbackurl=response.data.data.callbackurl
        that.$refs.upload.submit();
        // Just to simulate the time of the request
      })
    },
    imageout(file){
      this.$message.warning(`预览图数量限制为1个`);
    },
    handleChangeUpload(file, fileList) {
      var that=this
      this.getBase64(file.raw).then(res => {
        that.ossContent.imageBase64=res
      });
    },
    getBase64(file) {
      return new Promise(function(resolve, reject) {
        let reader = new FileReader();
        let imgResult = "";
        reader.readAsDataURL(file);
        reader.onload = function() {
          imgResult = reader.result;
        };
        reader.onerror = function(error) {
          reject(error);
        };
        reader.onloadend = function() {
          resolve(imgResult);
        };
      });
    },
    handleprogress(e){
      console.log("上传进度")
      console.log(e)
    },
    addFile(file,fileList){
      console.log(file.raw)
      if (this.uploadFile!=file){
        this.uploadFile=file
        this.uploadFileRaw=file.raw
      }else {
        this.uploadFile=undefined
        this.uploadFileRaw=undefined
      }
      this.process=0
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
  beforeRemove(file, fileList) {
    return this.$confirm(`确定移除 ${ file.name }？`);
  },
    handleRemove(file) {
      console.log(file);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleDownload(file) {
      console.log(file);
    },
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
      getUserList(this.listQuery).then(res => {
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
    editUser(row){
      this.resetTemp()
      this.dialogStatus = 'edit'
      this.dialogFormVisible = true
      this.userContent.id=row.id;
      this.userContent.username=row.username;
      this.userContent.password=row.password;
      this.userContent.money=row.money;
      this.enableUpload=false;
      this.edit=true;

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
              MessageBox.confirm('删除完成', {
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
      this.userContent={};
      this.edit=false;
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
