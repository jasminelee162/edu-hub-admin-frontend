<template>
<div> 
  <el-dialog title="新增笔记" width="40%" :destroy-on-close="true" :visible.sync="addVisible" :before-close="handleClose" class="custom-dialog">
    <el-form :model="form" :rules="rules" ref="ruleForm">
      <el-row :gutter="10">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <span class="search-title">
                <i class="el-icon-notebook-1"></i> 所属课程:
            </span>
            <div style="width:100%">
                <el-form-item prop="taskId" style="margin-bottom:0">
                    <el-select :disabled="type == 0 ? true:false" clearable style="margin-top:10px" size="mini" v-model="form.taskId" placeholder="请选择" class="purple-select">
                        <el-option v-for="(item,index) in task" :key="index"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <span class="search-title">
                <i class="el-icon-edit-outline"></i> 标题:
            </span>
            <div style="width:100%">
              <el-form-item prop="title" style="margin-bottom:0">
                  <el-input v-model="form.title" size="mini" placeholder="请输入标题" autocomplete="off" class="purple-input">
                    <i slot="prefix" class="el-icon-edit"></i>
                  </el-input>
              </el-form-item>
            </div>
        </el-col>
        <el-col style="margin-top:25px" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <span class="search-title">
                <i class="el-icon-document"></i> 摘要:
            </span>
            <div style="width:100%">
              <el-form-item prop="articleDesc" style="margin-bottom:0">
                  <el-input type="textarea" v-model="form.articleDesc" size="mini" placeholder="请输入摘要" autocomplete="off" class="purple-textarea">
                  </el-input>
              </el-form-item>
            </div>
        </el-col>
        <el-col style="margin-top:25px" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <span class="search-title">
                <i class="el-icon-tickets"></i> 内容:
            </span>
            <div style="width:100%">
              <el-form-item prop="content" style="margin-bottom:0">
                <quill-editor ref="myQuillEditor" :options="editorOption"
                v-model="form.content" class="purple-editor"/>
                <el-upload class="Quill-uploader" :show-file-list="false" accept="image/*" v-show="0" ref="updateUpload" :multiple="false" :action="uploadImageUrl()"
                    :on-success="handleQillSuccess">
                </el-upload>
              </el-form-item>
            </div>
        </el-col>
        <el-col style="margin-top:25px" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <span class="search-title">
                <i class="el-icon-collection-tag"></i> 备注:
            </span>
            <div style="width:100%">
              <el-form-item prop="remark" style="margin-bottom:0">
                  <el-input type="textarea" v-model="form.remark" size="mini" placeholder="请输入备注" autocomplete="off" class="purple-textarea">
                  </el-input>
              </el-form-item>
            </div>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click="submit" class="purple-btn">
        <i class="el-icon-check"></i> 确 定
      </el-button>
      <el-button size="mini" @click="handleClose" class="gray-btn">
        <i class="el-icon-close"></i> 取 消
      </el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
  import { mixin } from '../../../minix/index';
  import {saveArticle,getTaskList,getTaskByTeacherId} from '../../../api/api'
  export default {
    mixins: [mixin],
    data() {
      return{
        editorOption: {
          placeholder: "请输入文字内容",
          modules: { 
            toolbar: {
                container: [
                    ["bold", "italic", "underline", "strike"], 
                    ["blockquote", "code-block"], 
                    [{ header: 1 }, { header: 2 }], 
                    [{ list: "ordered" }, { list: "bullet" }], 
                    [{ script: "sub" }, { script: "super" }], 
                    [{ indent: "-1" }, { indent: "+1" }], 
                    [{ direction: "rtl" }], 
                    [{ size: ["small", false, "large", "huge"] }], 
                    [{ header: [1, 2, 3, 4, 5, 6, false] }], 
                    [{ color: [] }, { background: [] }], 
                    [{ font: [] }], [{ align: [] }], 
                    ["clean"], ["image"]
                ],
                handlers: {
                    'image': function ( value ) {
                        if ( value ) {
                            // 触发上传插件
                            document.querySelector('.Quill-uploader .el-upload__input').click()
                        } else {
                            this.quill.format( 'image', false );
                        }
                    }
                }
            },
            syntax: { 
                highlight: text => { 
                    return hljs.highlightAuto(text).value; // 这里就是代码高亮需要配置的地方 
                }
            }
          }
        },
        formLabelWidth: '80px',
        form: {
          taskId: "",
          title: "",
          articleDesc: "",
          content: "",
          state: "",
          remark: "",
          taskName: "",
        },
        task: [],
        rules: { 
          taskId: [
            { required: true, message: '请选择课程', trigger: 'blur' },
          ],
          title: [
            { required: true, message: '请输入标题', trigger: 'blur' },
          ],
          articleDesc: [
            { required: true, message: '请输入摘要', trigger: 'blur' },
          ],
          content: [
            { required: true, message: '请输入笔记内容', trigger: 'blur' },
          ],
        },
      }
    },
    props: ['addVisible','taskId','type','flag'],
    methods: {
      submit() {
        this.$refs["ruleForm"].validate((valid) => {
          if (valid) {
            saveArticle(this.form).then(res => {
              if(res.code == 1000) {
                this.$notify.success({
                  title: '成功',
                  message: "保存成功"
                });
                this.handleClose();
              } else {
                this.$notify.error({
                  title: '错误',
                  message: res.message
                });
              }
            })
          } else {
            return false;
          }
        });
      },
      handleQillSuccess(res){
          let _this = this;
          if(res.code == 1000){
              _this.$notify({
                  title: '上传成功',
                  type: 'success'
              });
              let imgurl = this.$store.state.configure.HOST + res.message
              let quill = this.$refs.myQuillEditor.quill
              let position = quill.getSelection().index
              quill.insertEmbed(position, 'image', imgurl)
              quill.setSelection(position + 1)
          }else{
              _this.$notify({
                  title: '上传失败',
                  type: 'error'
              });
          }
      },
      handleClose() {
        this.form = {
          taskId: "",
          title: "",
          articleDesc: "",
          content: "",
          state: "",
          remark: "",
          taskName: "",
        },
        this.$emit("addFalse")
      },
      getTaskList() {
          getTaskList().then(res => {
              if(res.code == 1000) {
                this.task = res.data;
              } else {
                this.$notify.error({
                  title: '错误',
                  message: res.message
                });
              }
          })
      },
      getTaskByTeacherId() {
        getTaskByTeacherId().then(res => {
              if(res.code == 1000) {
                this.task = res.data;
              } else {
                this.$notify.error({
                  title: '错误',
                  message: res.message
                });
              }
          })
      },
    },
    created() {
     
    },
    mounted() {
      if(this.flag == 2) {
        this.getTaskByTeacherId()
      } else {
        this.getTaskList()
      }
    },
    watch: {
      addVisible(newVal) {
        if(newVal) {
          if(this.taskId) {
            this.form.taskId = this.taskId
          }
        }
      }
    }
 }
