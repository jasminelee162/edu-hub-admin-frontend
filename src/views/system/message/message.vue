<template>
  <div class="message-container">
    <div class="search-table">
      <div class="search">
        <el-row :gutter="10" style="padding:10px">
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <span class="search-title">用户昵称:</span>
            <el-input
              style="margin-top:10px"
              size="mini"
              placeholder="请输入用户昵称"
              v-model="search.userName"
              class="tech-input">
              <i slot="prefix" class="el-icon-user el-input__icon"></i>
            </el-input>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <span class="search-title">提问内容:</span>
            <el-input
              style="margin-top:10px"
              size="mini"
              placeholder="请输入提问内容"
              v-model="search.content"
              class="tech-input">
              <i slot="prefix" class="el-icon-chat-dot-round el-input__icon"></i>
            </el-input>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-button style="margin-top:10px" size="mini" icon="el-icon-search" type="primary" @click="searchPage" class="tech-search-btn">查询</el-button>
            <el-button style="margin-top:10px" size="mini" icon="el-icon-refresh" @click="refresh" class="tech-reset-btn">重置</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="table">
          <!-- 操作按钮区域 - 增加底部间距 -->
          <el-row style="padding:10px 0 15px 10px; margin-bottom: 15px; border-bottom: 1px solid #F0EEF7">
            <el-button 
              type="primary" 
              size="mini" 
              icon="el-icon-edit" 
              plain 
              @click="updateDataBtn" 
              class="tech-action-btn tech-reply-btn" 
              :disabled="update.length != 1">
              回复
            </el-button>
                  <el-button 
                    type="danger" 
                    size="mini" 
                    icon="el-icon-delete" 
                    plain 
                    @click="deleteDataBtn" 
                    class="tech-action-btn tech-delete-btn" 
                    :disabled="update.length <= 0">
                    删除
            </el-button>
          </el-row>

            <!-- 表格区域 -->
            <el-table
              v-loading="loading"
              :data="tableData"
              :header-cell-style="{
                'color': '#4A2B90',
                'background-color': '#ECE9F4',
                'font-weight': 'bold',
                'font-size': '14px',
                'border-bottom': '1px solid #7B68EE'
              }"
              :row-style="{
                'color': '#5F4B8B',
                'font-size': '14px',
                'font-family':'Microsoft YaHei',
                'white-space': 'nowrap',
                'border-bottom': '1px solid #F0EEF7'
              }"
              @selection-change="handleSelectionChange"
              stripe
              style="width: 100%"
              class="tech-table">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="userName"
            label="用户昵称"
            width="150">
          </el-table-column>
          <el-table-column
            prop="content"
            label="提问内容"
            min-width="200">
          </el-table-column>
          <el-table-column
            label="回复"
            min-width="300"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div class="tech-reply-content">
                {{ scope.row.answer | truncate(50) }}
                <el-link 
                  v-if="scope.row.answer && scope.row.answer.length > 50"
                  type="primary"
                  @click="showFullReply(scope.row.answer)"
                  class="tech-view-more">
                  查看全部
                </el-link>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="180"
            fixed="right">
            <template slot-scope="scope">
              <el-button 
                size="mini" 
                @click="updateData(scope.row.id)"
                class="tech-table-btn tech-reply-btn">
                回复
              </el-button>
              <el-popconfirm
                confirm-button-text='确认'
                cancel-button-text='取消'
                icon="el-icon-info"
                icon-color="#7B68EE"
                title="确认删除这条留言？"
                @confirm="deleteDate(scope.row.id)">
                <el-button 
                  size="mini" 
                  slot="reference" 
                  class="tech-table-btn tech-delete-btn">
                  删除
                </el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页器 -->
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="search.pageSize"
          :current-page="search.pageNumber"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :total="total"
          class="tech-pagination">
        </el-pagination>
      </div>
    </div>
    <update @updateFalse="updateFalse" :updateId="updateId" :updateVisible="updateVisible"></update>
  </div>
</template>

<script>
import {getApeMessagePage,removeApeMessage} from '../../../api/api' 
import update from '../../../components/system/message/updateMessage'
export default {
  data() {
    return {
      loading: true,
      update: [],
      remove: [],
      updateId: "",
      addVisible: false,
      updateVisible: false,
      search: {
        userId: "",
        userName: "",
        content: "",
        answer: "",
        flag: 1,
        pageNumber: 1,
        pageSize:10
      },
      total: 0,
      tableData: []
    }
  },
  components: {
    update
  },
  filters: {
    truncate(value, length) {
      if (!value) return ''
      if (value.length <= length) return value
      return value.substring(0, length) + '...'
    }
  },
  methods: {
    showFullReply(content) {
      this.$alert(content, '完整回复内容', {
        confirmButtonText: '确定',
        customClass: 'tech-message-box',
        center: true
      })
    },
    searchPage() {
      this.search.pageNumber = 1
      this.query()
    },
    query() {
      getApeMessagePage(this.search).then(res => {
        if(res.code == 1000) {
          this.tableData = res.data.records
          this.total = res.data.total
          this.loading = false
        } else {
          this.$notify.error({
            title: '错误',
            message: res.message,
            customClass: 'tech-notification'
          })
        }
      })
    },
    refresh() {
      this.search.userId = ""
      this.search.userName = ""
      this.search.content = ""
      this.search.answer = ""
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
      for (let i = 0; i < val.length; i++) {
        var item = val[i]
        this.update.push(item.id)
        this.remove.push(item.id)
      }
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
        customClass: 'tech-message-box'
      }).then(() => {
        this.deleteDate(this.remove.join(","))
      }).catch(() => {})
    },
    deleteDate(ids) {
      removeApeMessage({ids:ids}).then(res => {
        if(res.code == 1000) {
          this.$message({
            type: 'success',
            message: '删除成功!',
            customClass: 'tech-message'
          })
          this.pageNumber = 1
          this.query()
        } else {
          this.$notify.error({
            title: '错误',
            message: res.message,
            customClass: 'tech-notification'
          })
        }
      })
    }
  },
  mounted() {
    this.query()
  }
}
</script>

