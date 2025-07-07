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
        
        <!-- 中间图表区 - 修改后的版本 -->
        <el-row :gutter="20" class="index-center">
            <!-- 左侧图表 - 替换为教学进度与成绩分布组合图 -->
            <el-col :span="16">
                <el-card shadow="always" class="item-07">
                    <div class="chart-header">
                        <span>教学进度与成绩分析</span>
                        <el-select v-model="courseSelect" placeholder="选择课程" size="mini">
                            <el-option
                                v-for="item in courses"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div id="progress-chart" style="width:100%;height:360px"></div>
                </el-card>
            </el-col>
            
            <!-- 右侧图表 - 替换为课程资源旭日图 -->
            <el-col :span="8">
                <el-card shadow="always" class="item-08">
                    <div class="chart-header">
                        <span>课程资源分布</span>
                    </div>
                    <div id="resource-chart" style="width:100%;height:360px"></div>
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
                        courseSelect: '',
            courses: [
                { value: '1', label: '计算机科学导论' },
                { value: '2', label: '数据结构与算法' },
                { value: '3', label: '数据库系统原理' }
            ],
            progressChart: null,
            resourceChart: null
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
        },
        initProgressChart() {
            this.progressChart = echarts.init(document.getElementById("progress-chart"));
            
            // 模拟数据 - 实际应从API获取
            const option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        }
                    }
                },
                legend: {
                    data: ['计划进度', '实际进度', '平均成绩']
                },
                grid: [
                    {
                        top: '15%',
                        height: '30%'
                    },
                    {
                        top: '55%',
                        height: '30%'
                    }
                ],
                xAxis: [
                    {
                        type: 'category',
                        data: ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周', '第7周'],
                        axisPointer: {
                            type: 'shadow'
                        },
                        gridIndex: 0
                    },
                    {
                        type: 'category',
                        data: ['0-59', '60-69', '70-79', '80-89', '90-100'],
                        gridIndex: 1
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '进度(%)',
                        min: 0,
                        max: 100,
                        gridIndex: 0
                    },
                    {
                        type: 'value',
                        name: '人数',
                        gridIndex: 1
                    }
                ],
                series: [
                    {
                        name: '计划进度',
                        type: 'line',
                        smooth: true,
                        data: [15, 30, 45, 60, 75, 90, 100],
                        lineStyle: {
                            color: '#8884d8',
                            width: 3,
                            type: 'dashed'
                        },
                        itemStyle: {
                            color: '#8884d8'
                        },
                        xAxisIndex: 0,
                        yAxisIndex: 0
                    },
                    {
                        name: '实际进度',
                        type: 'line',
                        smooth: true,
                        data: [10, 25, 40, 50, 65, 80, 95],
                        lineStyle: {
                            color: '#82ca9d',
                            width: 3
                        },
                        itemStyle: {
                            color: '#82ca9d'
                        },
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset: 0,
                                    color: 'rgba(130, 202, 157, 0.3)'
                                },
                                {
                                    offset: 1,
                                    color: 'rgba(130, 202, 157, 0.1)'
                                }
                            ])
                        },
                        xAxisIndex: 0,
                        yAxisIndex: 0
                    },
                    {
                        name: '成绩分布',
                        type: 'bar',
                        barWidth: '60%',
                        data: [2, 4, 10, 15, 8],
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: '#83bff6' },
                                { offset: 0.5, color: '#188df0' },
                                { offset: 1, color: '#188df0' }
                            ])
                        },
                        xAxisIndex: 1,
                        yAxisIndex: 1
                    }
                ]
            };
            
            this.progressChart.setOption(option);
        },
        
        initResourceChart() {
            this.resourceChart = echarts.init(document.getElementById("resource-chart"));
            
            // 模拟数据 - 实际应从API获取
            const option = {
                title: {
                    text: '资源类型分布',
                    left: 'center',
                    top: 10
                },
                series: {
                    name: '资源分布',
                    type: 'sunburst',
                    data: [{
                        name: '课程资源',
                        children: [
                            {
                                name: '教学视频',
                                value: 35,
                                itemStyle: { color: '#5470c6' }
                            },
                            {
                                name: '课件资料',
                                value: 25,
                                itemStyle: { color: '#91cc75' }
                            },
                            {
                                name: '测试题库',
                                value: 20,
                                itemStyle: { color: '#fac858' }
                            },
                            {
                                name: '阅读材料',
                                value: 15,
                                itemStyle: { color: '#ee6666' }
                            },
                            {
                                name: '其他资源',
                                value: 5,
                                itemStyle: { color: '#73c0de' }
                            }
                        ]
                    }],
                    radius: [0, '90%'],
                    label: {
                        rotate: 'radial'
                    },
                    levels: [
                        {},
                        {
                            r0: '15%',
                            r: '45%',
                            itemStyle: {
                                borderWidth: 2
                            },
                            label: {
                                rotate: 'tangential'
                            }
                        },
                        {
                            r0: '45%',
                            r: '80%',
                            label: {
                                align: 'right'
                            }
                        },
                        {
                            r0: '80%',
                            r: '82%',
                            label: {
                                position: 'outside',
                                padding: 3,
                                silent: false
                            },
                            itemStyle: {
                                borderWidth: 3
                            }
                        }
                    ]
                }
            };
            
            this.resourceChart.setOption(option);
        }
    },
    created() {

    },
    mounted() {
        this.initProgressChart();
        this.initResourceChart();
        
        // 窗口大小变化时重绘图表
        window.addEventListener('resize', () => {
            this.progressChart && this.progressChart.resize();
            this.resourceChart && this.resourceChart.resize();
        });
    },
    beforeDestroy() {
        window.removeEventListener('resize', () => {
            this.progressChart && this.progressChart.resize();
            this.resourceChart && this.resourceChart.resize();
        });
    },
    mounted() {
        this.initProgressChart();
        this.initResourceChart();

        // 获取首页顶部数据
        getIndexData({type:1}).then(res => {
            if (res.code == 1000) {
                this.top = res.data
            }
        });

        // 获取学生性别数据
        getIndexSexData({type:1}).then(res => {
            if (res.code == 1000) {
                this.sex  = res.data
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
        });

        // 获取任务图表数据
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
        });

        // 获取任务列表数据
        getTaskIndexList({type:1}).then(res => {
            if (res.code == 1000) {
                this.taskList = res.data.slice(0,5)
                this.taskCard = res.data.slice(0,3)
            }
        });

        // 窗口大小变化时重绘图表
        window.addEventListener('resize', () => {
            this.progressChart && this.progressChart.resize();
            this.resourceChart && this.resourceChart.resize();
            if (this.myChart && typeof this.myChart.resize === 'function') {
                this.myChart.resize()
            }
            if (this.pieChart && typeof this.pieChart.resize === 'function') {
                this.pieChart.resize()
            }
        });
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

.chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    border-bottom: 1px solid #eee;
    margin-bottom: 10px;
}

.chart-header span {
    font-weight: bold;
    color: #4A2B90;
}
</style>