</script>

<style scoped>
  .el-col {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-top: 12px
  }
  .search-title {
      font-family: '黑体';
      float: right;
      white-space: nowrap;
      font-size: 14px;
      width: 84px;
      text-align: right;
      color: #5F4B8B;
  }
  .search-title i {
      margin-right: 6px;
      color: #7B68EE;
  }
  .el-tree {
      border: 1px solid #BDC1C9;
  }
</style>

<style>
  /* 全局样式 */
  .custom-dialog .el-dialog__header {
      background: linear-gradient(135deg, #7B68EE, #9370DB);
      padding: 15px 20px;
  }
  
  .custom-dialog .el-dialog__title {
      color: white;
      font-weight: bold;
  }
  
  .custom-dialog .el-dialog__headerbtn .el-dialog__close {
      color: white;
  }
  
  .purple-select .el-input__inner {
      border-color: #D8D8E5;
      color: #5F4B8B;
      background-color: #F9F8FD;
  }
  
  .purple-select .el-input__inner:focus {
      border-color: #7B68EE;
  }
  
  .purple-input .el-input__inner {
      border-color: #D8D8E5;
      color: #5F4B8B;
      background-color: #F9F8FD;
      padding-left: 30px;
  }
  
  .purple-input .el-input__prefix {
      left: 5px;
      color: #7B68EE;
  }
  
  .purple-textarea .el-textarea__inner {
      border-color: #D8D8E5;
      color: #5F4B8B;
      background-color: #F9F8FD;
      min-height: 80px !important;
  }
  
  .purple-editor .ql-toolbar {
      border-color: #D8D8E5 !important;
      background-color: #F5F2FF;
  }
  
  .purple-editor .ql-container {
      border-color: #D8D8E5 !important;
      height: 200px;
  }
  
  .purple-btn {
      background: linear-gradient(135deg, #7B68EE, #9370DB);
      border: none;
      color: white;
      border-radius: 15px;
      padding: 7px 15px;
  }
  
  .purple-btn i {
      margin-right: 5px;
  }
  
  .gray-btn {
      border-color: #D8D8E5;
      color: #5F4B8B;
      border-radius: 15px;
      padding: 7px 15px;
  }
  
  .gray-btn i {
      margin-right: 5px;
  }
</style>