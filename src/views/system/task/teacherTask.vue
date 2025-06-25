<template>
  <div class="_task">
      <div class="search-table">
        <div class="search">
            <el-row :gutter="10" style="padding:10px">
                <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                    <span class="search-title">课程名称:</span>
                    <el-input
                        style="margin-top:10px"
                        size="mini"
                        placeholder="请输入课程名称"
                        v-model="search.name">
                    </el-input>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                    <span class="search-title">所属专业:</span>
                    <el-select clearable style="margin-top:10px" size="mini" v-model="search.major" placeholder="请选择">
                      <el-option v-for="(item,index) in major" :key="index"
                        :label="item.name"
                        :value="item.name">
                      </el-option>
                    </el-select>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                    <span class="search-title">所属分类:</span>
                    <el-select clearable style="margin-top:10px" size="mini" v-model="search.classification" placeholder="请选择">
                      <el-option v-for="(item,index) in classification" :key="index"
                        :label="item.name"
                        :value="item.name">
                      </el-option>
                    </el-select>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                    <el-button style="margin-top:10px" size="mini" icon="el-icon-search" type="primary" @click="searchPage">查询</el-button>
                    <el-button style="margin-top:10px" size="mini" icon="el-icon-refresh" @click="refresh">重置</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="table">
            <el-row style="padding-top:10px;margin-left:10px">
                <el-button type="primary" size="mini" icon="el-icon-plus" plain @click="add">新增</el-button>
                <el-button type="success" :disabled="update.length != 1 ?true:false" size="mini" icon="el-icon-edit" plain @click="updateDataBtn">修改</el-button>
                <el-button type="danger" :disabled="update.length <= 0 ?true:false" size="mini" icon="el-icon-delete" plain @click="deleteDataBtn">删除</el-button>
            </el-row>
            <el-table
            v-loading="loading"
            :data="tableData"
            :header-cell-style="{
              'color': '#4A2B90',
              'background-color': '#ECE9F4',
            }"
            :row-style="{
              'color': '#888897',
              'font-size': '15px',
              'font-family':'黑体',
              'white-space': 'nowrap'
            }"
            @selection-change="handleSelectionChange"
            stripe
            style="width: 100%">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop="name"
              label="课程名称"
              width="100"
              >
            </el-table-column>
            <el-table-column
              prop="major"
              label="所属专业"
              width="100"
              >
            </el-table-column>
            <el-table-column
              prop="classification"
              label="所属分类"
              width="80"
              >
            </el-table-column>
            <el-table-column
              prop="teacherName"
              label="教师名称"
              width="80"
              >
            </el-table-column>
            <el-table-column
              prop="state"
              label="状态"
              width="80"
              >
              <template slot-scope="scope">
                  <el-tag v-if="scope.row.state == 0" type="success">已上架</el-tag>
                  <el-tag v-if="scope.row.state == 1" type="warning">已下架</el-tag>
                  <el-tag v-if="scope.row.state == 2" type="warning">待审核</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="num"
              label="学生数量"
              width="100"
              >
            </el-table-column>
            <el-table-column
              label="操作"
              >
              <template slot-scope="scope">
                <el-button size="mini" type="warning" @click="toTaskComment(scope.row.id)">评论</el-button>
                <el-button size="mini" type="success" @click="toTaskStudent(scope.row.id)">学生</el-button>
                <el-button size="mini" type="primary" @click="toTaskStudy(scope.row.id)">学习情况</el-button>
                <el-button size="mini" type="info" @click="toChapter(scope.row.id,scope.row.name)">章节</el-button>
                <el-button size="mini" type="warning" @click="toArticle(scope.row.id,scope.row.name)">笔记</el-button>
                <el-button size="mini" type="success" @click="updateData(scope.row.id)">修改</el-button>
                <el-popconfirm
                  style="margin-left:5px"
                  confirm-button-text='确认'
                  cancel-button-text='取消'
                  icon="el-icon-info"
                  icon-color="red"
                  title="确认删除选中的数据？"
                  @confirm="deleteDate(scope.row.id)"
                >
                  <el-button size="mini" slot="reference" type="danger">删除</el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="search.pageSize"
            :current-page="search.pageNumber"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :total="total">
          </el-pagination>
          </div>
        </div>
      <add @addFalse="addFalse" flag="2" :addVisible = "addVisible"></add>
      <update @updateFalse="updateFalse" flag="2" :updateId = "updateId" :updateVisible = "updateVisible"></update>
    </div>
  </div>
</template>

