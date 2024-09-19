<script setup>
import { ref, getCurrentInstance, onMounted } from "vue"

const { proxy } = getCurrentInstance();

const getImageUrl = (user) => {
    return new URL(`../assets/images/${user}.png`, import.meta.url).href
}

// const tableData = ref([])
const tableData = ref([])

const tableLabel = ref({
    name: "品牌",
    todayBuy: "今日购买",
    monthBuy: "本月购买",
    totalBuy: "总购买",
})
const getTableData = async () => {  
    try {  
        const data = await proxy.$api.getTableData();  
        tableData.value = data.tableData;  
        console.log("数据获取成功：", data);  
    } catch (error) {  
        console.error("获取表格数据失败：", error);  
    }  
};
 
 onMounted(()=>{
    getTableData()
})



</script>

<template>
    
    <!-- 首页 -->
    <el-row class="home" :gutter="20">
        <el-col :span="8" style="margin-top: 10px">
            <!-- 用户信息-->
            <el-card shadow="hover">
                <div class="user">
                    <img :src="getImageUrl('user')" class="user">
                    <div class="user-info">
                        <p class="user-info-admin">Mashiro</p>
                        <p class="user-info-p">管理员</p>
                    </div>
                    </img>
                </div>
                <!-- 登录信息-->
                <div class="login-info">
                    <p>上次登录时间：<span>2024-01-01</span></p>
                    <p>上次登录地点：<span>福州</span></p>
                </div>
            </el-card>
            <el-card shadow="hover" class="user-table">
                <el-table :data="tableData">
                    <el-table-column v-for="(value, key) in tableLabel" :key="key" :prop="key" :label="value" />
                </el-table>
            </el-card>
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
