<template>
	<div class="department-daily-page">
        <div class="date-picker-container">
            <span style="color: #888888;">请选择日期：</span>
            <picker mode="date" :value="date" :start="calendarStartDate" :end="calendarEndDate" @change="onDateChange">
                <span class="start-date-format">{{selectedDate}}</span>
                <span class="start-date-weekday date-weekday">{{new Date(selectedDate.replace(/\.|\-/g, '/')).pattern("EE")}}</span>
            </picker>
        </div>

        <div class="order-table-container">
            <div class="order-table-title">{{`${user.stationName}订餐详情`}}</div>
            <div class="table order-table">
                <div class="thead">
                    <div class="tr">
                        <div class="th">姓名</div>
                        <div class="th">早餐</div>
                        <div class="th">午餐</div>
                        <div class="th">晚餐</div>
                    </div>
                </div>
                <div class="tbody">
                    <div class="tr" v-for="(order, i) in orderList" :key="i">
                        <div class="td">{{order.username}}</div>
                        <div v-for="(mealType, j) in order.mealTypeList" :key="j" :style="{ color: !mealType && 'transparent' }" class="td">{{mealType}}</div>
                    </div>
                </div>
                <div class="tfoot">
                    <div class="tr">
                        <div class="td">总计</div>
                        <div class="td">{{orderList.reduce((acc, order) => acc += typeof order.mealTypeList[0] === "string" ? 1 : order.mealTypeList[0], 0)}}</div>
                        <div class="td">{{orderList.reduce((acc, order) => acc += typeof order.mealTypeList[1] === "string" ? 1 : order.mealTypeList[1], 0)}}</div>
                        <div class="td">{{orderList.reduce((acc, order) => acc += typeof order.mealTypeList[2] === "string" ? 1 : order.mealTypeList[2], 0)}}</div>
                    </div>
                </div>
            </div>
            <div class="order-table-additional">*单元格内字母大小写对应餐品大小份</div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex"

	export default {
		data() {
			return {
                selectedDate: new Date().pattern("yyyy-MM-dd"),
                calendarStartDate: "2020-01-01",
                calendarEndDate: "2021-01-01",
                orderList: []
			}
        },
        computed: {
            ...mapState({
                user: state => state.user
            })
        },
        methods: {
            async onDateChange(e) {
                if (e) {
                    if (this.selectedDate === e.target.value) return
                    this.selectedDate = e.target.value
                }

                uni.showLoading({
                    title: '加载中'
                });

                try {
                    const data = await this.request({
                        url: "/FoodData/ByDataTime",
                        data: {
                            stationId: this.user.stationId,
                            time: this.selectedDate
                        }
                    })
                    console.log(data)

                    if (!data.data) {
                        this.orderList = []
                        return
                    }

                    this.orderList = data.data.filter(order => !order.mark)
                        .sort((a, b) => (a.userId || 0) - (b.userId || 0))
                        .map(order => {
                            const mealTypeList = [0, 0, 0]
                            for (let key in order) {
                                if (key.match(/^(morning|noon|night)([a-z])(max|min)?$/i)) {
                                    if (order[key]) {
                                        const mealType = RegExp.$1.toLowerCase() === "morning" ? 1 : (RegExp.$1.toLowerCase() === "noon" ? 2 : 3)
                                        const courseTypeLetter = RegExp.$2.toUpperCase()
                                        const size = !RegExp.$3 ? 0 : (RegExp.$3.toLowerCase() === "max" ? 0 : 1)
                                        if (!mealTypeList[mealType - 1]) mealTypeList[mealType - 1] = size ? courseTypeLetter.toLowerCase() : courseTypeLetter.toUpperCase()
                                        else {
                                            if (typeof mealTypeList[mealType - 1] === "string") mealTypeList[mealType - 1] = 1
                                            mealTypeList[mealType - 1] += 1
                                        }
                                    }
                                }
                            }
                            return {
                                ...order,
                                mealTypeList
                            }
                        })
                    uni.hideLoading()
                } catch (error) {
                    console.log(error)
                    uni.hideLoading()
                    uni.showToast({
                        icon:'none',
                        title:'数据加载失败，请重试',
                        duration:2000,
                    })
                    this.orderList = []
                }
            }
        },
		onLoad() {
            this.onDateChange()
		},
	}
</script>

<style lang="scss">
    .department-daily-page {
        width: 100%;
        height: auto;
        display: flex;
        flex-direction: column;
        align-items: center;

        >div {
            width: 700rpx;
        }

        .date-picker-container {
            width: 100%;
            margin-top: 10px;
            line-height: 30px;
            display: flex;
            justify-content: center;

            picker {
                width: 320rpx;
                height: 30px;
                border-radius: 10rpx;
                background: #FFFFFF;
                text-align: center;
            }
        }

        .order-table-container {
            margin: 10px 0 50px;

            .order-table-title {
                width: 100%;
                height: 40px;
                line-height: 40px;
                font-weight: bold;
                text-align: center;
            }
            
            .order-table {
                width: 100%;
                border-radius: 10rpx;
                background: #FFFFFF;
                
                .tr {
                    grid-template-columns: 200rpx 1fr 1fr 1fr;
                }
            }

            .order-table-additional {
                width: 100%;
                margin-top: 10px;
                font-size: 14px;
                color: #888888;
            }
        }
    }
</style>