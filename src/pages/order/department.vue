<template>
	<div class="department-page">
        <div class="date-selector-container">
            <div class="date-picker-container">
                <picker mode="date" :value="date" :start="calendarStartDate" :end="calendarEndDate" @change="bindStartDateChange">
                    <span class="start-date-format">{{startDate}}</span>
                    <span class="start-date-weekday date-weekday">{{new Date(startDate.replace(/\.|\-/g, '/')).pattern("EE")}}</span>
                </picker>
                <span>至</span>
                <picker mode="date" :value="date" :start="calendarStartDate" :end="calendarEndDate" @change="bindEndDateChange">
                    <span class="end-date-format">{{endDate}}</span>
                    <span class="end-date-weekday date-weekday">{{new Date(endDate.replace(/\.|\-/g, '/')).pattern("EE")}}</span>
                </picker>
            </div>
            <button class="date-search-button" type="primary" @tap="onTapSearch">查询</button>
        </div>

        <div class="order-table-container">
            <div class="order-table">
                <div class="order-table-header">餐品类别</div>
                <div class="order-table-header">数量（份）</div>
                <div class="order-table-header">金额（元）</div>
                <template v-for="(course, index) in courseList">
                    <div :key="index">{{course.name}}</div>
                    <div :key="index">{{course.count}}</div>
                    <div :key="index">{{course.price}}</div>
                </template>
                <div>总计</div>
                <div>{{courseList.reduce((acc, current) => acc += current.count, 0)}}</div>
                <div>{{courseList.reduce((acc, current) => acc += current.price, 0)}}</div>
            </div>
        </div>
    </div>
</template>

<script>
import orderInfo from "@/static/json/order.json"

import { mapState } from "vuex"

	export default {
		data() {
			return {
                startDate: null,
                endDate: null,
                calendarStartDate: "2020-01-01",
                calendarEndDate: "2021-01-01",
                department: "公司办公室",
                courseList: []
			}
        },
        computed: {
            ...mapState({
                user: state => state.user
            }),
        },
        methods: {
            bindStartDateChange(e) {
                this.startDate = e.target.value
            },
            bindEndDateChange(e) {
                this.endDate = e.target.value
            },
            getDate(type) {
                // const date = new Date(this.nowDateStr.replace(/\.|\-/g, '/'));
                const date = new Date();
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let day = date.getDate();

                if (type === 'start') {
                    year = year - 60;
                } else if (type === 'end') {
                    year = year + 2;
                }
                month = month > 9 ? month : '0' + month;;
                day = day > 9 ? day : '0' + day;
                return `${year}-${month}-${day}`;
            },
            async onTapSearch() {
                if (this.startDate > this.endDate) {
                    uni.showToast({
                        icon: "none",
                        title: "起始日期不能晚于终止日期",
                        duration: 2000
                    });
                    return
                }

                const courseList = [
                    {
                        name: "早餐",
                        count: 0,
                        price: 0
                    },
                    {
                        name: "午餐(大份)",
                        count: 0,
                        price: 0
                    },
                    {
                        name: "午餐(小份)",
                        count: 0,
                        price: 0
                    },
                    {
                        name: "晚餐(大份)",
                        count: 0,
                        price: 0
                    },
                    {
                        name: "晚餐(小份)",
                        count: 0,
                        price: 0
                    }
                ]

                uni.showLoading({
                    title: '加载中'
                });

                try {
                    const data = await this.request({
                        url: "/StationFoodData/ByStationId",
                        data: {
                            stationId: this.user.stationId,
                            timeStart: this.startDate,
                            timeEnd: this.endDate
                        }
                    })
                    console.log(data)

                    const orderDayList = data.data
                    if (orderDayList) {
                        orderDayList.forEach(order => {
                            for (let key in order) {
                                let courseIndex = -1
                                switch (key) {
                                    case "morning":
                                        courseIndex = 0
                                        break;
                                    case "noonMax":
                                        courseIndex = 1
                                        break;
                                    case "noonMin":
                                        courseIndex = 2
                                        break;
                                    case "nightMax":
                                        courseIndex = 3
                                        break;
                                    case "nightMin":
                                        courseIndex = 4
                                        break;
                                    default:
                                        courseIndex = -1
                                        break;
                                }

                                if (courseIndex > -1) {
                                    courseList[courseIndex].count += order[key]
                                    courseList[courseIndex].price += order[`${key}Money`]
                                }
                            }
                        })
                    }
                } catch (error) {
                    console.log(error)
                    uni.showToast({
                        icon:'none',
                        title:'数据加载失败，请重试',
                        duration:2000,
                    })
                } finally {
                    this.courseList = courseList
                    uni.hideLoading()
                }
            }
        },
		onLoad() {
            this.startDate = this.getDate()
            this.endDate = this.getDate()

            uni.setNavigationBarTitle({
                title: `${this.department}订餐详情`
            })
            this.onTapSearch()
		},
        watch: {
            startDate(val) {
                if (val > this.endDate) this.endDate = val
            },
            endDate(val) {
                if (val < this.startDate) this.startDate = val
            }
        }
	}
</script>

<style lang="scss">
    .department-page {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;

        >div {
            width: 700rpx;
        }

        .date-selector-container {
            margin-top: 10px;
            
            .date-picker-container {
                width: 100%;
                line-height: 30px;
                display: flex;
                justify-content: space-between;

                picker {
                    width: 320rpx;
                    height: 30px;
                    border-radius: 10rpx;
                    background: #FFFFFF;
                    text-align: center;
                }

                .date-weekday {
                    margin-left: 10px;
                }
            }

            .date-search-button {
                margin-top: 10px;
                width: 700rpx;
            }
        }

        .order-table-container {
            margin-top: 30px;
            
            .order-table {
                width: 100%;
                border-radius: 10rpx;
                background: #FFFFFF;
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                place-items: center stretch;
                place-content: center stretch;

                >div {
                    // box-sizing: border-box;
                    padding: 8px 10px;
                    // border-top: 1rpx solid #DFDFDF;
                    // border-bottom: 1rpx solid #DFDFDF;
                    border: 1rpx solid #DFDFDF;
                    text-align: center;
                }

                div:nth-child(1), div:nth-child(2), div:nth-child(3) {
                    // border-top: none;
                    font-weight: bold;
                    background: #09BB07;
                    color: #FFFFFF;
                }

                div:first-child {
                    border-top-left-radius: 10rpx;
                }

                div:nth-child(3) {
                    border-top-right-radius: 10rpx;
                }

                div:nth-last-child(3) {
                    border-bottom-left-radius: 10rpx;
                }

                div:last-child {
                    border-bottom-right-radius: 10rpx;
                }
            }
        }
    }
</style>
