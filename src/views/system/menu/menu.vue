<template>
  <div class="menu-management">
    <div class="search-panel">
      <el-row :gutter="15">
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <div class="search-item">
            <span class="search-title">
              <i class="el-icon-menu"></i> 菜单名称:
            </span>
            <el-input
                size="small"
                placeholder="请输入菜单名称"
                v-model="search.menuName"
                class="tech-input">
              <i slot="prefix" class="el-icon-edit-outline"></i>
            </el-input>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <div class="search-item">
            <span class="search-title">
              <i class="el-icon-circle-check"></i> 菜单状态:
            </span>
            <el-select
                clearable
                size="small"
                v-model="search.status"
                placeholder="请选择"
                class="tech-select">
              <el-option
                  label="正常"
                  value="0">
                <span class="status-option">
                  <i class="el-icon-success" style="color:#67C23A"></i> 正常
                </span>
              </el-option>
              <el-option
                  label="停用"
                  value="1">
                <span class="status-option">
                  <i class="el-icon-error" style="color:#F56C6C"></i> 停用
                </span>
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
                @click="query"
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
        <!--<el-button
            type="primary"
            size="small"
            icon="el-icon-plus"
            @click="addMenu"
            class="action-btn add-btn">
          新增
        </el-button>-->
        <el-button
            type="info"
            size="small"
            icon="el-icon-sort"
            @click="changeExpand"
            class="action-btn expand-btn">
          {{ expand ? '折叠' : '展开' }}
        </el-button>
      </div>

      <el-table
          v-if="refreshTable"
          v-loading="loading"
          :data="tableData"
          :header-cell-style="tableHeaderStyle"
          :row-style="tableRowStyle"
          style="width: 100%;margin-bottom: 20px;"
          row-key="id"
          :default-expand-all="expand"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          class="tech-table">
        <el-table-column
            prop="menuName"
            label="菜单名称"
            min-width="200">
          <template #default="{row}">
            <div class="name-cell">
              <i :class="row.icon || 'el-icon-document'" style="color:#7B68EE; margin-right:8px"></i>
              <span>{{ row.menuName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
            prop="icon"
            label="图标"
            width="120">
          <template #default="{row}">
            <div class="icon-cell">
              <i :class="row.icon || 'el-icon-question'" style="color:#9370DB"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column
            prop="orderNum"
            label="排序"
            width="100">
          <template #default="{row}">
            <div class="order-cell">
              <i class="el-icon-sort" style="color:#A5A4BF; margin-right:5px"></i>
              <span>{{ row.orderNum }}</span>
            </div>
          </template>
        </el-table-column>
        <!--<el-table-column
            prop="perms"
            label="权限标识"
            min-width="180">
          <template #default="{row}">
            <div class="perms-cell">
              <i class="el-icon-key" style="color:#A5A4BF; margin-right:5px"></i>
              <span>{{ row.perms || '-' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
            prop="componentUrl"
            label="组件路径"
            min-width="200">
          <template #default="{row}">
            <div class="path-cell">
              <i class="el-icon-link" style="color:#A5A4BF; margin-right:5px"></i>
              <span>{{ row.componentUrl || '-' }}</span>
            </div>
          </template>
        </el-table-column>-->
        <el-table-column
            prop="status"
            label="状态"
            width="120">
          <template #default="{row}">
            <div class="status-cell">
              <el-tag
                  v-if="row.status == 0"
                  type="success"
                  effect="dark">
                <i class="el-icon-success"></i> 正常
              </el-tag>
              <el-tag
                  v-if="row.status == 1"
                  type="warning"
                  effect="dark">
                <i class="el-icon-error"></i> 停用
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
            prop="createTime"
            label="创建时间"
            width="180">
          <template #default="{row}">
            <div class="time-cell">
              <i class="el-icon-time" style="color:#A5A4BF; margin-right:5px"></i>
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
              <el-dropdown
                  trigger="click"
                  @command="handleCommand"
                  placement="bottom-end">
                <el-button
                    size="mini"
                    class="action-btn more-btn">
                  <i class="el-icon-more"></i> 操作
                </el-button>
                <el-dropdown-menu slot="dropdown" class="tech-dropdown">
                  <!--<el-dropdown-item
                      icon="el-icon-plus"
                      :command="row.idArrary + '#add#' + row.id"
                      class="dropdown-item">
                    新增
                  </el-dropdown-item>-->
                  <el-dropdown-item
                      icon="el-icon-edit"
                      :command="row.id + '#edit'"
                      class="dropdown-item">
                    修改
                  </el-dropdown-item>
                  <el-dropdown-item
                      icon="el-icon-delete"
                      :command="row.id + '#remove'"
                      class="dropdown-item delete-item">
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <add-menu @addMenuFalse="addMenuFalse" :disable="disable" :parentId="parentId" :dropData="tableData" :addMenuVisible="addMenuVisible"></add-menu>
    <update-menu @updateMenuFalse="updateMenuFalse" :updateId="updateId" :dropData="tableData" :updateMenuVisible="updateMenuVisible"></update-menu>
  </div>
</template>

<script>
import {getMenuList,removeMenu} from '../../../api/api'
import addMenu from '../../../components/system/menu/addMenu'
import updateMenu from '../../../components/system/menu/updateMenu'
export default {
  data() {
    return{
      loading: true,
      refreshTable: true,
      expand:true,
      addMenuVisible: false,
      updateMenuVisible: false,
      search: {
        menuName: "",
        status: "",
      },
      tableData: [],
      parentId: [],
      disable: false,
      updateId: "",
    }
  },
  components: {
    addMenu,
    updateMenu
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
    query() {
      getMenuList(this.search).then(res => {
        if(res.code == 1000) {
          this.tableData = res.data
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
      this.search.menuName = ""
      this.search.status = ""
      this.query()
    },
    changeExpand() {
      this.refreshTable = false;
      this.expand = !this.expand;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
    addMenu() {
      this.addMenuVisible = true
    },
    addMenuFalse() {
      this.addMenuVisible = false
      this.parentId = []
      this.disable = false
      this.query()
    },
    updateMenu() {
      this.updateMenuVisible = true
    },
    updateMenuFalse() {
      this.updateId = ""
      this.updateMenuVisible = false
      this.query()
    },
    handleCommand(command) {
      var data = command.split("#")
      if(data[1] == 'add') {
        var idArrary = data[0].split(",")
        var id = data[2]
        if (idArrary[0] != "0") {
          this.parentId = idArrary
        }
        this.parentId.push(id)
        this.disable = true
        this.addMenu()
      } else if (data[1] == 'edit') {
        this.updateId = data[0]
        this.updateMenu()
      } else {
        this.deleteDate(data[0])
      }
    },
    deleteDate(id) {
      this.$confirm('确定删除选中的数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'tech-message-box'
      }).then(() => {
        removeMenu({id:id}).then(res => {
          if(res.code == 1000) {
            this.$message({
              type: 'success',
              message: '删除成功!',
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
      }).catch(() => {});
    }
  },
  mounted() {
    this.query()
  }
}
</script>

<style scoped>
.menu-management {
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

.name-cell, .icon-cell, .order-cell, .perms-cell,
.path-cell, .status-cell, .time-cell {
  display: flex;
  align-items: center;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
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

.status-option {
  display: flex;
  align-items: center;
}

.status-option i {
  margin-right: 5px;
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

.action-btn.add-btn {
  background: linear-gradient(135deg, #7B68EE, #9370DB);
  color: white;
  border: none;
}

.action-btn.expand-btn {
  background: linear-gradient(135deg, #909399, #A6A9AD);
  color: white;
  border: none;
}

.action-btn.more-btn {
  background: linear-gradient(135deg, #5F4B8B, #7B68EE);
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

.tech-dropdown {
  border-radius: 8px;
  border: 1px solid #ECE9F4;
  box-shadow: 0 2px 12px rgba(123, 104, 238, 0.1);
}

.dropdown-item {
  color: #5F4B8B;
  padding: 8px 20px;
}

.dropdown-item i {
  color: #7B68EE;
}

.delete-item i {
  color: #F56C6C;
}

.dropdown-item:hover {
  background-color: #F5F2FF;
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

.el-tag {
  display: inline-flex;
  align-items: center;
  padding: 0 8px;
  height: 24px;
  line-height: 24px;
}

.el-tag i {
  margin-right: 4px;
}
</style>

<style scoped>
/* 调整表格单元格的对齐和间距 */
.name-cell, .icon-cell, .order-cell, .status-cell, .time-cell {
  display: flex;
  align-items: center;
  padding: 8px 0; /* 增加垂直内边距 */
}

/* 调整图标和文本的间距 */
.name-cell i, .icon-cell i, .order-cell i, .time-cell i {
  margin-right: 8px; /* 统一图标右边距 */
  width: 20px; /* 固定图标宽度 */
  text-align: center; /* 图标居中 */
}

/* 调整状态标签样式 */
.status-cell .el-tag {
  margin: 0 auto; /* 状态标签居中 */
  width: 60px; /* 固定宽度 */
  justify-content: center; /* 内容居中 */
}

/* 调整操作按钮 */
.action-buttons {
  display: flex;
  justify-content: center; /* 操作按钮居中 */
  padding: 8px 0;
}

/* 调整表格行高 */
.el-table .el-table__row {
  height: 50px; /* 固定行高 */
}

/* 调整表头样式 */
.el-table__header th {
  padding: 12px 0; /* 增加表头内边距 */
  text-align: center; /* 表头文本居中 */
}

/* 调整表格单元格内边距 */
.el-table .cell {
  padding: 0 10px; /* 调整单元格左右内边距 */
}
</style>

<style>
/* 全局调整下拉菜单样式 */
.el-dropdown-menu__item {
  padding: 0 20px; /* 调整下拉菜单项内边距 */
  text-align: center; /* 下拉菜单文本居中 */
}

/* 调整操作按钮的悬停效果 */
.action-btn:hover {
  transform: none; /* 移除悬停时的位移效果 */
  box-shadow: 0 2px 6px rgba(123, 104, 238, 0.2); /* 减小阴影 */
}
</style>

