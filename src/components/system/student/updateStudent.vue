<template>
<div>
  <el-dialog title="编辑学生" width="40%" :destroy-on-close="true" :visible.sync="updateUserVisible" :before-close="handleClose">
    <el-form :model="form" :rules="rules" ref="ruleForm">
      <el-row :gutter="10">
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <span class="search-title">学生昵称:</span>
            <el-form-item prop="userName" style="margin-bottom:0">
              <el-input v-model="form.userName" size="mini" placeholder="请输入学生昵称" autocomplete="off"></el-input>
            </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <span class="search-title">手机号码:</span>
            <el-form-item prop="tel" style="margin-bottom:0">
              <el-input v-model="form.tel" size="mini" placeholder="请输入手机号码" autocomplete="off"></el-input>
            </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <span class="search-title">&nbsp;&nbsp;&nbsp;&nbsp;邮箱:</span>
            <el-form-item prop="email" style="margin-bottom:0">
              <el-input v-model="form.email" size="mini" placeholder="请输入邮箱" autocomplete="off"></el-input>
            </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <span class="search-title">登录账号:</span>
            <el-form-item prop="loginAccount" style="margin-bottom:0">
              <el-input v-model="form.loginAccount" size="mini" placeholder="请输入登录账号" autocomplete="off"></el-input>
            </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <span class="search-title">学校:</span>
            <el-form-item prop="school" style="margin-bottom:0">
              <el-select size="mini" v-model="form.school" placeholder="请选择学校">
                <el-option v-for="(item,index) in school" :key="index" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <span class="search-title">专业:</span>
            <el-form-item prop="major" style="margin-bottom:0">
              <el-select size="mini" v-model="form.major" placeholder="请选择专业">
                <el-option v-for="(item,index) in major" :key="index" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <span class="search-title">国家:</span>
            <el-form-item prop="country" style="margin-bottom:0">
              <el-input v-model="form.country" size="mini" placeholder="请输入国家" autocomplete="off"></el-input>
            </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <span class="search-title">年龄:</span>
            <el-form-item prop="age" style="margin-bottom:0">
              <el-input type="number" v-model="form.age" size="mini" placeholder="请输入年龄" autocomplete="off"></el-input>
            </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <span class="search-title">生日:</span>
            <el-form-item prop="birth" style="margin-bottom:0">
              <el-date-picker size="mini"
                v-model="form.birth"
                type="date"
                placeholder="请输入生日">
              </el-date-picker>
            </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <span class="search-title">地址:</span>
            <el-form-item prop="address" style="margin-bottom:0">
              <el-input v-model="form.address" size="mini" placeholder="请输入地址" autocomplete="off"></el-input>
            </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <span class="search-title">性别:</span>
            <el-form-item prop="sex" style="margin-bottom:0">
              <el-select size="mini" v-model="form.sex" placeholder="请选择性别">
                <el-option label="男" value="0"></el-option>
                <el-option label="女" value="1"></el-option>
              </el-select>
            </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <span class="search-title">状态:</span>
             <el-form-item prop="name" style="margin-bottom:0">
                <el-radio-group style="margin-top:1px;height:40px;display:flex;align-items: center" v-model="form.status">
                  <el-radio label="0">正常</el-radio>
                  <el-radio label="1">停用</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <span class="search-title">&nbsp;&nbsp;&nbsp;&nbsp;备注:</span>
            <el-input type="textarea" v-model="form.remark"></el-input>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click="submit">确 定</el-button>
      <el-button size="mini" @click="handleClose">取 消</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
  import {mixin} from "../../../minix";
  import {getUserById,editUser,getSchoolList,getMajorList} from '../../../api/api'
  export default {
    mixins: [mixin],
    data() {
      return{
        formLabelWidth: '80px',
        school: [],
        major: [],
        form: {
          userName: "",
          loginAccount: "",
          email: "",
          tel: "",
          sex: "",
          password: "",
          status: "0",
          userType: 2,
          school: "",
          major: "",
          country: "",
          age: "",
          birth: "",
          address: "",
          remark: "",
        },
        fileList: [],
        rules: {
          userName: [
            { required: true, message: '请输入学生昵称', trigger: 'blur' },
          ],
          loginAccount: [
            { required: true, message: '请输入登录账号', trigger: 'blur' },
          ],
          tel: [
            { required: true, message: '请输入联系电话', trigger: 'blur' },
          ],
          email: [
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          ],
          school: [
            { required: true, message: '请选择学校', trigger: 'blur' },
          ],
          major: [
            { required: true, message: '请选择专业', trigger: 'blur' },
          ],
          sex: [
            { required: true, message: '请选择性别', trigger: 'blur' },
          ],
          country: [
            { required: true, message: '请输入国家', trigger: 'blur' },
          ],
          age: [
            { required: true, message: '请输入年龄', trigger: 'blur' },
          ],
          birth: [
            { required: true, message: '请选择生日', trigger: 'blur' },
          ],
          address: [
            { required: true, message: '请输入地址', trigger: 'blur' },
          ],
        }
      }
    },
    props: ['updateUserVisible','updateId'],
    methods: {
      getSchoolList() {
        getSchoolList().then(res=> {
          if(res.code == 1000) {
            this.school = res.data
          } else {
            this.$notify.error({
              title: '错误',
              message: res.message
            });
          }
        })
      },
      getMajorList() {
        getMajorList().then(res => {
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
      submit() {
        editUser(this.form).then(res => {
          if(res.code == 1000) {
            this.$notify.success({
                  title: '成功',
                  message: "保存成功"
                });
            this.handleClose()
          } else {
            this.$notify.error({
              title: '错误',
              message: res.message
            });
          }
        })
      },
      handleClose() {
        this.fileList = []
        this.$emit("updateUserFalse")
      }
    },
    mounted() {
      this.getMajorList()
      this.getSchoolList()
    },
    watch: {
      updateId(newVal) {
        if(newVal) {
          getUserById({id:newVal}).then(res => {
            if(res.code == 1000) {
              this.form = res.data
              this.form.sex = res.data.sex + ""
              this.form.status = res.data.status + ""
            } else {
              this.$notify.error({
                title: '错误',
                message: res.message
              });
            }
          })
        }
      }
    }
 }
</script>

<style   scoped>
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
      width: 63px;
      text-align: right;
  }
</style>