<template>
    <div>
        <el-row :gutter="20" class="index-top">
            <!-- 第一张卡片 - 跳转到/teacherTask -->
            <el-col :span="6">
                <div class="grid-content bg-purple">
                    <el-card 
                        shadow="always" 
                        class="dashboard-card card-1"
                        @click.native="toTeacherTask()"
                        :body-style="{ padding: '0', cursor: 'pointer', overflow: 'hidden' }">
                        <div class="card-folder-edge"></div>
                        <div class="card-content">
                            <div class="item-01-top">
                                <img src="../../../assets/image/index-01.png" class="card-icon">
                                <div class="item-01-top-center">
                                    <div class="card-title">课程管理</div>
                                    <div class="card-value">{{top.userNum}}门</div>
                                </div>
                            </div>
                            <div class="card-footer">
                                <span>查看详情</span>
                                <i class="el-icon-arrow-right"></i>
                            </div>
                        </div>
                    </el-card>
                </div>
            </el-col>
            
            <!-- 第二张卡片 - 跳转到/teacherChapter -->
            <el-col :span="6">
                <div class="grid-content bg-purple">
                    <el-card 
                        shadow="always" 
                        class="dashboard-card card-2"
                        @click.native="toTeacherChapter()"
                        :body-style="{ padding: '0', cursor: 'pointer', overflow: 'hidden' }">
                        <div class="card-folder-edge"></div>
                        <div class="card-content">
                            <div class="item-01-top">
                                <img src="../../../assets/image/index-02.png" class="card-icon">
                                <div class="item-01-top-center">
                                    <div class="card-title">章节管理</div>
                                    <div class="card-value">{{top.studentNum}}章</div>
                                </div>
                            </div>
                            <div class="card-footer">
                                <span>查看详情</span>
                                <i class="el-icon-arrow-right"></i>
                            </div>
                        </div>
                    </el-card>
                </div>
            </el-col>
            
            <!-- 第三张卡片 - 跳转到/teacherTest -->
            <el-col :span="6">
                <div class="grid-content bg-purple">
                    <el-card 
                        shadow="always" 
                        class="dashboard-card card-3"
                        @click.native="toTeacherTest()"
                        :body-style="{ padding: '0', cursor: 'pointer', overflow: 'hidden' }">
                        <div class="card-folder-edge"></div>
                        <div class="card-content">
                            <div class="item-01-top">
                                <img src="../../../assets/image/avator.png" class="card-icon">
                                <div class="item-01-top-center">
                                    <div class="card-title">测试管理</div>
                                    <div class="card-value">{{top.teacherNum}}个</div>
                                </div>
                            </div>
                            <div class="card-footer">
                                <span>查看详情</span>
                                <i class="el-icon-arrow-right"></i>
                            </div>
                        </div>
                    </el-card>
                </div>
            </el-col>
            
            <!-- 第四张卡片 - 跳转到/question -->
            <el-col :span="6">
                <div class="grid-content bg-purple">
                    <el-card 
                        shadow="always" 
                        class="dashboard-card card-4"
                        @click.native="toQuestion()"
                        :body-style="{ padding: '0', cursor: 'pointer', overflow: 'hidden' }">
                        <div class="card-folder-edge"></div>
                        <div class="card-content">
                            <div class="item-01-top">
                                <img src="../../../assets/image/index-05.png" class="card-icon">
                                <div class="item-01-top-center">
                                    <div class="card-title">答疑管理</div>
                                    <div class="card-value">疑问</div>
                                </div>
                            </div>
                            <div class="card-footer">
                                <span>查看详情</span>
                                <i class="el-icon-arrow-right"></i>
                            </div>
                        </div>
                    </el-card>
                </div>
            </el-col>
        </el-row>
        
        <el-row :gutter="20" class="index-center">
            <el-col :span="16">
                <el-card shadow="always" class="item-07">
                    <div id="chart">

                    </div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="always" class="item-08">
                    <div id="pie-chart">

                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20" class="index-center-01">
            <el-col :span="24">
                <el-card shadow="always" class="item-09">
                    <el-table
                            :data="taskList"
                            :header-cell-style="{
              'color': '#4A2B90',
              'background-color': '#ECE9F4',
            }"
                            :row-style="{
              'color': '#888897',
              'font-size': '15px',
              'font-family':'黑体'
            }"
                            stripe
                            style="width: 100%">
                        <el-table-column
                                prop="name"
                                label="课程名称"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="teacherName"
                                label="教师"
                        >
                            <template slot-scope="scope">
                                <div style="display:flex;align-items: center">
                                    <img style="width:35px;height:35px" src="../../../assets/image/avator.png">
                                    <div style="margin-left:10px">{{scope.row.teacherName}}</div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="major"
                                label="专业">
                            <template slot-scope="scope">
                                <el-button size="mini" type="primary">{{scope.row.major}}</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="classification"
                                label="课程分类">
                            <template slot-scope="scope">
                                <el-button size="mini" type="primary">{{scope.row.classification}}</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="num"
                                label="学生数量">
                        </el-table-column>
                        <el-table-column
                                prop="createTime"
                                label="创建时间">
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20" class="index-under">
            <el-col :span="16">
                <el-card shadow="always" class="item-10">
                    <div style="width:100%;height:50px;display:flex;justify-content: space-between">
                        <span>课程 列表</span>
                        <el-button style="height:35px;background:#8470D1" size="mini" type="primary" @click="toTask()">查看全部</el-button>
                    </div>
                    <div style="width:100%;height:260px">
                        <el-row>
                            <el-col class="item-10-item" :span="7" v-for="(item,index) in taskCard" :key="index">
                                <img :src="$store.state.configure.HOST + item.image" style="border-radius: 20px;width:90%">
                                <div>{{item.name}}</div>
                                <div style="width:90%;display:flex;justify-content: space-around;">
                                    <div style="height:35px;font-size:13px;display:flex;align-items:center"><span>{{item.createTime}}</span>
                                    </div>
                                    <el-button size="mini" style="height:30px" type="danger">{{item.teacherName}}</el-button>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="always" class="item-11">
                    <el-calendar v-model="today">
                    </el-calendar>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import {getIndexData,getIndexSexData,getTaskChart,getTaskIndexList} from '../../../api/api'
