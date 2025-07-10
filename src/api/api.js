import request, { post, get } from "@/utils/request";
import axios from 'axios';

// export function products(params) {
//     return request({
//       url: "/api/v1/products",  //接口路径
//       method: "get",  //接口方法
//       headers: { 'Content-Type': 'multipart/form-data' }, //给接口添加请求头
//       params  //接口参数
//     });
// }

//-------------------------------登录---------------------------------------
// 登录
export const login = (params) => post("/login",params)
//登出
export const logout = () => get("/login/logout")
//修改密码
export const changePassword = (params) => post("/user/changePassword",params)

// 发送验证码
export const sendEmailCode = (email) => post('/email/sendCode', { email })

// 邮箱验证码登录
export const loginWithEmail = (email, code) => post('/email/login', { email, code })
//-------------------------------上传---------------------------------------
// 上传图片
export const uploadImage = (params) => post("/common/uploadImage",params)
// 上传文件
export const uploadFile = (params) => post("/common/uploadFile",params)

//-------------------------------部门---------------------------------------
// 查询部门
export const getDeptList = (params) => post('/dept/getDeptList',params)
// 新增部门
export const saveDept = (params) => post('/dept/saveDept',params)
// 根据id查询部门
export const getById = (params) => get('/dept/getById',params)
//更新部门
export const editDept = (params) => post("/dept/editDept",params)
//删除部门
export const removeDept = (params) => get("/dept/removeDept",params)

//-------------------------------菜单---------------------------------------
// 查询菜单
export const getMenuList = (params) => post("/menu/getMenuList",params)
//保存菜单
export const saveMenu = (params) => post("/menu/saveMenu",params)
//更新菜单
export const editMenu = (params) => post("/menu/editMenu",params)
//删除菜单
export const removeMenu = (params) => get("/menu/removeMenu",params)
//根据id查询菜单
export const getMenuById = (params) => get("/menu/getById",params)
//根据用户获取菜单权限
export const getMenuByUser = () => get("/menu/getMenuByUser")

//-------------------------------岗位---------------------------------------
// 查询岗位
export const getPostPage = (params) => post("/post/getPostPage",params)
//岗位列表
export const getPostList = (params) => post("/post/getPostList",params)
//保存岗位
export const savePost = (params) => post("/post/savePost",params)
//更新岗位
export const editPost = (params) => post("/post/editPost",params)
//删除岗位
export const removePost = (params) => get("/post/removePost",params)
//根据id查询岗位
export const getPostById = (params) => get("/post/getPostById",params)

//-------------------------------角色---------------------------------------
// 查询角色
export const getRolePage = (params) => post("/role/getRolePage",params)
//查询角色列表
export const getRoleList = (params) => post("/role/getRoleList",params)
//根据id获取角色
export const getRoleById = (params) => get("/role/getRoleById",params)
//保存角色
export const saveRole = (params) => post("/role/saveRole",params)
//更新角色
export const editRole = (params) => post("/role/editRole",params)
//删除角色
export const removeRole = (params) => get("/role/removeRole",params)

//-------------------------------用户---------------------------------------
// 查询用户
export const getUserPage = (params) => post("/user/getUserPage",params)
//根据id查询用户
export const getUserById = (params) => get("/user/getUserById",params)
//保存用户
export const saveUser = (params) => post("/user/saveUser",params)
//更新用户
export const editUser = (params) => post("/user/editUser",params)
//删除用户
export const removeUser = (params) => get("/user/removeUser",params)
//重置密码
export const resetPassword = (params) => post("/user/resetPassword",params)
//获取登录用户信息
export const getUser = () => get("/user/getUserInfo")
//修改个人信息
export const setUserInfo = (params) => post("/user/setUserInfo",params)
//修改个人头像
export const setUserAvatar = (params) => get("/user/setUserAvatar",params)
//验证密码
export const verPassword = (params) => get("/login/verPassword",params)
//根据类型获取用户列表
export const getUserListByType = (params) => get("/user/getUserListByType",params)

//-------------------------------参数---------------------------------------
// 查询参数
export const getParamPage = (params) => post("/param/getParamPage",params)
// 根据id查询参数
export const getParamById = (params) => get("/param/getById",params)
//保存参数
export const saveParam = (params) => post("/param/saveParam",params)
//更新参数
export const editParam = (params) => post("/param/editParam",params)
//删除参数
export const removeParam = (params) => get("/param/removeParam",params)

//-------------------------------公告---------------------------------------
// 查询公告
export const getAccountPage = (params) => post("/account/getAccountPage",params)
// 根据id查询公告
export const getAccountById = (params) => get("/account/getById",params)
// 保存公告
export const saveAccount = (params) => post("/account/saveAccount",params)
// 编辑公告
export const editAccount = (params) => post("/account/editAccount",params)
//删除公告
export const removeAccount = (params) => get("/account/removeAccount",params)

