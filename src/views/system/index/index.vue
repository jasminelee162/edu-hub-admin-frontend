<template>
    <div>
        <el-row :gutter="20" class="index-top">
            <!-- 第一行 -->
            <el-col :span="6">
                <div class="grid-content bg-purple">
                    <el-card shadow="always" class="item-01">
                        <!-- 用户数量 -->
                        <div class="item-01-top">
                            <img src="../../../assets/image/index-01.png" style="width:110px">
                            <div class="item-01-top-center">
                                <div style="color:#ffffff;font-size:20px;font-weight:bold">用户数量</div>
                                <div style="color:#ffffff;font-size:30px;font-weight:bold">{{top.userNum}}人</div>
                            </div>
                        </div>
                        <div class="item-01-under">
                            <!-- <div style="color:#B1B7EA;font-size:14px;font-weight:bold">查看用户列表</div> -->
                            <!-- <i class="el-icon-right" style="color:#B1B7EA;font-size:14px;font-weight:bold"></i> -->
                        </div>
                    </el-card>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple">
                    <el-card shadow="always" class="item-03">
                        <div class="item-01-top">
                            <img src="../../../assets/image/index-02.png" style="width:110px">
                            <div class="item-01-top-center">
                                <div style="color:#000000;font-size:20px;font-weight:bold">学生数量</div>
                                <div style="color:#000000;font-size:30px;font-weight:bold">{{top.studentNum}}人</div>
                            </div>
                        </div>
                        <div class="item-01-under" @click="toStudent()" 
                             style="cursor: pointer; transition: all 0.3s;">
                            <div style="color:black;font-size:14px;font-weight:bold;text-decoration: underline; text-underline-offset: 3px; ">查看全部</div>
                            <i class="el-icon-right" style="color:black;font-size:14px;font-weight:bold"></i>
                        </div>
                    </el-card>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple">
                    <el-card shadow="always" class="item-05">
                        <div class="item-01-top">
                            <img src="../../../assets/image/avator.png" style="width:110px">
                            <div class="item-01-top-center">
                                <div style="color:#ffffff;font-size:20px;font-weight:bold">教师数量</div>
                                <div style="color:#ffffff;font-size:30px;font-weight:bold">{{top.teacherNum}}人</div>
                            </div>
                        </div>
                        <div class="item-01-under" @click="toTeacher()" 
                             style="cursor: pointer; transition: all 0.3s;">
                            <div style="color:black;font-size:14px;font-weight:bold;text-decoration: underline;text-underline-offset: 3px; /* 控制下划线距离 */">查看全部</div>
                            <i class="el-icon-right" style="color:black;font-size:14px;font-weight:bold"></i>
                        </div>
                    </el-card>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple">
                    <el-card shadow="always" class="item-06">
                        <div class="item-01-top">
                            <img src="../../../assets/image/index-05.png" style="width:110px">
                            <div class="item-01-top-center">
                                <div style="color:#000000;font-size:12px;font-weight:bold;display:flex;align-item:center">
                                    <img src="../../../assets/image/index-06.png" style="width:20px">：puppy03110
                                </div>
                                <div style="color:#000000;font-size:12px;font-weight:bold;display:flex;align-item:center">
                                    <img src="../../../assets/image/index-07.png" style="width:20px">：3204986849
                                </div>
                            </div>
                        </div>
                        <div class="item-01-under">
                            <div style="color:black;font-size:14px;font-weight:bold">联系我们</div>
                            <i class="el-icon-phone-outline" style="color:black;font-size:14px;font-weight:bold"></i>
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
                                    label="专业"
                                    align="center">
                                    <template slot-scope="scope">
                                        <el-button 
                                            size="mini"
                                            style="
                                                background-color: #409EFF; 
                                                color: white;
                                                border-color: #409EFF;
                                                font-weight: bold;
                                                width: 50%;
                                                padding: 4px 0;
                                            ">
                                            {{scope.row.major}}
                                        </el-button>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="classification"
                                    label="课程分类"
                                    align="center">
                                    <template slot-scope="scope">
                                        <el-button 
                                            size="mini" 
                                            style="
                                                background-color: #8470D1;
                                                color: white;
                                                width: 50%;
                                                border-color: #8470D1;
                                                font-weight: bold;
                                            ">
                                            {{scope.row.classification}}
                                        </el-button>
                                    </template>
                        </el-table-column>
                        <el-table-column
                            prop="num"
                            label="学生数量"
                            align="center">
                        </el-table-column>
                        <el-table-column
                            prop="createTime"
                            label="创建时间"
                            align="center">
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
                  <div style="width:100%;height:120px;overflow:hidden;border-radius:20px;margin-bottom:8px">
                    <img
                        :src="$store.state.configure.HOST + item.image"
                        style="width:100%;height:100%;object-fit:cover"
                    >
                  </div>
                  <div>{{item.name}}</div>
                  <div style="width:90%;display:flex;justify-content: space-around;">
                    <div style="height:35px;font-size:13px;display:flex;align-items:center">
                      <span>{{item.createTime}}</span>
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
        toTask() {
            var param = {
                "name": "课程管理",
                "url": "/task"
            }
            this.$store.commit('menu/addActiveMenu', param)
            this.$router.push("/task")
            this.$store.commit('menu/setActiveMenu', "/task")
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
        getIndexData({type:0}).then(res => {
            if (res.code == 1000) {
                this.top = res.data
            }
        })
        getIndexSexData({type:0}).then(res => {
            if (res.code == 1000) {
                this.sex = res.data;
                this.pieChart = echarts.init(document.getElementById("pie-chart"));
                var optionPie = {
                    tooltip: { trigger: 'item' },
                    legend: { 
                        center: 'center',
                        textStyle: { color: '#666' } // 添加图例文字颜色
                    },
                    series: [{
                        name: '学生性别分析',
                        type: 'pie',
                        radius: '50%',
                        data: [
                            {
                                value: this.sex[0].value,
                                name: this.sex[0].name,
                                itemStyle: { 
                                    color: '#8470D1', // 浅紫色（男）
                                    borderWidth: 2,
                                    borderColor: '#fff'
                                }
                            },
                            {
                                value: this.sex[1].value,
                                name: this.sex[1].name,
                                itemStyle: { 
                                    color: '#6A5ACD', // 深紫色（女）
                                    borderWidth: 2,
                                    borderColor: '#fff'
                                }
                            }
                        ],
                        label: { // 添加标签样式
                            color: '#333',
                            fontSize: 14
                        },
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.3)'
                            }
                        }
                    }]
                };
                this.pieChart.setOption(optionPie);
            }
        })
        getTaskChart({type:0}).then(res => {
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
        getTaskIndexList({type:0}).then(res => {
            if (res.code == 1000) {
                this.taskList = res.data.slice(0,5)
                this.taskCard = res.data.slice(0,3)
            }
        })
        var that = this
        window.onresize = function () {
          if (that.myChart && typeof that.myChart.resize === 'function') {
            that.myChart.resize();
          }
          if (that.pieChart && typeof that.pieChart.resize === 'function') {
            that.pieChart.resize();
          }
        }
    }
}
</script>

