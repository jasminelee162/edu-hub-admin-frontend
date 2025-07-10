<template>
  <div class="template-management">
    <!-- 搜索区域 -->
    <div class="search-panel">
      <el-row :gutter="15">
        <!-- 资料名称搜索 -->
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <div class="search-item">
            <span class="search-title">
              <i class="el-icon-document"></i> 资料名称:
            </span>
            <el-input
              size="small"
              placeholder="请输入资料名称"
              v-model="search.name"
              class="tech-input">
              <i slot="prefix" class="el-icon-edit-outline"></i>
            </el-input>
          </div>
        </el-col>
        
        <!-- 创建时间搜索 -->
        <!-- <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <div class="search-item">
            <span class="search-title">
              <i class="el-icon-date"></i> 创建时间:
            </span>
            <el-date-picker
              size="small"
              v-model="search.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              class="tech-date-picker">
            </el-date-picker>
          </div>
        </el-col> -->
        
        <!-- 操作按钮 -->
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
    
    <!-- 数据面板 -->
    <div class="data-panel">
      <!-- 操作栏 -->
      <div class="action-bar">
        <el-upload
          class="upload-btn"
          action=""
          :show-file-list="false"
          :before-upload="beforeUpload"
          :http-request="uploadFile">
          <el-button 
            type="primary" 
            size="small" 
            icon="el-icon-upload"
            class="action-btn upload-btn">
            上传资料
          </el-button>
        </el-upload>
        <el-button 
          type="danger" 
          size="small" 
          icon="el-icon-delete" 
          :disabled="selected.length <= 0"
          @click="deleteDataBtn"
          class="action-btn delete-btn">
          批量删除
        </el-button>
      </div>
      
      <!-- 数据表格 -->
      <el-table
        v-loading="loading"
        :data="tableData"
        :header-cell-style="tableHeaderStyle"
        :row-style="tableRowStyle"
        @selection-change="handleSelectionChange"
        stripe
        class="tech-table">
        <!-- 选择列 -->
        <el-table-column
          type="selection"
          width="55"
          align="center">
        </el-table-column>
        
        <!-- 资料名称列 -->
        <el-table-column
          prop="name"
          label="资料名称"
          min-width="200">
          <template #default="{row}">
            <div class="name-cell">
              <i class="el-icon-document"></i>
              <span>{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        
        <!-- 创建时间列 -->
        <!-- <el-table-column
          prop="createdAt"
          label="创建时间"
          width="180">
          <template #default="{row}">
            <div class="time-cell">
              <i class="el-icon-time"></i>
              <span>{{ row.createdAt }}</span>
            </div>
          </template>
        </el-table-column> -->
        
        <!-- 操作列 -->
        <el-table-column
          label="操作"
          width="300"
          fixed="right">
          <template #default="{row}">
            <div class="action-buttons">
              <el-button 
                size="mini" 
                type="primary" 
                @click="viewContent(row.id)"
                class="action-btn view-btn">
                <i class="el-icon-view"></i> 查看
              </el-button>
              
              <el-button 
                size="mini" 
                type="success" 
                @click="downloadFile(row.id)"
                class="action-btn download-btn">
                <i class="el-icon-download"></i> 下载
              </el-button>
              
              <el-popconfirm
                title="确认删除此资料？"
                @confirm="deleteData(row.id)"
                confirm-button-text="确认"
                cancel-button-text="取消"
                icon="el-icon-warning"
                icon-color="#409EFF">
                <el-button 
                  size="mini"
                  type="danger"
                  slot="reference"
                  class="action-btn delete-btn">
                  <i class="el-icon-delete"></i> 删除
                </el-button>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
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
</template>

<script>
import { uploadTemplate, getTemplates, deleteTemplate, getTemplateContent } from '../../../api/api'
import { renderAsync } from 'docx-preview'

export default {
  data() {
    return {
      loading: true,
      selected: [],
      search: {
        name: "",
        dateRange: [],
        pageNumber: 1,
        pageSize: 10
      },
      total: 0,
      tableData: [],
    }
  },
  methods: {
    // 表格头部样式
    tableHeaderStyle() {
      return {
        'color': '#1E2B45',
        'background-color': '#F0F4F8',
        'font-weight': '600',
        'border-bottom': '1px solid #D1E0FF'
      }
    },
    
    // 表格行样式
    tableRowStyle() {
      return {
        'color': '#2C3E50',
        'font-size': '14px',
        'border-bottom': '1px solid #F0F4F8'
      }
    },
    
    // 上传前校验
    beforeUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error('上传文件大小不能超过10MB!')
        return false
      }
      
      // 检查文件类型
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'image/jpeg',
        'image/png'
      ]
      
      if (!allowedTypes.includes(file.type)) {
        this.$message.error('只支持上传PDF、Word、Excel、PPT、JPG和PNG文件!')
        return false
      }
      
      return true
    },
    
    // 文件上传方法（完整实现）
    uploadFile({ file, onProgress, onSuccess, onError }) {
      const formData = new FormData();
      formData.append('file', file); // ✅ 关键点：必须是 file

      uploadTemplate(formData, {
        // headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress({ percent: percentCompleted }); // 支持进度条
        }
      }).then(res => {
        if (res.code === 1000) {
          this.$notify.success({ title: '成功', message: '上传成功' });
          this.query();
          onSuccess(res); // ✅ 必须回调成功
        } else {
          this.$notify.error({ title: '错误', message: res.message || '上传失败' });
          onError(new Error(res.message || '上传失败')); // ✅ 回调失败
        }
      }).catch(error => {
        this.$notify.error({ title: '错误', message: error.message || '上传失败' });
        onError(error); // ✅ 回调失败
      });
    },
    
    // 查看内容 在线预览docx
    viewContent(id) {
      this.loading = true;
      getTemplateContent({ id }).then(res => {
        this.loading = false;
        
        if (res.code !== 1000) {
          this.$notify.error({ title: '错误', message: res.message || '获取内容失败' });
          return;
        }

        const template = this.tableData.find(item => item.id === id);
        const data = res.data;

        // 调试日志
        console.log('当前文件数据:', {
          templateData: template,
          responseData: data
        });

        // 获取文件类型（优先从响应数据获取，其次从表格数据）
        const fileType = (data.fileType || template?.fileType || '')
                        .toString()
                        .toLowerCase()
                        .replace('.', '')
                        .trim();

        if (!data.fileContent) {
          this.$message.error('文件内容为空');
          return;
        }

        if (!fileType) {
          this.$alert('无法识别文件类型，请下载查看', '提示', {
            confirmButtonText: '下载',
            callback: () => this.downloadFile(id)
          });
          return;
        }

        const mimeType = this.getMimeType(fileType);
        console.log('最终识别类型:', { fileType, mimeType });

        try {
          const blob = this.base64ToBlob(data.fileContent, mimeType);
          
          // 预览处理
          if (['pdf'].includes(fileType)) {
            window.open(URL.createObjectURL(blob), '_blank');
          } 
          else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileType)) {
            const imgWindow = window.open('', '_blank');
            imgWindow.document.write(`<img src="${URL.createObjectURL(blob)}" style="max-width:100%"/>`);
          }
          else if (fileType === 'docx') {
            this.showDocx(data.fileContent);
          }
          else {
            this.$alert(`不支持预览 ${fileType} 格式文件`, '提示', {
              confirmButtonText: '下载',
              callback: () => this.downloadFile(id)
            });
          }
        } catch (e) {
          console.error('预览处理出错:', e);
          this.$notify.error({
            title: '错误',
            message: '文件处理失败: ' + e.message
          });
        }
      }).catch(error => {
        this.loading = false;
        console.error('请求出错:', error);
        this.$notify.error({
          title: '错误',
          message: error.message || '获取内容失败'
        });
      });
    },



    //文件二进制转化
    base64ToBlob(base64Data, mimeType = '') {
        // 移除可能存在的Base64前缀
      const base64WithoutPrefix = base64Data.replace(/^data:\w+\/\w+;base64,/, '');
      const byteCharacters = atob(base64WithoutPrefix);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        byteArrays.push(new Uint8Array(byteNumbers));
      }

      return new Blob(byteArrays, { type: mimeType });
    },

    getMimeType(fileType) {
      const map = {
        pdf: 'application/pdf',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        txt: 'text/plain',
        doc: 'application/msword',
        docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ppt: 'application/vnd.ms-powerpoint',
        pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        xls: 'application/vnd.ms-excel',
        xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        gif: 'image/gif',
        svg: 'image/svg+xml',
        mp4: 'video/mp4',
        webm: 'video/webm'
      };
      return map[fileType] || 'application/octet-stream';
    },


    //pptx excel docx预览
    showDocx(fileContentBase64) {
      const blob = this.base64ToBlob(
        fileContentBase64, 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      );
      
      const container = document.createElement('div');
      container.style.cssText = `
        width: 100%;
        height: 90vh;
        margin: 0 auto;
        overflow: auto;
        padding: 20px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
      `;
      
      // 创建新窗口
      const win = window.open('', '_blank');
      win.document.title = '文档预览';
      win.document.body.style.margin = '0';
      win.document.body.appendChild(container);
      
      // 添加加载状态
      container.innerHTML = '<div style="text-align:center;padding:50px">正在加载文档...</div>';
      
      renderAsync(blob, container, null, {
        className: "docx-viewer", // 添加自定义class
        inWrapper: true,         // 启用包裹容器
        ignoreWidth: false,
        ignoreHeight: false,
        ignoreFonts: false
      }).catch(error => {
        console.error('DOCX渲染失败:', error);
        container.innerHTML = '<div style="color:red">文档预览失败，请下载后查看</div>';
      });
    },


    
    // 下载文件
    downloadFile(id) {
      this.loading = true;
      getTemplateContent({ id }).then(res => {
        this.loading = false;
        if (res.code === 1000) {
          const template = this.tableData.find(item => item.id === id);
          const base64 = res.data.fileContent;
          const mimeType = this.getMimeType(template.fileType);
          const blob = this.base64ToBlob(base64, mimeType);
          const url = URL.createObjectURL(blob);
          
          const link = document.createElement('a');
          link.href = url;
          link.download = template.name || 'download';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          
          this.$notify.success({
            title: '成功',
            message: '文件下载已开始',
            duration: 2000
          });
        } else {
          this.$notify.error({
            title: '错误',
            message: res.message || '下载失败'
          });
        }
      }).catch(error => {
        this.loading = false;
        this.$notify.error({
          title: '错误',
          message: error.message || '下载失败'
        });
      });
    },

    
    // 搜索
    searchPage() {
      this.search.pageNumber = 1
      this.query()
    },
    
    // 查询数据
    query() {
      this.loading = true
      const params = {
        ...this.search,
        startDate: this.search.dateRange ? this.search.dateRange[0] : '',
        endDate: this.search.dateRange ? this.search.dateRange[1] : ''
      }
      delete params.dateRange
      
      getTemplates(params).then(res => {
        this.loading = false
        if (res.code === 1000) {
          this.tableData = res.data.records || []
          this.total = res.data.total || 0
        } else {
          this.$notify.error({
            title: '错误',
            message: res.message || '获取数据失败'
          })
        }
      }).catch(error => {
        this.loading = false
        this.$notify.error({
          title: '错误',
          message: error.message || '获取数据失败'
        })
      })
    },
    
    // 重置搜索
    refresh() {
      this.search.name = ""
      this.search.dateRange = []
      this.query()
    },
    
    // 分页变化
    handleCurrentChange(val) {
      this.search.pageNumber = val
      this.query()
    },
    
    // 每页条数变化
    handleSizeChange(val) {
      this.search.pageSize = val
      this.query()
    },
    
    // 选择变化
    handleSelectionChange(val) {
      this.selected = val.map(item => item.id)
    },
    
    // 批量删除
    deleteDataBtn() {
      if (this.selected.length === 0) {
        this.$message.warning('请至少选择一条数据')
        return
      }
      
      this.$confirm(`确定删除选中的 ${this.selected.length} 条数据?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'tech-message-box',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            this.deleteData(this.selected)  // 直接传递数组
              .finally(() => {
                instance.confirmButtonLoading = false
                done()
              })
          } else {
            done()
          }
        }
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    
    // 删除数据
    deleteData(ids) {
      // 确保ids是数组格式
      const idsArray = Array.isArray(ids) ? ids : [ids];
      
      return deleteTemplate(idsArray).then(res => {
        if (res.code === 1000) {
          this.$message({
            type: 'success',
            message: '删除成功!',
            customClass: 'tech-message',
            duration: 2000
          })
          this.search.pageNumber = 1
          this.query()
        } else {
          this.$notify.error({
            title: '错误',
            message: res.message || '删除失败'
          })
        }
      }).catch(error => {
        this.$notify.error({
          title: '错误',
          message: error.message || '删除失败'
        })
      })
    },
  },

  
  mounted() {
    this.query()
  }
}
</script>

<style scoped>
.template-management {
  padding: 24px;
  background-color: #f8f9fc;
  min-height: calc(100vh - 48px);
}

.search-panel {
  background: linear-gradient(135deg, #ffffff, #f9f9ff);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 6px 18px rgba(100, 87, 255, 0.08);
  border: 1px solid #e6e8f0;
}

.search-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
}

.search-title {
  font-size: 13px;
  color: #5a6487;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.search-title i {
  margin-right: 8px;
  color: #6c5ce7;
}

.search-actions {
  display: flex;
  align-items: flex-end;
  height: 100%;
  justify-content: flex-end;
}

.data-panel {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 6px 18px rgba(100, 87, 255, 0.08);
  border: 1px solid #e6e8f0;
}

.action-bar {
  padding: 0 0 20px 0;
  margin-bottom: 20px;
  display: flex;
  gap: 12px;
  border-bottom: 1px solid #f0f2f7;
}

.name-cell, .time-cell {
  display: flex;
  align-items: center;
}

.name-cell i {
  color: #6c5ce7;
  margin-right: 10px;
  font-size: 18px;
}

.time-cell i {
  color: #a7b1cb;
  margin-right: 10px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  border-radius: 6px;
  padding: 7px 12px;
  font-size: 12px;
  min-width: 70px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  font-weight: 500;
  letter-spacing: 0.3px;
}

.action-btn i {
  margin-right: 5px;
  font-size: 14px;
}

.upload-btn {
  margin-right: 0;
}
</style>

<style>
/* 全局样式 */
.tech-input .el-input__inner {
  border-radius: 8px;
  border: 1px solid #e0e3ed;
  color: #3d4766;
  background-color: #fcfcff;
  height: 36px;
  line-height: 36px;
  transition: all 0.25s ease;
  font-size: 13px;
}

.tech-input .el-input__inner:focus {
  border-color: #6c5ce7;
  box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.15);
}

.tech-date-picker .el-input__inner {
  border-radius: 8px;
  border: 1px solid #e0e3ed;
  color: #3d4766;
  background-color: #fcfcff;
  height: 36px;
  line-height: 36px;
}

.tech-date-picker .el-range-separator {
  color: #8a94b3;
  font-weight: 500;
}

.search-btn {
  background: linear-gradient(135deg, #6c5ce7, #5a4bd6);
  border: none;
  border-radius: 8px;
  color: white;
  padding: 9px 18px;
  height: 36px;
  box-shadow: 0 4px 12px rgba(108, 92, 231, 0.2);
  transition: all 0.25s ease;
}

.search-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(108, 92, 231, 0.3);
}

.reset-btn {
  border-radius: 8px;
  color: #6c5ce7;
  border: 1px solid #e0e3ed;
  padding: 9px 18px;
  height: 36px;
  background: #ffffff;
  transition: all 0.25s ease;
}

.reset-btn:hover {
  background-color: #f8f9ff;
  border-color: #d5d9e8;
}

.action-btn.upload-btn {
  background: linear-gradient(135deg, #6c5ce7, #5a4bd6);
  color: white;
  box-shadow: 0 4px 12px rgba(108, 92, 231, 0.2);
}

.action-btn.view-btn {
  background: linear-gradient(135deg, #6c5ce7, #5a4bd6);
  color: white;
  box-shadow: 0 4px 12px rgba(108, 92, 231, 0.2);
}

.action-btn.download-btn {
  background: linear-gradient(135deg, #00b894, #00a884);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 184, 148, 0.2);
}

.action-btn.delete-btn {
  background: linear-gradient(135deg, #ff7675, #e66767);
  color: white;
  box-shadow: 0 4px 12px rgba(255, 118, 117, 0.2);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  opacity: 0.95;
}

.tech-table {
  border-radius: 12px;
  border: 1px solid #e6e8f0;
  overflow: hidden;
}

.tech-table .el-table__header th {
  font-weight: 600;
}

.tech-table .el-table__body tr:hover>td {
  background-color: #f8f9ff !important;
}

.tech-table .el-table__body td {
  transition: background-color 0.2s ease;
}

.tech-pagination {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}

.tech-pagination .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #6c5ce7;
  color: white;
  font-weight: 600;
}

.tech-pagination .el-pagination.is-background .el-pager li:hover {
  color: #6c5ce7;
}

.tech-message-box {
  border-radius: 12px;
  border: 1px solid #6c5ce7;
}

.tech-message-box .el-message-box__title {
  color: #3d4766;
  font-weight: 600;
}

.tech-message-box .el-message-box__content {
  color: #5a6487;
}

.tech-message {
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 6px 18px rgba(100, 87, 255, 0.15);
  border: none;
}

.tech-message .el-message__content {
  color: #3d4766;
  font-weight: 500;
}

.el-popconfirm__action {
  text-align: center;
}

.el-popconfirm__action button {
  border-radius: 8px;
  padding: 8px 16px;
  transition: all 0.25s ease;
}

.el-popconfirm__action button:first-child {
  background: linear-gradient(135deg, #6c5ce7, #5a4bd6);
  border: none;
  color: white;
}

.el-popconfirm__action button:last-child {
  color: #6c5ce7;
  border: 1px solid #e0e3ed;
  background: #ffffff;
}

.el-tag {
  display: inline-flex;
  align-items: center;
  padding: 0 10px;
  height: 26px;
  line-height: 26px;
  border-radius: 6px;
  font-weight: 500;
}

.el-tag i {
  margin-right: 5px;
}

/* 移除输入框图标 */
.tech-input .el-input__prefix {
  display: none;
}
.tech-input .el-input__inner {
  padding-left: 15px;
}
</style>