//-------------------------------日志---------------------------------------
// 查询登录日志
export const getLogPage = (params) => post("/loginLog/getLogPage",params)
// 删除登录日志
export const removeLog = (params) => get("/loginLog/removeLog",params)
// 清空登录日志
export const clearLog = () => get("/loginLog/clearLog")
// 查询操作日志
export const getOperLogPage = (params) => post("/operLog/getLogPage",params)
// 删除操作日志
export const removeOperLog = (params) => get("/operLog/removeLog",params)
// 清空操作日志
export const clearOperLog = () => get("/operLog/clearLog")

//-------------------------------字典---------------------------------------
// 查询字典
export const getDictPage = (params) => post("/dict/getDictPage",params)
// 根据id获取字典
export const getDictById = (params) => get("/dict/getDictById",params)
// 保存字典
export const saveDict = (params) => post("/dict/saveDict",params)
// 编辑字典
export const editDict = (params) => post("/dict/editDict",params)
// 删除字典
export const removeDict = (params) => get("/dict/removeDict",params)
// 根据编码获取字典数据
export const getDictByCode = (params) => get("/dict/getDictByCode",params)
// 根据编码获取字典数据和标签获取值
export const getDictByCodeAndLabel = (params) => get("/dict/getDictByCodeAndLabel",params)
// 查询全部字典类型
export const getDictTypeList = () => get("/dict/getDictTypeList")

//-------------------------------代码生成---------------------------------------
// 查询代码生成列表
export const getGenPage = (params) => post("/genTable/getGenPage",params)
// 根据id获取代码生成
export const getGenById = (params) => get("/genTable/getGenById",params)
// 保存代码生成
export const saveGen = (params) => get("/genTable/saveGen",params)
// 编辑代码生成
export const editGen = (params) => post("/genTable/editGen",params)
// 删除代码生成
export const removeGen = (params) => get("/genTable/removeGen",params)
// 获取数据库表
export const getTables = (params) => post("/genTable/getTables",params)
// 同步生成表和字段
export const syncTableAndColumns = (params) => get("/genTable/syncTableAndColumns",params)
//预览
export const preview = (params) => get("/genTable/preview",params)

//-------------------------------学校表---------------------------------------
//查询学校表
export const getSchoolPage = (params) => post("/school/getSchoolPage",params)
//获取学校列表
export const getSchoolList = () => get("/school/getSchoolList")
//根据id查询学校表
export const getSchoolById = (params) => get("/school/getSchoolById",params)
//保存学校表
export const saveSchool = (params) => post("/school/saveSchool",params)
//更新学校表
export const editSchool = (params) => post("/school/editSchool",params)
//删除School
export const removeSchool = (params) => get("/school/removeSchool",params)

//-------------------------------专业表---------------------------------------
//查询专业表
export const getMajorPage = (params) => post("/major/getMajorPage",params)
//获取专业列表
export const getMajorList = () => get("/major/getMajorList")
//根据id查询专业表
export const getMajorById = (params) => get("/major/getMajorById",params)
//保存专业表
export const saveMajor = (params) => post("/major/saveMajor",params)
//更新专业表
export const editMajor = (params) => post("/major/editMajor",params)
//删除Major
export const removeMajor = (params) => get("/major/removeMajor",params)

//-------------------------------留言表---------------------------------------
//查询留言表
export const getMessagePage = (params) => post("/message/getMessagePage",params)
//根据id查询留言表
export const getMessageById = (params) => get("/message/getMessageById",params)
//保存留言表
export const saveMessage = (params) => post("/message/saveMessage",params)
//更新留言表
export const editMessage = (params) => post("/message/editMessage",params)
//删除Message
export const removeMessage = (params) => get("/message/removeMessage",params)

//-------------------------------课程---------------------------------------
//查询课程
export const getTaskPage = (params) => post("/task/getTaskPage",params)
//查询课程列表
export const getTaskList = (params) => get("/task/getTaskList",params)
//根据id查询课程
export const getTaskById = (params) => get("/task/getTaskById",params)
//保存课程
export const saveTask = (params) => post("/task/saveTask",params)
//更新课程
export const editTask = (params) => post("/task/editTask",params)
//删除Task
export const removeTask = (params) => get("/task/removeTask",params)

