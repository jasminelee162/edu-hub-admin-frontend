<template>
  <div class="course-management">
    <div class="search-table">
      <div class="search">
        <el-row :gutter="15" style="padding:15px">
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <div class="search-item">
              <span class="tech-search-label">
                <i class="el-icon-notebook-1"></i> 课程名称:
              </span>
              <el-input
                size="small"
                placeholder="请输入课程名称"
                v-model="search.name"
                class="tech-input">
              </el-input>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <div class="search-item">
              <span class="tech-search-label">
                <i class="el-icon-office-building"></i> 所属专业:
              </span>
              <el-select 
                clearable 
                size="small" 
                v-model="search.major" 
                placeholder="请选择专业"
                class="tech-select">
                <el-option 
                  v-for="(item,index) in major" 
                  :key="index"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <div class="search-item">
              <span class="tech-search-label">
                <i class="el-icon-collection-tag"></i> 所属分类:
              </span>
              <el-select 
                clearable 
                size="small" 
                v-model="search.classification" 
                placeholder="请选择分类"
                class="tech-select">
                <el-option 
                  v-for="(item,index) in classification" 
                  :key="index"
                  :label="item.name"
                  :value="item.name">
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
                class="tech-search-btn">
                查询
              </el-button>
              <el-button 
                size="small" 
                icon="el-icon-refresh" 
                @click="refresh"
                class="tech-reset-btn">
                重置
              </el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      
      <div class="table">
        <div class="table-actions">
          <el-button 
            type="primary" 
            size="small" 
            icon="el-icon-plus" 
            @click="add"
            class="tech-action-btn tech-add-btn">
            新增课程
          </el-button>
          <el-button 
            type="success" 
            size="small" 
            icon="el-icon-edit" 
            :disabled="update.length !== 1"
            @click="updateDataBtn"
            class="tech-action-btn tech-edit-btn">
            修改
          </el-button>
          <el-button 
            type="danger" 
            size="small" 
            icon="el-icon-delete" 
            :disabled="update.length <= 0"
            @click="deleteDataBtn"
            class="tech-action-btn tech-delete-btn">
            删除
          </el-button>
        </div>
        
        <el-table
          v-loading="loading"
          :data="tableData"
          :header-cell-style="techTableHeaderStyle"
          :row-style="techTableRowStyle"
          @selection-change="handleSelectionChange"
          stripe
          style="width: 100%"
          class="tech-table">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="name" label="课程名称" width="120">
            <template #default="{row}">
              <div class="course-name">
                <i class="el-icon-notebook-2"></i>
                <span>{{ row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="major" label="所属专业" width="120">
            <template #default="{row}">
              <el-tag type="info" class="major-tag">
                {{ row.major }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="classification" label="所属分类" width="100">
            <template #default="{row}">
              <el-tag class="classification-tag">
                {{ row.classification }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="teacherName" label="教师" width="100">
            <template #default="{row}">
              <div class="teacher-info">
                <i class="el-icon-user"></i>
                <span>{{ row.teacherName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="state" label="状态" width="100">
            <template #default="{row}">
              <el-tag 
                :type="row.state === 0 ? 'success' : row.state === 1 ? 'warning' : 'info'"
                class="status-tag">
                {{ getStatusText(row.state) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="num" label="学生数" width="100">
            <template #default="{row}">
              <div class="student-count">
                <i class="el-icon-user-solid"></i>
                <span>{{ row.num }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="400">
            <template #default="{row}">
              <div class="action-buttons">
                <el-button 
                  size="mini" 
                  @click="toTaskComment(row.id)"
                  class="tech-table-btn tech-comment-btn">
                  <i class="el-icon-chat-line-square"></i> 评论
                </el-button>
                <el-button 
                  size="mini" 
                  @click="toTaskStudent(row.id)"
                  class="tech-table-btn tech-student-btn">
                  <i class="el-icon-user"></i> 学生
                </el-button>
                <el-button 
                  size="mini" 
                  @click="toTaskStudy(row.id)"
                  class="tech-table-btn tech-study-btn">
                  <i class="el-icon-data-line"></i> 学习
                </el-button>
                <el-button 
                  size="mini" 
                  @click="toChapter(row.id, row.name)"
                  class="tech-table-btn tech-chapter-btn">
                  <i class="el-icon-tickets"></i> 章节
                </el-button>
                <el-button 
                  size="mini" 
                  @click="toArticle(row.id, row.name)"
                  class="tech-table-btn tech-note-btn">
                  <i class="el-icon-edit-outline"></i> 笔记
                </el-button>
                <el-button 
                  size="mini" 
                  @click="updateData(row.id)"
                  class="tech-table-btn tech-edit-btn">
                  <i class="el-icon-edit"></i> 修改
                </el-button>
                <el-popconfirm
                  title="确定删除此课程吗？"
                  @confirm="deleteDate(row.id)">
                  <el-button 
                    size="mini" 
                    slot="reference"
                    class="tech-table-btn tech-delete-btn">
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
    </div>
    
    <add @addFalse="addFalse" flag="2" :addVisible="addVisible"></add>
    <update @updateFalse="updateFalse" flag="2" :updateId="updateId" :updateVisible="updateVisible"></update>
  </div>
</template>

<script>
import {getApeTaskPage,removeApeTask,getApeClassificationList,getApeMajorList,editApeTask} from '../../../api/api' 
import add from '../../../components/system/task/addTask'
import update from '../../../components/system/task/updateTask'

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
        name: "",
        taskDescribe: "",
        teacherName: "",
        state: "",
        major: "",
        classification: "",
        pageNumber: 1,
        pageSize: 10,
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
    getStatusText(state) {
      const statusMap = {
        0: '已上架',
        1: '已下架',
        2: '待审核'
      }
      return statusMap[state] || '未知状态'
    },
    techTableHeaderStyle() {
      return {
        'color': '#4A2B90',
        'background-color': '#ECE9F4',
        'font-weight': 'bold',
        'font-size': '14px',
        'border-bottom': '1px solid #7B68EE'
      }
    },
    techTableRowStyle() {
      return {
        'color': '#5F4B8B',
        'font-size': '14px',
        'font-family': 'Microsoft YaHei',
        'border-bottom': '1px solid #F0EEF7'
      }
    },
    // 其他方法保持不变...
    toTaskStudy(id) {
      this.navigateTo("/studyInfo?id=" + id, "学习情况")
    },
    toTaskComment(id) {
      this.navigateTo("/taskComment?id=" + id, "评论列表")
    },
    toTaskStudent(id) {
      this.navigateTo("/taskStudent?id=" + id, "学生列表")
    },
    toArticle(id, name) {
      this.navigateTo(`/teacherArticle?id=${id}&name=${name}&type=0`, "学生笔记管理")
    },
    toChapter(id, name) {
      this.navigateTo(`/teacherChapter?id=${id}&name=${name}&type=0`, "教师章节管理")
    },
    navigateTo(url, name) {
      const param = { name, url }
      this.$store.commit('menu/addActiveMenu', param)
      this.$router.push(url)
      this.$store.commit('menu/setActiveMenu', url)
    },
    // 其他原有方法保持不变...
  },
  mounted() {
    this.getApeMajorList()
    this.getApeClassificationList()
    this.query()
  }
}
</script>

<style scoped>
.course-management {
  background-color: #F8F7FC;
  padding: 20px;
  border-radius: 8px;
}

.search-table {
  width: 100%;
}

.search {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(123, 104, 238, 0.1);
  margin-bottom: 20px;
}

.search-item {
  display: flex;
  flex-direction: column;
}

.tech-search-label {
  font-family: 'Microsoft YaHei';
  font-size: 14px;
  color: #4A2B90;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
}

.tech-search-label i {
  margin-right: 6px;
}

.search-actions {
  display: flex;
  align-items: flex-end;
  height: 100%;
}

.table {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(123, 104, 238, 0.1);
  padding: 15px;
}

.table-actions {
  margin-bottom: 15px;
}

.course-name {
  display: flex;
  align-items: center;
}

.course-name i {
  color: #7B68EE;
  margin-right: 6px;
}

.teacher-info, .student-count {
  display: flex;
  align-items: center;
}

.teacher-info i, .student-count i {
  margin-right: 6px;
  color: #6A5ACD;
}

.major-tag {
  background-color: #F0EEF7;
  color: #5F4B8B;
  border: none;
}

.classification-tag {
  background-color: #E6E6FA;
  color: #4A2B90;
  border: none;
}

.status-tag {
  font-weight: 500;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
</style>

<style>
/* 全局样式 */
.tech-input .el-input__inner {
  border-radius: 20px;
  border: 1px solid #D8D8E5;
  color: #5F4B8B;
  background-color: #F9F8FD;
  transition: all 0.3s;
}

.tech-input .el-input__inner:focus {
  border-color: #7B68EE;
  box-shadow: 0 0 0 2px rgba(123, 104, 238, 0.2);
}

.tech-select .el-input__inner {
  border-radius: 20px;
  border: 1px solid #D8D8E5;
  color: #5F4B8B;
  background-color: #F9F8FD;
}

.tech-select .el-input__inner:focus {
  border-color: #7B68EE;
}

.tech-search-btn {
  background: linear-gradient(135deg, #7B68EE, #9370DB);
  border: none;
  border-radius: 20px;
  color: white;
  padding: 8px 20px;
  transition: all 0.3s;
}

.tech-search-btn:hover {
  background: linear-gradient(135deg, #6A5ACD, #7B68EE);
  box-shadow: 0 4px 8px rgba(123, 104, 238, 0.3);
  transform: translateY(-1px);
}

.tech-reset-btn {
  border-radius: 20px;
  color: #7B68EE;
  border: 1px solid #D8D8E5;
  background: #F5F5FA;
  padding: 8px 20px;
  transition: all 0.3s;
}

.tech-reset-btn:hover {
  color: #6A5ACD;
  border-color: #C7C7D5;
  background: #EDEDF7;
  transform: translateY(-1px);
}

.tech-action-btn {
  border-radius: 20px;
  padding: 8px 15px;
  transition: all 0.3s;
}

.tech-add-btn {
  background: linear-gradient(135deg, #7B68EE, #9370DB);
  color: white;
  border: none;
}

.tech-add-btn:hover {
  background: linear-gradient(135deg, #6A5ACD, #7B68EE);
  box-shadow: 0 4px 8px rgba(123, 104, 238, 0.3);
}

.tech-edit-btn {
  color: #7B68EE;
  border-color: #7B68EE;
}

.tech-edit-btn:hover {
  color: white;
  background: #7B68EE;
}

.tech-delete-btn {
  color: #FF6B6B;
  border-color: #FF6B6B;
}

.tech-delete-btn:hover {
  color: white;
  background: #FF6B6B;
}

.tech-table {
  border-radius: 8px;
  border: 1px solid #ECE9F4;
}

.tech-table .el-table__body tr:hover>td {
  background-color: #F5F2FF !important;
}

.tech-table-btn {
  border-radius: 15px;
  padding: 5px 10px;
  font-size: 12px;
  border: none;
  color: white;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
}

.tech-table-btn i {
  margin-right: 4px;
}

.tech-comment-btn {
  background: linear-gradient(135deg, #FFA500, #FF8C00);
}

.tech-student-btn {
  background: linear-gradient(135deg, #32CD32, #228B22);
}

.tech-study-btn {
  background: linear-gradient(135deg, #20B2AA, #008B8B);
}

.tech-chapter-btn {
  background: linear-gradient(135deg, #9370DB, #7B68EE);
}

.tech-note-btn {
  background: linear-gradient(135deg, #FFA07A, #FF7F50);
}

.tech-pagination .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #7B68EE;
  color: white;
  border-radius: 50%;
}

.tech-pagination .el-pagination.is-background .el-pager li:not(.disabled):hover {
  color: #7B68EE;
}
</style>