import * as echarts from "echarts";
export default {
    data() {
        return{
            top: {},
            sex: [],
            tasks: [],
            nums: [],
            taskList: [],
            taskCard: [],
            today: new Date(),
            myChart: "",
            pieChart: "",
        }
    },
    methods: {
                // 新增的四个跳转方法
        toTeacherTask() {
            this.$router.push("/teacherTask");
            this.setActiveMenu("/teacherTask", "课程管理");
        },
        toTeacherChapter() {
            this.$router.push("/teacherChapter");
            this.setActiveMenu("/teacherChapter", "章节管理");
        },
        toTeacherTest() {
            this.$router.push("/teacherTest");
            this.setActiveMenu("/teacherTest", "测试管理");
        },
        toQuestion() {
            this.$router.push("/question");
            this.setActiveMenu("/question", "题库管理");
        },
        
        // 公共方法设置激活菜单
        setActiveMenu(path, name) {
            const param = {
                "name": name,
                "url": path
            }
            this.$store.commit('menu/addActiveMenu', param);
            this.$store.commit('menu/setActiveMenu', path);
        },
        toTask() {
            var param = {
                "name": "教师课程管理",
                "url": "/task"
            }
            this.$store.commit('menu/addActiveMenu', param)
            this.$router.push("/teacherTask")
            this.$store.commit('menu/setActiveMenu', "/teacherTask")
        },
        toStudent() {
            var param = {
                "name": "学生管理",
                "url": "/student"
            }
            this.$store.commit('menu/addActiveMenu', param)
            this.$router.push("/student")
            this.$store.commit('menu/setActiveMenu', "/student")
        },
        toTeacher() {
            var param = {
                "name": "教师管理",
                "url": "/teacher"
            }
            this.$store.commit('menu/addActiveMenu', param)
            this.$router.push("/teacher")
            this.$store.commit('menu/setActiveMenu', "/teacher")
        }
    },
    created() {

    },
    mounted() {
        getIndexData({type:1}).then(res => {
            if (res.code == 1000) {
                this.top = res.data
            }
        })
        getIndexSexData({type:1}).then(res => {
            if (res.code == 1000) {
                this.sex  =res.data
                this.pieChart = echarts.init(document.getElementById("pie-chart"))
                var optionPie = {
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        center: 'center'
                    },
                    series: [
                        {
                            name: '学生性别分析',
                            type: 'pie',
                            radius: '50%',
                            data: this.sex,
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };
                this.pieChart.setOption(optionPie)
            }
        })
        getTaskChart({type:1}).then(res => {
            if (res.code == 1000) {
                this.tasks = res.data.tasks
                this.nums = res.data.nums
                this.myChart = echarts.init(document.getElementById("chart"))
                var option = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['学生数量', '学生数量']
                    },
                    backgroundColor: '#fff',
                    xAxis: [{
                        type: 'category',
                        color: '#59588D',
                        data: this.tasks,
                        axisLine: {
                            lineStyle: {
                                color: 'rgba(107,107,107,0.37)',
                            }
                        },
                        axisTick: {
                            show: true
                        },
                    }],
                    yAxis: [{
                        axisLine: {
                            lineStyle: {
                                color: 'rgba(107,107,107,0.37)',
                            }
                        },
                        axisTick: {
                            show: true
                        },
                        splitLine: {
                            lineStyle: {
                                color: 'rgba(131,101,101,0.2)',
                                type: 'dashed',
                            }
                        }
                    }],
                    series: [{
                        data: this.nums,
                        type: 'line',
                        name: '折线图',
                        symbol: 'none',
                        areaStyle: {
                            color: "#E6F8EE"
                        },
                        lineStyle: {
                            color: '#3AC977',
                            width: 2,
                            shadowColor: 'rgba(0, 0, 0, 0.3)',//设置折线阴影
                            shadowBlur: 15,
                            shadowOffsetY: 20,
                        },
                        zlevel: 1
                    },{
                        type: 'bar',
                        data: this.nums,
                        barWidth: '15px',
                        name: '柱状图',
                        itemStyle: {
                            normal: {
                                color: function(params){//展示正值的柱子，负数设为透明
                                    let colorArr = params.value > 0?['#7866BE', '#7866BE']:['rgba(0,0,0,0)', 'rgba(0,0,0,0)']
                                    return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: colorArr[0] // 0% 处的颜色
                                    }, {
                                        offset: 1,
                                        color:  colorArr[1]// 100% 处的颜色
                                    }], false)
                                },
                                barBorderRadius: [30,30,0,0]
                            },
                        },
                        label: {
                            normal: {
                                show: true,
                                fontSize: 13,
                                color: '#333',
                                position: 'top',
                            }
                        },
                        zlevel: 2
                    }
                    ]
                };
                this.myChart.setOption(option);
            }
        })
        getTaskIndexList({type:1}).then(res => {
            if (res.code == 1000) {
                this.taskList = res.data.slice(0,5)
                this.taskCard = res.data.slice(0,3)
            }
        })
        var that = this
        window.onresize = function () {
          if (that.myChart && typeof that.myChart.resize === 'function') {
            that.myChart.resize()
          }
          if (that.pieChart && typeof that.pieChart.resize === 'function') {
            that.pieChart.resize()
          }
        }
    }
}
</script>