//-------------------------------分类---------------------------------------
//查询分类
export const getClassificationPage = (params) => post("/classification/getClassificationPage",params)
//获取分类列表
export const getClassificationList = () => get("/classification/getClassificationList")
//根据id查询分类
export const getClassificationById = (params) => get("/classification/getClassificationById",params)
//保存分类
export const saveClassification = (params) => post("/classification/saveClassification",params)
//更新分类
export const editClassification = (params) => post("/classification/editClassification",params)
//删除Classification
export const removeClassification = (params) => get("/classification/removeClassification",params)

//-------------------------------章节---------------------------------------
//查询章节
export const getChapterPage = (params) => post("/chapter/getChapterPage",params)
//根据id查询章节
export const getChapterById = (params) => get("/chapter/getChapterById",params)
//保存章节
export const saveChapter = (params) => post("/chapter/saveChapter",params)
//更新章节
export const editChapter = (params) => post("/chapter/editChapter",params)
//删除Chapter
export const removeChapter = (params) => get("/chapter/removeChapter",params)

//-------------------------------作业---------------------------------------
//查询作业
export const getHomeworkPage = (params) => post("/homework/getHomeworkPage",params)
//根据id查询作业
export const getHomeworkById = (params) => get("/homework/getHomeworkById",params)
//保存作业
export const saveHomework = (params) => post("/homework/saveHomework",params)
//更新作业
export const editHomework = (params) => post("/homework/editHomework",params)
//删除Homework
export const removeHomework = (params) => get("/homework/removeHomework",params)

//-------------------------------笔记---------------------------------------
//查询笔记
export const getArticlePage = (params) => post("/article/getArticlePage",params)
//根据id查询笔记
export const getArticleById = (params) => get("/article/getArticleById",params)
//保存笔记
export const saveArticle = (params) => post("/article/saveArticle",params)
//更新笔记
export const editArticle = (params) => post("/article/editArticle",params)
//删除Article
export const removeArticle = (params) => get("/article/removeArticle",params)

//-------------------------------考试---------------------------------------
//查询考试
export const getTestPage = (params) => post("/test/getTestPage",params)
//根据id查询考试
export const getTestById = (params) => get("/test/getTestById",params)
//保存考试
export const saveTest = (params) => post("/test/saveTest",params)
//更新考试
export const editTest = (params) => post("/test/editTest",params)
//删除Test
export const removeTest = (params) => get("/test/removeTest",params)

//-------------------------------考试题目---------------------------------------
//查询考试题目
export const getTestItemPage = (params) => post("/item/getTestItemPage",params)
//根据id查询考试题目
export const getTestItemById = (params) => get("/item/getTestItemById",params)
//保存考试题目
export const saveTestItem = (params) => post("/item/saveTestItem",params)
//更新考试题目
export const editTestItem = (params) => post("/item/editTestItem",params)
//删除TestItem
export const removeTestItem = (params) => get("/item/removeTestItem",params)

//-------------------------------课程报名---------------------------------------
//查询课程报名
export const getApeTaskStudentPage = (params) => post("/student/getApeTaskStudentPage",params)
//根据id查询课程报名
export const getTaskStudentById = (params) => get("/student/getTaskStudentById",params)
//保存课程报名
export const saveTaskStudent = (params) => post("/student/saveTaskStudent",params)
//更新课程报名
export const editTaskStudent = (params) => post("/student/editTaskStudent",params)
//删除TaskStudent
export const removeTaskStudent = (params) => get("/student/removeTaskStudent",params)

//-------------------------------课程评论---------------------------------------
//查询课程评论
export const getTaskCommentPage = (params) => post("/comment/getTaskCommentPage",params)
//根据id查询课程评论
export const getTaskCommentById = (params) => get("/comment/getTaskCommentById",params)
//保存课程评论
export const saveTaskComment = (params) => post("/comment/saveTaskComment",params)
//更新课程评论
export const editTaskComment = (params) => post("/comment/editTaskComment",params)
//删除TaskComment
export const removeTaskComment = (params) => get("/comment/removeTaskComment",params)