<style scoped>

/* 防止鼠标变成文本输入符号 */
.item-01-top, 
.item-01-top-center{
  cursor: default !important;
}

/* 图标悬停放大 */
.item-01-under i:hover {
  transform: scale(1.2);
  color: var(--primary-purple); /* 悬停变色 */
}

/* 全局颜色变量 */
:root {
  --primary-purple: #6A5ACD;
  --light-purple: #8470D1;
  --dark-purple: #4B0082;
  --white: #ffffff;
  --light-bg: #F8F8FF;
}

/* 基础布局调整 */
.index-top {
    height: 210px;
    margin-bottom: 20px;
}

/* 卡片统一样式 */
.el-card {
    border-radius: 12px;
    border: none;
    box-shadow: 0 4px 12px rgba(106, 90, 205, 0.1);
}

/* 顶部卡片 */
.item-01 {
    height: 170px;
    background: linear-gradient(135deg, #483D8B, #7B68EE);
    color: var(--white);
}

.item-03, .item-06 {
    height: 170px;
    background: var(--white);
    border: 1px solid rgba(106, 90, 205, 0.1);
}

.item-05 {
    height: 170px;
    background: linear-gradient(135deg, #5F4B8B, #8A2BE2);
    color: var(--white);
}

/* 中间图表区域 */
.index-center {
    margin: 20px 0;
    height: 400px;
    border: 1px solid red !important;
}

.item-07, .item-08 {
    height: 400px;
    background: var(--white);
    border: 1px solid rgba(106, 90, 205, 0.1);
}

/* 表格区域 */
.index-center-01 {
    margin: 20px 0;
    height: 300px;
    border: 1px solid red !important;
}

.item-09 {
    height: 300px;
    background: var(--white);
    border: 1px solid rgba(106, 90, 205, 0.1);
    overflow: scroll;
}

/* 底部区域 */
.index-under {
    margin-top: 20px;
    height: 400px;
    border: 1px solid red !important;
}

.item-10 {
    height: 350px;
    background: var(--white);
    border: 1px solid rgba(106, 90, 205, 0.1);
}

.item-11 {
    border-radius: 8px;
    height: 390px;
    background-color: #ffffff;
}

/* 卡片内部布局 */
.item-01-top {
    height: 90px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
}

.item-01-top-center {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}

.item-01-under {
    height: 60px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    cursor: pointer !important; /* 确保父容器是小手 */
}

/* 课程卡片 */
.item-10-item {
    border: 1px solid rgba(106, 90, 205, 0.2);
    border-radius: 20px;
    height: 100%;
    margin: 0 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    transition: all 0.3s;
}

.item-10-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(106, 90, 205, 0.2);
}

/* 按钮样式 */
.el-button--primary {
    background-color: var(--primary-purple);
    border-color: var(--primary-purple);
}

.el-button--primary:hover {
    background-color: var(--light-purple);
    border-color: var(--light-purple);
}

.el-button--danger {
    background-color: #FF6B6B;
    border-color: #FF6B6B;
}

/* 表格样式 */
.el-table {
    --el-table-header-bg-color: #F0EFFF;
    --el-table-header-text-color: var(--dark-purple);
    --el-table-border-color: rgba(106, 90, 205, 0.1);
}

/* 滚动条隐藏 */
.item-09::-webkit-scrollbar {
    width: 0px;
    height: 0px;
}

/* 图表容器 */
#chart, #pie-chart {
    width: 100%;
    height: 380px;
}

/* 卡片悬停放大效果 */
.grid-content .el-card {
    transition: all 0.3s ease;
    transform-origin: center;
    cursor: pointer;
}

.grid-content .el-card:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2) !important;
}

/* 确保卡片内容不会因为放大而溢出 */
.grid-content {
    overflow: hidden;
    border-radius: 12px;
}

/deep/ .el-calendar-day {
    height: 40px !important;
    border: none;
}

</style>