<style scoped>
.index-top {
    margin-bottom: 20px;
    height: 210px;
}
.item-01 {
    
    display: flex;
    align-items: center;
    padding: 10px 0;
    border-radius: 8px;
    height: 170px;
    background-color: #452B90;
}
.item-02 {
    border-radius: 8px;
    margin-top: 20px;
    height: 90px;
    background-color: #ffffff;
}
.item-03 {
    border-radius: 8px;
    height: 170px;
    background-color: #ffffff;
}
.item-04 {
    border-radius: 8px;
    margin-top: 20px;
    height: 90px;
    background-color: #ffffff;
}
.item-05 {
    border-radius: 8px;
    height: 170px;
    background-color: #F8B940;
    background-size: 100% 100%;
    color: #ffffff;
}
.item-06 {
    border-radius: 8px;
    height: 170px;
    background-color: #ffffff;
}
.index-center {
    margin-top: 20px;
    height: 400px;
}
.item-07 {
    border-radius: 8px;
    height: 400px;
    background-color: #ffffff;
}
.item-08 {
    border-radius: 8px;
    height: 400px;
    background-color: #ffffff;
}
.index-center-01 {
    margin-top: 20px;
    height: 300px;
}
.item-09 {
    border-radius: 8px;
    height: 300px;
    background-color: #ffffff;
    overflow: scroll;
}
.index-under {
    margin-top: 20px;
    height: 400px;
}
.item-10 {
    border-radius: 8px;
    height: 350px;
    background-color: #ffffff;
}
.item-11 {
    border-radius: 8px;
    height: 450px;
    background-color: #ffffff;
}
.item-01-top {
    height: 90px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
}
.item-01-top-center {
    margin-left: 15px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}