//-------------------------------笔记评论---------------------------------------
//查询笔记评论
export const getArticleCommentPage = (params) => post("/articleComment/getArticleCommentPage",params)
//根据id查询笔记评论
export const getArticleCommentById = (params) => get("/articleComment/getArticleCommentById",params)
//保存笔记评论
export const saveArticleComment = (params) => post("/articleComment/saveArticleComment",params)
//更新笔记评论
export const editArticleComment = (params) => post("/articleComment/editArticleComment",params)
//删除ArticleComment
export const removeArticleComment = (params) => get("/articleComment/removeArticleComment",params)
//获取作业完成标志
export const getHomeworkStudentFlag = (params) => get("/student/getHomeworkStudentFlag",params)
//获取学生
export const getTaskStudentPage = (params) => post("/student/getTaskStudentPage",params)
//获取阅卷列表
export const getTestStudent = (params) => post("/test/getTestStudent",params)
//获取阅卷题目
export const getTestStudentItem = (params) => get("/student/getTestStudentItem",params)
//修改阅卷内容
export const editTestStudent = (params) => post("/student/editTestStudent",params)
//获取学生学习情况
export const getAdoptTaskStudent = (params) => post("/student/getAdoptTaskStudent",params)
export const getIndexData = (params) => get("/index/getIndexData",params)
export const getIndexSexData = (params) => get("/index/getIndexSexData",params)
export const getTaskChart = (params) => get("/index/getTaskChart",params)
export const getTaskIndexList = (params) => get("/index/getTaskIndexList",params)
//获取教师课程列表
export const getTaskByTeacherId = (params) => get("/task/getTaskByTeacherId",params)

//-------------------------------论坛---------------------------------------
//查询论坛
export const getForumPage = (params) => post("/forum/getForumPage",params)
//根据id查询论坛
export const getForumById = (params) => get("/forum/getForumById",params)
//保存论坛
export const saveForum = (params) => post("/forum/saveForum",params)
//更新论坛
export const editForum = (params) => post("/forum/editForum",params)
//删除Forum
export const removeForum = (params) => get("/forum/removeForum",params)

//-------------------------------论坛讨论---------------------------------------
//查询论坛讨论
export const getForumItemPage = (params) => post("/item/getForumItemPage",params)
//根据id查询论坛讨论
export const getForumItemById = (params) => get("/item/getForumItemById",params)
//保存论坛讨论
export const saveForumItem = (params) => post("/item/saveForumItem",params)
//更新论坛讨论
export const editForumItem = (params) => post("/item/editForumItem",params)
//删除ForumItem
export const removeForumItem = (params) => get("/item/removeForumItem",params)

//-------------------------------答疑---------------------------------------
//查询答疑
export const getQuestionPage = (params) => post("/question/getQuestionPage",params)
//根据id查询答疑
export const getQuestionById = (params) => get("/question/getQuestionById",params)
//保存答疑
export const saveQuestion = (params) => post("/question/saveQuestion",params)
//更新答疑
export const editQuestion = (params) => post("/question/editQuestion",params)
//删除Question
export const removeQuestion = (params) => get("/question/removeQuestion",params)


//-------------------------------资料上传---------------------------------------
export const upload = uploadTemplate;

// 上传模板
export function uploadTemplate(data) {
  return request({
    url: '/template/update',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data' 
    }
  });
}

// 获取模板列表
export function getTemplates(params) {
  return request({
    url: '/template/show',
    method: 'get',
    params: params
  })
}

// 删除模板
export function deleteTemplate(ids) {
  return request({
    url: '/template/delete',
    method: 'post',
    data: ids,
    // 可以在这里覆盖全局 headers（如果有特殊需求）
    headers: { 
      'Content-Type': 'application/json' 
    }
  })
}

// 获取模板内容
export function getTemplateContent(params) {
  return request({
    url: '/template/content',
    method: 'get',
    params: params
  })
}

//-------------------------------AI阅卷---------------------------------------

export function aiGrading(papers) {
  return axios.post('/ai/grades', papers)
}

export function aiChat(message) {
  return axios.get('/ai/chat', { params: { key: message } })
}


//-------------------------------教师主页图表---------------------------------------

// 获取成绩分布数据
export function getScoreDistribution(params) {
    return request({
        url: '/index/score-distribution',
        method: 'get',
        params
    });
}

// 获取课程资源分布数据
export function getCourseResourceDistribution(params) {
    return request({
        url: '/index/resource-distribution',
        method: 'get',
        params
    });
}

//-------------------------------未审核教师---------------------------------------


// 获取未审核教师列表
export const getUnreadTeachers = () => {
  return request({
    url: '/user/unread',
    method: 'get'
  })
}

// 审核通过教师
export const approveTeacher = (userName) => {
  return request({
    url: '/user/checked',
    method: 'post',
    params: { userName },  // 改为使用params传递参数
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

//-------------------------------课程审核红点---------------------------------------

//这个是课程列表内学生的红点
export const getTaskStudentUnread = (params) => {
  return get("/student/unread", { 
    taskName: params.taskName || params.taskId 
  }).then(res => {
    // 统一返回数组格式
    if (res.code === 1000) {
      if (!Array.isArray(res.data)) {
        return { ...res, data: res.data ? [res.data] : [] };
      }
    }
    return res;
  });
};

export const checkTaskStudent = (params) => post("/student/checked", {
  taskName: params.taskName || params.taskId,
  userName: params.userName
});