<script>
  import {getApeTaskPage,removeApeTask,getApeClassificationList,getApeMajorList,editApeTask} from '../../../api/api' 
  import add from '../../../components/system/task/addTask'
  import update from '../../../components/system/task/updateTask'
  export default {
    data() {
      return{
        loading: true,
        update: [],
        remove: [],
        updateId: "",
        addVisible: false,
        updateVisible: false,
        search: {
            name: "",
            taskDescribe: "",
            teacherName: "",
            state: "",
            major: "",
            classification: "",
            pageNumber: 1,
            pageSize:10,
            type: 1
        },
        total: 0,
        tableData: [],
        major: [],
        classification: []
      }
    },
    components: {
      add,
      update
    },
    methods: {
      toTaskStudy(id) {
        var param = {
            "name": "学习情况",
            "url": "/studyInfo?id=" + id
        }
        this.$store.commit('menu/addActiveMenu', param)
        this.$router.push("/studyInfo?id=" + id)
        this.$store.commit('menu/setActiveMenu', "/studyInfo?id=" + id)
      },
      toTaskComment(id) {
        var param = {
            "name": "评论列表",
            "url": "/taskComment?id=" + id
        }
        this.$store.commit('menu/addActiveMenu', param)
        this.$router.push("/taskComment?id=" + id)
        this.$store.commit('menu/setActiveMenu', "/taskComment?id=" + id)
      },
      toTaskStudent(id) {
        var param = {
            "name": "学生列表",
            "url": "/taskStudent?id=" + id
        }
        this.$store.commit('menu/addActiveMenu', param)
        this.$router.push("/taskStudent?id=" + id)
        this.$store.commit('menu/setActiveMenu', "/taskStudent?id=" + id)
      },
      toArticle(id,name) {
        var param = {
            "name": "学生笔记管理",
            "url": "/teacherArticle?id=" + id + "&name=" + name + "&type=0"
        }
        this.$store.commit('menu/addActiveMenu', param)
        this.$router.push("/teacherArticle?id=" + id + "&name=" + name + "&type=0")
        this.$store.commit('menu/setActiveMenu', "/teacherArticle?id=" + id + "&name=" + name + "&type=0")
      },
      toChapter(id,name) {
        var param = {
            "name": "教师章节管理",
            "url": "/teacherChapter?id=" + id + "&name=" + name + "&type=0"
        }
        this.$store.commit('menu/addActiveMenu', param)
        this.$router.push("/teacherChapter?id=" + id + "&name=" + name + "&type=0")
        this.$store.commit('menu/setActiveMenu', "/teacherChapter?id=" + id + "&name=" + name + "&type=0")
      },
      listing(id) {
        var param = {
          id: id,
          state: 0
        }
        editApeTask(param).then(res => {
          if(res.code == 1000) {
            this.$notify.success({
              title: '成功',
              message: "上架成功"
            });
            this.query();
          } else {
            this.$notify.error({
              title: '错误',
              message: res.message
            });
          }
        })
      },
      offShelf(id) {
        var param = {
          id: id,
          state: 1
        }
        editApeTask(param).then(res => {
          if(res.code == 1000) {
            this.$notify.success({
              title: '成功',
              message: "下架成功"
            });
            this.query()
          } else {
            this.$notify.error({
              title: '错误',
              message: res.message
            });
          }
        })
      },
      getApeMajorList() {
        getApeMajorList().then(res => {
          if(res.code == 1000) {
            this.major = res.data
          } else {
            this.$notify.error({
              title: '错误',
              message: res.message
            });
          }
        })
      },
      getApeClassificationList() {
        getApeClassificationList().then(res => {
          if(res.code == 1000) {
            this.classification = res.data
          } else {
            this.$notify.error({
              title: '错误',
              message: res.message
            });
          }
        })
      },
      searchPage() {
        this.search.pageNumber = 1
        this.query()
      },
      query() {
        getApeTaskPage(this.search).then(res => {
          if(res.code == 1000) {
            this.tableData = res.data.records
            this.total = res.data.total
            this.loading = false
          } else {
            this.$notify.error({
              title: '错误',
              message: res.message
            });
          }
        })
      },
      refresh() {
        this.search.name = ""
        this.search.taskDescribe = ""
        this.search.teacherName = ""
        this.search.state = ""
        this.search.major = ""
        this.search.classification = ""
        this.query()
      },
      handleCurrentChange(val) {
        this.search.pageNumber = val
        this.query()
      },
      handleSizeChange(val) {
        this.search.pageSize = val
        this.query()
      },
      handleSelectionChange(val) {
        this.update = []
        this.remove = []
        for (let i = 0;i < val.length;i++) {
          var item = val[i]
          this.update.push(item.id)
          this.remove.push(item.id)
        }
      },
      add() {
        this.addVisible = true
      },
      addFalse() {
        this.addVisible = false
        this.query()
      },
      updateFalse() {
        this.updateId = ""
        this.updateVisible = false
        this.query()
      },
      updateData(id) {
        this.updateId = id
        this.updateVisible = true
      },
      updateDataBtn() {
        this.updateData(this.update[0])
      },
      deleteDataBtn() {
        this.$confirm('确定删除选中的'+ this.remove.length +'条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteDate(this.remove.join(","))
        }).catch(() => {
                 
        });
      },
      deleteDate(ids) {
        removeApeTask({ids:ids}).then(res => {
            if(res.code == 1000) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.pageNumber = 1
              this.query()
            } else {
              this.$notify.error({
                title: '错误',
                message: res.message
              });
            }
          })
      },
    },
    mounted() {
      this.getApeMajorList()
      this.getApeClassificationList()
      this.query()
    }
 }
</script>
<style   scoped>
  .search-table {
      width: 100%;
  }
  .search {
      background: #ffffff;
      border-radius: 7px;
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.1)
  }
  .table {
      background: #ffffff;
      border-radius: 7px;
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
      margin-top: 10px
  }
  .el-col {
      display: flex;
      flex-direction: row;
      align-items: center;
  }
  .search-title {
      font-family: '黑体';
      float: right;
      white-space: nowrap;
      font-size: 14px;
      margin-top:10px;
      width: 63px;
      text-align: right;
  }
  .el-table {
      padding: 10px;
  }
  .el-dialog__header {
    border-bottom: 1px solid #F4F8F9 !important;
  }
  .el-dialog {
    border-radius: 10px!important;
  }
</style>