.item-01-under {
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 60px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}
.item-06-top {
    display: flex;
    justify-content: center;
}
.item-06-under {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.item-05-top {
    display: flex;
    flex-direction: column;
    align-items: center;
}
#chart,#pie-chart {
    width: 100%;
    height: 380px;
}
.item-09::-webkit-scrollbar {
    width: 0px;
    height: 0px;
}
.el-row {
    width: 100%;
    height: 100%;
}
.item-10-item {
    border: 1px solid #E5E5E5;
    border-radius: 20px;
    height: 100%;
    margin: 0 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
}
/deep/ .el-calendar-day {
    height: 45px !important;
    border: none;
}
/* 鼠标悬停颜色加深 */
/* 新增卡片样式 */
.dashboard-card {
    transition: all 0.3s ease;
    border-radius: 10px;
    border: none;
    position: relative;
    overflow: hidden;
}

.card-content {
    padding: 20px;
    position: relative;
    z-index: 2;
}

.card-folder-edge {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 8px;
    z-index: 1;
    transition: all 0.3s ease;
}

.card-icon {
    width: 70px;
    height: 70px;
    transition: all 0.3s ease;
}

.card-title {
    color: #4A2B90;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
}

.card-value {
    color: #4A2B90;
    font-size: 28px;
    font-weight: bold;
}

.card-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 15px;
    color: #4A2B90;
    font-size: 14px;
    transition: all 0.3s ease;
}

.card-footer i {
    margin-left: 5px;
    transition: all 0.3s ease;
}

/* 卡片1 - 淡紫色 */
.card-1 {
    background-color: #F0EBFA;
}
.card-1 .card-folder-edge {
    background-color: #8A6AE4;
}
.card-1:hover {
    background-color: #D8C7F5;
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(138, 106, 228, 0.2) !important;
}
.card-1:hover .card-folder-edge {
    width: 12px;
    background-color: #6A3DC8;
}
.card-1:hover .card-icon {
    transform: scale(1.1);
}
.card-1:hover .card-footer {
    color: #6A3DC8;
}
.card-1:hover .card-footer i {
    transform: translateX(5px);
}

/* 卡片2 - 淡蓝色 */
.card-2 {
    background-color: #E8F4FE;
}
.card-2 .card-folder-edge {
    background-color: #4A90E2;
}
.card-2:hover {
    background-color: #C3E3FD;
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(74, 144, 226, 0.2) !important;
}
.card-2:hover .card-folder-edge {
    width: 12px;
    background-color: #2A7BD6;
}
.card-2:hover .card-icon {
    transform: scale(1.1);
}
.card-2:hover .card-footer {
    color: #2A7BD6;
}
.card-2:hover .card-footer i {
    transform: translateX(5px);
}

/* 卡片3 - 淡绿色 */
.card-3 {
    background-color: #E8F8F0;
}
.card-3 .card-folder-edge {
    background-color: #4CAF50;
}
.card-3:hover {
    background-color: #C3EBD6;
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(76, 175, 80, 0.2) !important;
}
.card-3:hover .card-folder-edge {
    width: 12px;
    background-color: #3D8B40;
}
.card-3:hover .card-icon {
    transform: scale(1.1);
}
.card-3:hover .card-footer {
    color: #3D8B40;
}
.card-3:hover .card-footer i {
    transform: translateX(5px);
}

/* 卡片4 - 淡橙色 */
.card-4 {
    background-color: #FEF0E8;
}
.card-4 .card-folder-edge {
    background-color: #FF7043;
}
.card-4:hover {
    background-color: #FDD8C3;
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(255, 112, 67, 0.2) !important;
}
.card-4:hover .card-folder-edge {
    width: 12px;
    background-color: #F4511E;
}
.card-4:hover .card-icon {
    transform: scale(1.1);
}
.card-4:hover .card-footer {
    color: #F4511E;
}
.card-4:hover .card-footer i {
    transform: translateX(5px);
}

.item-01-top {
    height: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}

.item-01-top-center {
    margin-left: 15px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
</style>
