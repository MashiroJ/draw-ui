<script setup>
import {getCurrentInstance, onMounted, reactive, ref} from "vue"
import * as echarts from 'echarts'

const {proxy} = getCurrentInstance();
const getImageUrl = (user) => {
  return new URL(`../assets/images/${user}.png`, import.meta.url).href
}
const tableData = ref([])
const countData = ref([])
// 获取图表数据
const tableLabel = ref({
  name: "品牌",
  todayBuy: "今日购买",
  monthBuy: "本月购买",
  totalBuy: "总购买",
})
//这个是折线图和柱状图 两个图表共用的公共配置
const xOptions = reactive({
  // 图例文字颜色
  textStyle: {
    color: "#333",
  },
  legend: {},
  grid: {
    left: "20%",
  },
  // 提示框
  tooltip: {
    trigger: "axis",
  },
  xAxis: {
    type: "category", // 类目轴
    data: [],
    axisLine: {
      lineStyle: {
        color: "#17b3a3",
      },
    },
    axisLabel: {
      interval: 0,
      color: "#333",
    },
  },
  yAxis: [
    {
      type: "value",
      axisLine: {
        lineStyle: {
          color: "#17b3a3",
        },
      },
    },
  ],
  color: ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3"],
  series: [],
})
const pieOptions = reactive({
  tooltip: {
    trigger: "item",
  },
  legend: {},
  color: [
    "#0f78f4",
    "#dd536b",
    "#9462e5",
    "#a6a6a6",
    "#e1bb22",
    "#39c362",
    "#3ed1cf",
  ],
  series: []
})
//observer 接收观察器实例对象
const observer = ref(null)

//请求图表数据并渲染的方法
const getChartData = async () => {
  const {orderData, userData, videoData} = await proxy.$api.getChartData()
  //对第一个图表的xAxis和series赋值
  xOptions.xAxis.data = orderData.date
  xOptions.series = Object.keys(orderData.data[0]).map(val => ({
        name: val,
        data: orderData.data.map(item => item[val]),
        type: "line"
      })
  )
  //one echarts.init方法初始化ECharts实例，需要传入dom对象
  const OneEcharts = echarts.init(proxy.$refs["echart"])
  //setOption方法应用配置对象
  OneEcharts.setOption(xOptions)

  //对第二个图表的xAxis和series赋值
  xOptions.xAxis.data = userData.map((item) => item.date)
  xOptions.series = [
    {
      name: "新增用户",
      data: userData.map((item) => item.new),
      type: "bar",
    },
    {
      name: "活跃用户",
      data: userData.map((item) => item.active),
      type: "bar",
    }
  ]
  //two
  const TwoEcharts = echarts.init(proxy.$refs["userEchart"])
  TwoEcharts.setOption(xOptions)

  //对第三个图表的series赋值
  pieOptions.series = [
    {
      data: videoData,
      type: "pie",
    },
  ]
  //three
  const ThreeEcharts = echarts.init(proxy.$refs["videoEchart"])
  ThreeEcharts.setOption(pieOptions);

  //ResizeObserver 如果监视的容器大小变化，如果改变会执行传递的回调
  observer.value = new ResizeObserver(entries => {
    OneEcharts.resize()
    TwoEcharts.resize()
    ThreeEcharts.resize()
  })
  //如果这个容器存在
  if (proxy.$refs["echart"]) {
    //则调用监视器的observe方法，监视这个容器的大小
    observer.value.observe(proxy.$refs["echart"]);
  }
}

const getTableData = async () => {
  try {
    const data = await proxy.$api.getTableData();
    // console.log(data)
    tableData.value = data.tableData;
  } catch (error) {
    console.error("获取表格数据失败：", error);
  }
};
const getCountData = async () => {
  try {
    const data = await proxy.$api.getCountData();
    // console.log(data)
    countData.value = data
  } catch (error) {
    console.error("获取表格数据失败：", error);
  }
};
// 监听生命周期
onMounted(() => {
  getTableData()
  getCountData()
  getChartData()
})


</script>

<template>

  <!-- 首页 -->
  <el-row class="home" :gutter="20">
    <el-col :span="8" style="margin-top: 10px">
      <!-- 用户信息-->
      <el-card shadow="hover">
        <div class="user">
          <img :src="getImageUrl('user')" class="user"/>
          <div class="user-info">
            <p class="user-info-admin">Mashiro</p>
            <p class="user-info-p">管理员</p>
          </div>
        </div>
        <!-- 登录信息-->
        <div class="login-info">
          <p>上次登录时间：<span>2024-01-01</span></p>
          <p>上次登录地点：<span>福州</span></p>
        </div>
      </el-card>
      <!-- 用户信息表格-->
      <el-card shadow="hover" class="user-table">
        <el-table :data="tableData">
          <el-table-column
              v-for="(val, key) in tableLabel"
              :key="key"
              :prop="key"
              :label="val"
          />
        </el-table>
      </el-card>
    </el-col>
    <!-- 图表-->
    <el-col :span="16" style="margin-top: 10px">
      <div class="num">
        <!-- 统计信息-->
        <el-card
            :body-style="{display:'flex', padding:0}"
            v-for="item in countData"
            :key="item.name"
        >
          <!-- 图标-->
          <component :is="item.icon" class="icons" :style="{background: item.color}"></component>
          <div class="detail">
            <p class="num">¥{{ item.value }}</p>
            <p class="txt">{{ item.name }}</p>
          </div>
        </el-card>
      </div>

      <!-- 折线图-->
      <el-card class="top-echart">
        <div ref="echart" style="height: 280px;"></div>
      </el-card>

      <!-- 饼状图-->
      <div class="graph">
        <!-- 用户柱状图-->
        <el-card>
          <div ref="userEchart" style="height: 240px"></div>
        </el-card>
        <!-- 视频饼状图-->
        <el-card>
          <div ref="videoEchart" style="height: 240px"></div>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped lang="less">
.home {
  height: 100%;
  overflow: hidden;

  .user {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ccc;
    margin-bottom: 20px;

    img {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      margin-right: 40px;
    }

    .user-info {
      p {
        line-height: 40px;
      }

      .user-info-p {
        color: #999;
      }

      .user-info-admin {
        font-size: 35px;
      }
    }
  }

  .login-info {
    p {
      line-height: 30px;
      font-size: 14px;
      color: #999;

      span {
        color: #666;
        margin-left: 60px;
      }
    }
  }
}

.user-table {
  margin-top: 20px;
}

.num {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .el-card {
    width: 32%;
    margin-bottom: 20px;
  }

  .icons {
    width: 80px;
    height: 80px;
    font-size: 30px;
    text-align: center;
    line-height: 80px;
    color: #fff;
  }

  .detail {
    margin-left: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .num {
      font-size: 30px;
      margin-bottom: 10px;
    }

    .txt {
      font-size: 15px;
      text-align: center;
    }
  }
}

.graph {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;

  .el-card {
    width: 48%;
    height: 260px;
  }
}
</style>
