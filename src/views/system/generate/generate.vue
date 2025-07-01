<template>
  <div class="gen-management">
    <div class="search-panel">
      <el-row :gutter="15">
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <div class="search-item">
            <span class="search-title">
              <i class="el-icon-s-grid"></i> 表名称:
            </span>
            <el-input
              size="small"
              placeholder="请输入表名称"
              v-model="search.tableName"
              class="tech-input">
              <i slot="prefix" class="el-icon-collection"></i>
            </el-input>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <div class="search-item">
            <span class="search-title">
              <i class="el-icon-document"></i> 表描述:
            </span>
            <el-input
              size="small"
              placeholder="请输入表描述"
              v-model="search.tableComment"
              class="tech-input">
              <i slot="prefix" class="el-icon-tickets"></i>
            </el-input>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <div class="search-item">
            <span class="search-title">
              <i class="el-icon-date"></i> 创建时间:
            </span>
            <el-date-picker 
              size="small"
              v-model="time"
              type="daterange"
              range-separator="至"
              format="yyyy-MM-dd" 
              value-format="yyyy-MM-dd" 
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              class="tech-date-picker">
            </el-date-picker>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <div class="search-actions">
            <el-button 
              size="small" 
              icon="el-icon-search" 
              type="primary" 
              @click="searchPage"
              class="search-btn">
              查询
            </el-button>
            <el-button 
              size="small" 
              icon="el-icon-refresh" 
              @click="refresh"
              class="reset-btn">
              重置
            </el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="data-panel">
      <div class="action-bar">
        <el-button 
          type="primary" 
          size="small" 
          icon="el-icon-upload2" 
          @click="addGen"
          class="action-btn import-btn">
          导入
        </el-button>
        <el-button 
          type="success" 
          size="small" 
          icon="el-icon-edit" 
          :disabled="update.length != 1"
          @click="updateGenBtn"
          class="action-btn edit-btn">
          修改
        </el-button>
        <el-button 
          type="danger" 
          size="small" 
          icon="el-icon-delete" 
          :disabled="remove.length <= 0"
          @click="deleteDateBtn"
          class="action-btn delete-btn">
          删除
        </el-button>
      </div>

      <el-table
        v-loading="loading"
        :data="tableData"
        :header-cell-style="tableHeaderStyle"
        :row-style="tableRowStyle"
        @selection-change="handleSelectionChange"
        stripe
        class="tech-table">
        <el-table-column
          type="selection"
          width="55"
          align="center">
        </el-table-column>
        <el-table-column
          prop="tableName"
          label="表名称"
          width="180">
          <template #default="{row}">
            <div class="name-cell">
              <i class="el-icon-s-grid" style="color:#7B68EE; margin-right:8px"></i>
              <span>{{ row.tableName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="tableComment"
          label="表描述"
          width="180">
          <template #default="{row}">
            <div class="comment-cell">
              <i class="el-icon-document" style="color:#9370DB; margin-right:8px"></i>
              <span>{{ row.tableComment }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="className"
          label="实体"
          width="180">
          <template #default="{row}">
            <div class="entity-cell">
              <i class="el-icon-cpu" style="color:#A5A4BF; margin-right:8px"></i>
              <span>{{ row.className }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="180">
          <template #default="{row}">
            <div class="time-cell">
              <i class="el-icon-time" style="color:#A5A4BF; margin-right:8px"></i>
              <span>{{ row.createTime }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="更新时间"
          width="180">
          <template #default="{row}">
            <div class="time-cell">
              <i class="el-icon-refresh" style="color:#A5A4BF; margin-right:8px"></i>
              <span>{{ row.updateTime }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="350">
          <template #default="{row}">
            <div class="action-buttons">
              <el-button 
                size="mini" 
                @click="previewGen(row.id)"
                class="action-btn preview-btn">
                <i class="el-icon-view"></i> 预览
              </el-button>
              <el-button 
                size="mini" 
                type="info" 
                @click="syncColumn(row.id)"
                class="action-btn sync-btn">
                <i class="el-icon-refresh-left"></i> 同步
              </el-button>
              <el-button 
                size="mini" 
                type="success" 
                @click="updateGen(row.id)"
                class="action-btn edit-btn">
                <i class="el-icon-edit"></i> 修改
              </el-button>
              <el-popconfirm
                title="确认删除此表？"
                @confirm="deleteDate(row.id)"
                confirm-button-text="确认"
                cancel-button-text="取消"
                icon="el-icon-warning"
                icon-color="#7B68EE">
                <el-button 
                  size="mini" 
                  slot="reference" 
                  class="action-btn delete-btn">
                  <i class="el-icon-delete"></i> 删除
                </el-button>
              </el-popconfirm>
            </div>
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
        class="tech-pagination">
      </el-pagination>
    </div>
    
    <add-gen @addGenFalse="addGenFalse" :addGenVisible="addGenVisible"></add-gen>
    <update-gen @updateGenFalse="updateGenFalse" :updateId="updateId" :updateGenVisible="updateGenVisible"></update-gen>
    <preview-gen @previewGenFalse="previewGenFalse" :updateId="updateId" :previewGenVisible="previewGenVisible"></preview-gen>
  </div>
</template>

<script>
  import {getGenPage,removeGen,syncTableAndColumns} from '../../../api/api' 
  import addGen from '../../../components/system/generate/addGenerate'
  import updateGen from '../../../components/system/generate/updateGenerate'
  import previewGen from '../../../components/system/generate/genPreview'
  export default {
    data() {
      return{
        loading: true,
        update: [],
        remove: [],
        updateId: "",
        addGenVisible: false,
        updateGenVisible: false,
        previewGenVisible: false,
        time: [],
        search: {
            tableName: "",
            tableComment: "",
            startTime: "",
            endTime: "",
            pageNumber: 1,
            pageSize:10
        },
        total: 0,
        tableData: []
      }
    },
    components: {
      addGen,
      updateGen,
      previewGen
    },
    methods: {
      tableHeaderStyle() {
        return {
          'color': '#4A2B90',
          'background-color': '#ECE9F4',
          'font-weight': 'bold',
          'border-bottom': '1px solid #7B68EE'
        }
      },
      tableRowStyle() {
        return {
          'color': '#5F4B8B',
          'font-size': '14px',
          'border-bottom': '1px solid #F0EEF7'
        }
      },
      searchPage() {
        this.search.pageNumber = 1
        this.query()
      },
      query() {
        if (this.time.length > 0) {
          this.search.startTime = this.time[0] + " 00:00:00"
          this.search.endTime = this.time[1] + " 23:59:59"
        }
        getGenPage(this.search).then(res => {
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
        this.search.tableName = ""
        this.search.tableComment = ""
        this.search.startTime = ""
        this.search.endTime = ""
        this.time = []
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
        this.remove = []
        this.update = []
        for (let i = 0;i < val.length;i++) {
          var item = val[i]
          this.remove.push(item.id)
          this.update.push(item.id)
        }
      },
      addGen() {
        this.addGenVisible = true
      },
      addGenFalse() {
        this.addGenVisible = false
        this.query()
      },
      updateGen(id) {
        this.updateId = id
        this.updateGenVisible = true
      },
      updateGenFalse() {
        this.updateId = ""
        this.updateGenVisible = false
        this.query()
      },
      updateGenBtn() {
        this.updateGen(this.update[0])
      },
      previewGen(id) {
        this.updateId = id
        this.previewGenVisible = true
      },
      previewGenFalse() {
        this.updateId = ""
        this.previewGenVisible = false
        this.query()
      },
      syncColumn(id) {
        syncTableAndColumns({id:id}).then(res => {
          if(res.code == 1000) {
            this.$message({
              type: 'success',
              message: '同步成功!',
              customClass: 'tech-message'
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
      deleteDateBtn() {
        this.$confirm('确定删除选中的'+ this.remove.length +'条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'tech-message-box'
        }).then(() => {
          this.deleteDate(this.remove.join(","))
        }).catch(() => {});
      },
      deleteDate(ids) {
        removeGen({ids:ids}).then(res => {
            if(res.code == 1000) {
              this.$message({
                type: 'success',
                message: '删除成功!',
                customClass: 'tech-message'
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
.gen-management {
  padding: 20px;
  background-color: #F8F7FC;
}

.search-panel {
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(123, 104, 238, 0.1);
}

.search-item {
  display: flex;
  flex-direction: column;
}

.search-title {
  font-size: 14px;
  color: #4A2B90;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
}

.search-title i {
  margin-right: 6px;
  color: #7B68EE;
}

.search-actions {
  display: flex;
  align-items: flex-end;
  height: 100%;
}

.data-panel {
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 12px rgba(123, 104, 238, 0.1);
}

.action-bar {
  padding: 10px 0 15px 10px;
  margin-bottom: 15px;
  border-bottom: 1px solid #F0EEF7;
}

.name-cell, .comment-cell, .entity-cell, .time-cell {
  display: flex;
  align-items: center;
}

.action-buttons {
  display: flex;
  gap: 5px;
}

.action-btn {
  border-radius: 15px;
  padding: 6px 10px;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.action-btn i {
  margin-right: 4px;
  font-size: 14px;
}
</style>

<style>
/* 全局样式 */
.tech-input .el-input__inner {
  border-radius: 20px;
  border: 1px solid #D8D8E5;
  color: #5F4B8B;
  background-color: #F9F8FD;
  padding-left: 30px;
}

.tech-input .el-input__prefix {
  left: 5px;
  color: #7B68EE;
}

.tech-date-picker .el-range-input {
  background-color: #F9F8FD;
}

.tech-date-picker .el-range-separator {
  color: #5F4B8B;
}

.search-btn {
  background: linear-gradient(135deg, #7B68EE, #9370DB);
  border: none;
  border-radius: 20px;
  color: white;
  padding: 7px 15px;
}

.reset-btn {
  border-radius: 20px;
  color: #7B68EE;
  border: 1px solid #D8D8E5;
  padding: 7px 15px;
}

.action-btn.import-btn {
  background: linear-gradient(135deg, #7B68EE, #9370DB);
  color: white;
  border: none;
}

.action-btn.edit-btn {
  background: linear-gradient(135deg, #67C23A, #85CE61);
  color: white;
  border: none;
}

.action-btn.delete-btn {
  background: linear-gradient(135deg, #F56C6C, #F78989);
  color: white;
  border: none;
}

.action-btn.preview-btn {
  background: linear-gradient(135deg, #409EFF, #3A8BDF);
  color: white;
  border: none;
}

.action-btn.sync-btn {
  background: linear-gradient(135deg, #909399, #A6A9AD);
  color: white;
  border: none;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.tech-table {
  border-radius: 8px;
  border: 1px solid #ECE9F4;
}

.tech-table .el-table__body tr:hover>td {
  background-color: #F5F2FF !important;
}

.tech-pagination .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #7B68EE;
  color: white;
  border-radius: 50%;
}

.tech-message-box {
  border-radius: 12px;
  border: 1px solid #7B68EE;
}

.tech-message-box .el-message-box__title {
  color: #4A2B90;
  font-weight: bold;
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

.el-popconfirm__action {
  text-align: center;
}

.el-popconfirm__action button {
  border-radius: 15px;
  padding: 6px 12px;
}

.el-popconfirm__action button:first-child {
  background: linear-gradient(135deg, #7B68EE, #9370DB);
  border: none;
  color: white;
}

.el-popconfirm__action button:last-child {
  color: #7B68EE;
  border: 1px solid #D8D8E5;
}
</style>