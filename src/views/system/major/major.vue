<template>
  <div class="_major">
    <div class="search-table">
      <div class="search">
        <el-row :gutter="10" style="padding:10px">
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <span class="search-title">名称:</span>
            <el-input
              style="margin-top:10px"
              size="mini"
              placeholder="请输入名称"
              v-model="search.name"
              class="purple-input">
              <i slot="prefix" class="el-icon-search el-input__icon"></i>
            </el-input>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-button style="margin-top:10px" size="mini" icon="el-icon-search" type="primary" @click="searchPage" class="search-btn">查询</el-button>
            <el-button style="margin-top:10px" size="mini" icon="el-icon-refresh" @click="refresh" class="reset-btn">重置</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="table">
        <el-row style="padding-top:10px;margin-left:10px">
          <el-button type="primary" size="mini" icon="el-icon-plus" plain @click="add" class="action-btn add-btn">新增</el-button>
          <el-button type="success" :disabled="update.length != 1 ?true:false" size="mini" icon="el-icon-edit" plain @click="updateDataBtn" class="action-btn edit-btn">修改</el-button>
          <el-button type="danger" :disabled="update.length <= 0 ?true:false" size="mini" icon="el-icon-delete" plain @click="deleteDataBtn" class="action-btn delete-btn">删除</el-button>
        </el-row>
        <el-table
          v-loading="loading"
          :data="tableData"
          :header-cell-style="{
            'color': '#4A2B90',
            'background-color': '#ECE9F4',
            'font-weight': 'bold',
            'font-size': '14px'
          }"
          :row-style="{
            'color': '#6A5ACD',
            'font-size': '14px',
            'font-family':'Microsoft YaHei',
            'white-space': 'nowrap'
          }"
          @selection-change="handleSelectionChange"
          stripe
          style="width: 100%"
          class="purple-table">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="name"
            label="名称">
          </el-table-column>
          <el-table-column
              label="操作"
              width="180">
              <template slot-scope="scope">
                <el-button 
                  size="mini" 
                  @click="updateData(scope.row.id)"
                  class="table-action-btn edit-btn">
                  修改
                </el-button>
                <el-popconfirm
                  style="margin-left:5px"
                  confirm-button-text='确认'
                  cancel-button-text='取消'
                  icon="el-icon-info"
                  icon-color="#7B68EE"
                  title="确认删除选中的数据？"
                  @confirm="deleteDate(scope.row.id)"
                >
                  <el-button 
                    size="mini" 
                    slot="reference" 
                    class="table-action-btn delete-btn">
                    删除
                  </el-button>
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
          :total="total"
          class="purple-pagination">
        </el-pagination>
      </div>
    </div>
    <add @addFalse="addFalse" :addVisible = "addVisible"></add>
    <update @updateFalse="updateFalse" :updateId = "updateId" :updateVisible = "updateVisible"></update>
  </div>
</template>

