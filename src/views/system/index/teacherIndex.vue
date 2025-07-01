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
                        <div class="item-01-under" @click="toStudent()">
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
                        <div class="item-01-under" @click="toTeacher()">
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
        window.onresize = function() {
            that.myChart.resize();
            that.pieChart.resize();
        }
    }
}
</script>

<style scoped>
.index-top {
    height: 210px;
}
.item-01 {
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
</style>
