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
            <div class="order-table-selector">
                <div v-for="(mealType, i) in mealTypeList" :key="i" 
                    :class="selectedMealTypeIndex === i ? 'selected' : ''"
                    @tap="onTapSelect($event, i)">{{mealType}}</div>
            </div>
            <div class="table order-table">
                <div class="thead">
                    <div class="tr">
                        <div class="th th-name">
                            <div>姓名</div>
                        </div>
                        <div class="th" style="grid-column-start: span 2;">A</div>
                        <div class="th top-right-cell" style="grid-column-start: span 2;">B</div>
                        <template v-for="(n, i) in 2">
                            <div class="th" :key="i" :style="{ 'grid-column-start': `span ${!selectedMealTypeIndex ? 2 : 1}` }">{{selectedMealTypeIndex === 0 ? "标准": "大"}}</div>
                            <div class="th" v-if="selectedMealTypeIndex" :key="i">小</div>
                        </template>
                    </div>
                </div>
                <div class="tbody" v-if="orderList.length">
                    <div class="tr" v-for="(order, i) in orderList" :key="i">
                        <div class="td">{{order.username}}</div>
                        <template v-for="sizeList in order.mealTypeList[selectedMealTypeIndex]">
                            <div class="td" 
                                v-for="size in sizeList" :key="size.key" 
                                :style="{'grid-column-start': `span ${!selectedMealTypeIndex ? 2 : 1}`}">{{size.count}}</div>
                        </template>
                    </div>
                </div>
                <div class="tfoot" v-if="orderList.length">
                    <div class="tr">
                        <div class="td">总计</div>
                        <div class="td" :style="{ 'grid-column-start': `span ${!selectedMealTypeIndex ? 2 : 1}` }">{{orderList.reduce((acc, order) => acc += order.mealTypeList[selectedMealTypeIndex][0][0].count, 0)}}</div>
                        <div class="td" v-if="selectedMealTypeIndex">{{orderList.reduce((acc, order) => acc += (order.mealTypeList[selectedMealTypeIndex][0][1] || 0).count, 0)}}</div>
                        <div class="td" :style="{ 'grid-column-start': `span ${!selectedMealTypeIndex ? 2 : 1}` }">{{orderList.reduce((acc, order) => acc += order.mealTypeList[selectedMealTypeIndex][1][0].count, 0)}}</div>
                        <div class="td" v-if="selectedMealTypeIndex">{{orderList.reduce((acc, order) => acc += (order.mealTypeList[selectedMealTypeIndex][1][1] || 0).count, 0)}}</div>
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
                orderList: [],
                mealTypeList: ["早餐", "午餐", "晚餐"],
                selectedMealTypeIndex: 0
			}
        },
        computed: {
            ...mapState({
                user: state => state.user
            })
        },
        methods: {
            onTapSelect(e, index) {
                if (this.selectedMealTypeIndex === index) return
                this.selectedMealTypeIndex = index
            },
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
                            const mealTypeList = []
                            for (let i = 0; i < 3; i++) {
                                const courseTypeList = []
                                for (let j = 0; j < 2; j++) {
                                    const sizeList = []
                                    for (let k = 0; k < 2; k++) {
                                        if (!(i === 0 && k === 1)) sizeList.push({
                                            count: 0,
                                            key: `${order.id}|${i}|${j}|${k}`
                                        })
                                    }
                                    courseTypeList.push(sizeList)
                                }
                                mealTypeList.push(courseTypeList)
                            }
                            for (let key in order) {
                                if (key.match(/^(morning|noon|night)([a-z])(max|min)?$/i)) {
                                    if (order[key]) {
                                        const mealType = RegExp.$1.toLowerCase() === "morning" ? 1 : (RegExp.$1.toLowerCase() === "noon" ? 2 : 3)
                                        const courseType = RegExp.$2.toUpperCase().charCodeAt() - 'A'.charCodeAt() + 1
                                        const size = !RegExp.$3 ? 0 : (RegExp.$3.toLowerCase() === "max" ? 0 : 1)
                                        mealTypeList[mealType - 1][courseType - 1][size].count += 1
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

            .order-table-selector {
                text-align: center;
                margin: 0 0 10px;
                display: grid;
                place-items: center stretch;
                place-content: center stretch;
                grid-template-columns: 1fr 1fr 1fr;

                >div {
                    padding: 10px 0;
                    border-radius: 10rpx;
                    background-color: #FFFFFF;
                    color: #888888;
                }

                .selected {
                    background-color: #09BB07;
                    color: #FFFFFF;
                }
            }
            
            .order-table {
                width: 100%;
                border-radius: 10rpx;
                background: #FFFFFF;
                
                .tr {
                    grid-template-columns: 200rpx 1fr 1fr 1fr 1fr;
                }

                .th-name {
                    box-sizing: border-box; 
                    height: 100%; 
                    grid-row-start: span 2;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .thead {
                    .tr {
                        .th:last-child {
                            border-top-right-radius: 0;
                        }

                        .top-right-cell {
                            border-top-right-radius: 10rpx;
                        }
                    }
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