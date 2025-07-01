<template>
  <div class="homework-management">
    <div class="search-panel">
      <el-row :gutter="15">
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <div class="search-item">
            <span class="search-title">
              <i class="el-icon-edit-outline"></i> 题目:
            </span>
            <el-input
              size="small"
              placeholder="请输入题目"
              v-model="search.title"
              @keyup.enter.native="searchPage"
              class="tech-input">
              <i slot="prefix" class="el-icon-document"></i>
            </el-input>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <div class="search-item">
            <span class="search-title">
              <i class="el-icon-s-grid"></i> 类型:
            </span>
            <el-select 
              clearable 
              size="small" 
              v-model="search.type" 
              placeholder="请选择"
              class="tech-select">
              <el-option
                label="单选"
                value="0">
                <i class="el-icon-circle-check" style="color:#67C23A; margin-right:5px"></i>
                <span>单选</span>
              </el-option>
              <el-option
                label="多选"
                value="1">
                <i class="el-icon-finished" style="color:#E6A23C; margin-right:5px"></i>
                <span>多选</span>
              </el-option>
              <el-option
                label="填空"
                value="2">
                <i class="el-icon-edit" style="color:#409EFF; margin-right:5px"></i>
                <span>填空</span>
              </el-option>
              <el-option
                label="判断"
                value="3">
                <i class="el-icon-success" style="color:#67C23A; margin-right:5px"></i>
                <span>判断</span>
              </el-option>
            </el-select>
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
          icon="el-icon-plus" 
          @click="add"
          class="action-btn add-btn">
          新增
        </el-button>
        <el-button 
          type="success" 
          :disabled="update.length !== 1" 
          size="small" 
          icon="el-icon-edit" 
          @click="updateDataBtn"
          class="action-btn edit-btn">
          修改
        </el-button>
        <el-button 
          type="danger" 
          :disabled="update.length <= 0" 
          size="small" 
          icon="el-icon-delete" 
          @click="deleteDataBtn"
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
          prop="chapterName"
          label="章节名称"
          width="180">
          <template #default="{row}">
            <div class="chapter-cell">
              <i class="el-icon-collection" style="color:#7B68EE; margin-right:8px"></i>
              <span>{{ row.chapterName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="题目"
          min-width="180">
          <template #default="{row}">
            <div class="title-cell">
              <i class="el-icon-document" style="color:#A5A4BF; margin-right:8px"></i>
              <span>{{ row.title }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="sort"
          label="序号"
          width="100"
          align="center">
          <template #default="{row}">
            <el-tag type="info" effect="plain">{{ row.sort }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="answer"
          label="答案"
          width="180">
          <template #default="{row}">
            <div class="answer-cell">
              <i class="el-icon-key" style="color:#FF9900; margin-right:8px"></i>
              <span>{{ row.answer }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="类型"
          width="120"
          align="center">
          <template #default="{row}">
            <el-tag v-if="row.type == 0" effect="dark">
              <i class="el-icon-circle-check" style="margin-right:4px"></i> 单选
            </el-tag>
            <el-tag v-if="row.type == 1" type="warning" effect="dark">
              <i class="el-icon-finished" style="margin-right:4px"></i> 多选
            </el-tag>
            <el-tag v-if="row.type == 2" type="primary" effect="dark">
              <i class="el-icon-edit" style="margin-right:4px"></i> 填空
            </el-tag>
            <el-tag v-if="row.type == 3" type="success" effect="dark">
              <i class="el-icon-success" style="margin-right:4px"></i> 判断
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="180">
          <template #default="{row}">
            <div class="time-cell">
              <i class="el-icon-time" style="color:#888897; margin-right:8px"></i>
              <span>{{ row.createTime }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="180"
          fixed="right">
          <template #default="{row}">
            <div class="action-buttons">
              <el-button 
                size="mini" 
                type="success" 
                @click="updateData(row.id)"
                class="action-btn edit-btn">
                <i class="el-icon-edit" style="margin-right:4px"></i> 修改
              </el-button>
              <el-popconfirm
                title="确认删除此题？"
                @confirm="deleteDate(row.id)"
                confirm-button-text="确认"
                cancel-button-text="取消"
                icon="el-icon-warning"
                icon-color="#7B68EE">
                <el-button 
                  size="mini"
                  type="danger"
                  slot="reference"
                  class="action-btn delete-btn">
                  <i class="el-icon-delete" style="margin-right:4px"></i> 删除
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

    <add @addFalse="addFalse" :chapterId="search.chapterId" :addVisible="addVisible"></add>
    <update @updateFalse="updateFalse" :chapterId="search.chapterId" :updateId="updateId" :updateVisible="updateVisible"></update>
  </div>
</template>

<script>
import {getApeHomeworkPage, removeApeHomework} from '../../../api/api' 
import add from '../../../components/system/homework/addHomework'
import update from '../../../components/system/homework/updateHomework'

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
          chapterId: "",
          title: "",
          type: "",
          pageNumber: 1,
          pageSize: 10
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
      this.search.pageNumber = 1;
      this.query();
    },
    query() {
      this.loading = true;
      getApeHomeworkPage(this.search).then(res => {
        if(res.code == 1000) {
          this.tableData = res.data.records;
          this.total = res.data.total;
        } else {
          this.$notify.error({
            title: '错误',
            message: res.message
          });
        }
      }).catch(error => {
        console.error("查询出错:", error);
        this.$notify.error({
          title: '错误',
          message: '查询过程中发生错误'
        });
      }).finally(() => {
        this.loading = false;
      });
    },
    refresh() {
      this.search.title = "";
      this.search.type = "";
      this.searchPage();
    },
    handleCurrentChange(val) {
      this.search.pageNumber = val;
      this.query();
    },
    handleSizeChange(val) {
      this.search.pageSize = val;
      this.query();
    },
    handleSelectionChange(val) {
      this.update = val.map(item => item.id);
      this.remove = [...this.update];
    },
    add() {
      this.addVisible = true;
    },
    addFalse() {
      this.addVisible = false;
      this.query();
    },
    updateFalse() {
      this.updateId = '';
      this.updateVisible = false;
      this.query();
    },
    updateData(id) {
      this.updateId = id;
      this.updateVisible = true;
    },
    updateDataBtn() {
      if (this.update.length === 1) {
        this.updateData(this.update[0]);
      }
    },
    deleteDataBtn() {
      if (this.remove.length > 0) {
        this.$confirm('确定删除选中的'+ this.remove.length +'条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'tech-message-box'
        }).then(() => {
          this.deleteDate(this.remove.join(","));
        }).catch(() => {});
      }
    },
    deleteDate(ids) {
      removeApeHomework({ids: ids}).then(res => {
        if(res.code == 1000) {
          this.$message({
            type: 'success',
            message: '删除成功!',
            customClass: 'tech-message'
          });
          this.search.pageNumber = 1;
          this.query();
        } else {
          this.$notify.error({
            title: '错误',
            message: res.message
          });
        }
      }).catch(error => {
        console.error("删除出错:", error);
        this.$notify.error({
          title: '错误',
          message: '删除过程中发生错误'
        });
      });
    }
  },
  mounted() {
    this.search.chapterId = this.$route.query.id;
    this.query();
  }
}
</script>

<style scoped>
.homework-management {
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

.chapter-cell, .title-cell, .answer-cell, .time-cell {
  display: flex;
  align-items: center;
}

.el-tag {
  border-radius: 12px;
  padding: 0 8px;
  height: 24px;
  line-height: 24px;
  display: inline-flex;
  align-items: center;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.action-btn {
  border-radius: 15px;
  padding: 6px 10px;
  font-size: 12px;
  min-width: 60px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.action-btn i {
  margin-right: 4px;
  font-size: 14px;
}

.action-btn.add-btn {
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

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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

.tech-select .el-input__inner {
  border-radius: 20px;
  border: 1px solid #D8D8E5;
  color: #5F4B8B;
  background-color: #F9F8FD;
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