<style scoped>
.message-container {
  background-color: #F8F7FC;
  padding: 15px;
  border-radius: 8px;
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

.tech-reply-content {
  white-space: normal;
  word-break: break-word;
  line-height: 1.6;
  color: #5F4B8B;
}
</style>

<style>
/* 全局科技感样式 */
.tech-input .el-input__inner {
  border-radius: 20px;
  border: 1px solid #D8D8E5;
  color: #6A5ACD;
  background-color: #F9F8FD;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.tech-input .el-input__inner:focus {
  border-color: #7B68EE;
  box-shadow: 0 0 0 2px rgba(123, 104, 238, 0.2);
}

.tech-input .el-input__icon {
  color: #7B68EE;
}

.tech-search-btn {
  background: linear-gradient(135deg, #7B68EE, #9370DB);
  border: none;
  border-radius: 20px;
  color: white;
  padding: 7px 15px;
  transition: all 0.3s ease;
}

.tech-search-btn:hover {
  background: linear-gradient(135deg, #6A5ACD, #7B68EE);
  box-shadow: 0 4px 12px rgba(123, 104, 238, 0.3);
  transform: translateY(-1px);
}

.tech-reset-btn {
  border-radius: 20px;
  color: #7B68EE;
  border: 1px solid #D8D8E5;
  background: #F5F5FA;
  padding: 7px 15px;
  transition: all 0.3s ease;
}

.tech-reset-btn:hover {
  color: #6A5ACD;
  border-color: #C7C7D5;
  background: #EDEDF7;
  transform: translateY(-1px);
}

.tech-action-btn {
  border-radius: 20px;
  font-weight: 500;
  padding: 7px 15px;
  transition: all 0.3s ease;
}

.tech-reply-btn {
  background: linear-gradient(135deg, #7B68EE, #9370DB);
  color: white;
  border: none;
}

.tech-reply-btn:hover {
  background: linear-gradient(135deg, #6A5ACD, #7B68EE);
  box-shadow: 0 4px 12px rgba(123, 104, 238, 0.3);
  transform: translateY(-1px);
}

.tech-delete-btn {
  background: linear-gradient(135deg, #FF6B6B, #FF8E8E);
  color: white;
  border: none;
}

.tech-delete-btn:hover {
  background: linear-gradient(135deg, #FF5252, #FF6B6B);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
  transform: translateY(-1px);
}

.tech-table {
  border-radius: 8px;
  border: 1px solid #ECE9F4;
  overflow: hidden;
}

.tech-table .el-table__body tr:hover>td {
  background-color: #F5F2FF !important;
}

.tech-table .el-table__row--striped:hover td {
  background-color: #F0ECFF !important;
}

.tech-table-btn {
  border-radius: 15px;
  padding: 5px 12px;
  font-size: 12px;
  border: none;
  color: white;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin: 2px;
}

.tech-view-more {
  font-size: 12px;
  margin-left: 8px;
}

.tech-pagination .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #7B68EE;
  color: white;
  border-radius: 50%;
}

.tech-pagination .el-pagination.is-background .el-pager li:not(.disabled):hover {
  color: #7B68EE;
}

.tech-pagination .el-pagination__jump {
  color: #5F4B8B;
}

.tech-message-box {
  border-radius: 12px;
  border: 1px solid #7B68EE;
}

.tech-message-box .el-message-box__title {
  color: #4A2B90;
  font-weight: bold;
}

.tech-message-box .el-message-box__content {
  color: #5F4B8B;
}

.tech-message {
  border-radius: 20px;
  background-color: #F5F2FF;
  border: none;
  box-shadow: 0 2px 12px 0 rgba(123, 104, 238, 0.2);
}

.tech-message .el-message__content {
  color: #4A2B90;
}

.tech-notification {
  border-radius: 8px;
  border-left: 4px solid #7B68EE;
}

/* 新增或修改的样式 */
.table {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(123, 104, 238, 0.1);
  margin-top: 15px;
  padding: 0 10px 10px; /* 调整内边距 */
}

/* 操作按钮容器样式 */
.action-bar {
  padding: 10px 0 15px 10px;
  margin-bottom: 15px;
  border-bottom: 1px solid #F0EEF7;
}

/* 表格顶部增加间距 */
.tech-table {
  margin-top: 10px;
}
</style>