<script>
import {getApeMajorPage,removeApeMajor} from '../../../api/api' 
import add from '../../../components/system/major/addMajor'
import update from '../../../components/system/major/updateMajor'
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
          pageNumber: 1,
          pageSize:10
      },
      total: 0,
      tableData: []
    }
  },
  components: {
    add,
    update
  },
  methods: {
    searchPage() {
      this.search.pageNumber = 1
      this.query()
    },
    query() {
      getApeMajorPage(this.search).then(res => {
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
        type: 'warning',
        customClass: 'purple-message-box'
      }).then(() => {
        this.deleteDate(this.remove.join(","))
      }).catch(() => {
              
      });
    },
    deleteDate(ids) {
      removeApeMajor({ids:ids}).then(res => {
          if(res.code == 1000) {
            this.$message({
              type: 'success',
              message: '删除成功!',
              customClass: 'purple-message'
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
    this.query()
  }
}
</script>

<style scoped>
._major {
  background-color: #F8F7FC;
  padding: 15px;
}

.search-table {
  width: 100%;
}

.search {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(123, 104, 238, 0.1);
  padding: 10px;
}

.table {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(123, 104, 238, 0.1);
  margin-top: 15px;
  padding: 10px;
}

.el-col {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.search-title {
  font-family: 'Microsoft YaHei';
  float: right;
  white-space: nowrap;
  font-size: 14px;
  color: #4A2B90;
  margin-top:10px;
  width: 63px;
  text-align: right;
}

.el-table {
  padding: 10px;
  border-radius: 8px;
}

.el-dialog__header {
  border-bottom: 1px solid #F4F8F9 !important;
}

.el-dialog {
  border-radius: 10px!important;
}
</style>

<style>
/* 全局样式 */
.purple-input .el-input__inner {
  border-radius: 20px;
  border: 1px solid #D8D8E5;
  color: #6A5ACD;
}

.purple-input .el-input__inner:focus {
  border-color: #7B68EE;
  box-shadow: 0 0 0 2px rgba(123, 104, 238, 0.2);
}

.purple-input .el-input__icon {
  color: #7B68EE;
}

.search-btn {
  background: linear-gradient(135deg, #7B68EE, #9370DB);
  border: none;
  border-radius: 20px;
  color: white;
}

.search-btn:hover {
  background: linear-gradient(135deg, #6A5ACD, #7B68EE);
  box-shadow: 0 2px 8px rgba(123, 104, 238, 0.3);
}

.reset-btn {
  border-radius: 20px;
  color: #7B68EE;
  border: 1px solid #D8D8E5;
  background: #F5F5FA;
}

.reset-btn:hover {
  color: #6A5ACD;
  border-color: #C7C7D5;
  background: #EDEDF7;
}

.action-btn {
  border-radius: 20px;
  font-weight: 500;
}

.add-btn {
  background: linear-gradient(135deg, #7B68EE, #9370DB);
  color: white;
  border: none;
}

.add-btn:hover {
  background: linear-gradient(135deg, #6A5ACD, #7B68EE);
}

.edit-btn {
  color: #7B68EE;
  border-color: #7B68EE;
}

.edit-btn:hover {
  color: white;
  background: #7B68EE;
}

.delete-btn {
  color: #FF4D4F;
  border-color: #FF4D4F;
}

.delete-btn:hover {
  color: white;
  background: #FF4D4F;
}

.purple-table {
  border-radius: 8px;
  border: 1px solid #ECE9F4;
}

.purple-table .el-table__body tr:hover>td {
  background-color: #F5F2FF !important;
}

.table-btn {
  border-radius: 15px;
  padding: 5px 10px;
  font-size: 12px;
}

.purple-pagination .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #7B68EE;
  color: white;
}

.purple-pagination .el-pagination.is-background .el-pager li:not(.disabled):hover {
  color: #7B68EE;
}

.purple-message-box {
  border-radius: 10px;
}

.purple-message-box .el-message-box__title {
  color: #4A2B90;
}

.purple-message {
  border-radius: 20px;
}

.purple-message .el-message__content {
  color: #4A2B90;
}

/* 新增按钮样式 */
.table-action-btn {
  border-radius: 15px;
  padding: 5px 12px;
  font-size: 12px;
  border: none;
  color: white;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.edit-btn {
  background: linear-gradient(135deg, #7B68EE, #9370DB);
}

.edit-btn:hover {
  background: linear-gradient(135deg, #6A5ACD, #7B68EE);
  box-shadow: 0 4px 8px rgba(123, 104, 238, 0.3);
}

.delete-btn {
  background: linear-gradient(135deg, #FF6B6B, #FF8E8E);
}

.delete-btn:hover {
  background: linear-gradient(135deg, #FF5252, #FF6B6B);
  box-shadow: 0 4px 8px rgba(255, 107, 107, 0.3);
}

/* 调整操作列按钮间距 */
.el-table-column--operate .cell {
  display: flex;
  justify-content: space-around;
}
</style>