<template>
    <scroll-view scroll-x="false" scroll-y="true" class="order-user-page">
        <div v-if="orderList.length" class="order-list-container">
            <div v-for="(order, i) in orderList" :key="i" class="order-container">
                <div class="order-header">
                    <span class="order-date-text">{{order.date}}</span>
                    <span class="order-status-text">{{order.cancelTime ? "已取消" : "已下单"}}</span>
                </div>
                <div class="order-course-container">
                    <div v-for="(course, j) in order.courseList" :key="j" class="order-course-list">
                        <span>{{course.name}}</span>
                        <span>￥{{course.price}}</span>
                    </div>
                </div>
                <div class="order-total-price"><span>总计：</span><span>￥{{order.courseList.reduce((acc, current) => acc += current.price, 0)}}</span></div>
                <div class="order-transaction-container">
                    <div v-if="order.orderTime">
                        <span>下单日期：</span>
                        <span>{{order.orderTime}}</span>
                    </div>
                    <div v-if="order.cancelTime">
                        <span>取消日期：</span>
                        <span>{{order.cancelTime}}</span>
                    </div>
                </div>
                <div v-if="checkDate(i)" class="order-option"><div class="order-cancel-button">取消订单</div></div>
            </div>
        </div>
        <div v-else class="order-none">
            您还没有任何订单
        </div>
    </scroll-view>
</template>

<script>
import DateList from "@/static/json/weekday.json"

import { mapState } from "vuex"

	export default {
		data() {
			return {
                orderList: [],
                courseTypeList: [
                    {
                        name: "早餐",
                        price: 5
                    },
                    {
                        name: "午餐(大份)",
                        price: 15
                    },
                    {
                        name: "午餐(小份)",
                        price: 14
                    },
                    {
                        name: "晚餐(大份)",
                        price: 15
                    },
                    {
                        name: "晚餐(小份)",
                        price: 14
                    }
                ]
			}
        },
        computed: {
            ...mapState({
                user: state => state.user
            }),
            checkDate() {
                return (i) => {
                    const order = this.orderList[i]
                    const now = new Date(this.nowDateStr)
                    const todayIndex = DateList.findIndex(day => now.pattern("yyyy-MM-dd") === day["dayStr"])
                    let selectedDate = now
                    if (todayIndex != null) {
                        if (DateList[todayIndex]["type"] == 0 && now.getHours() < 8) {
                            selectedDate = now
                        } else {
                            const nextDay = DateList.slice(todayIndex + 1).find(day => day["type"] === 0)
                            if (nextDay) {
                                selectedDate = new Date(`${nextDay["dayStr"]} ${now.pattern("HH:mm:ss")}`)
                            }
                        }
                    }
                    return selectedDate.pattern("yyyy-MM-dd") === order.date && (selectedDate.getHours() >= 8 && selectedDate.getHours() < 16)
                }
            }
        },
        methods: {
            
        },
		onLoad() {
            uni.showLoading({
                title: "加载中"
            });

            this.request({
                url: this.apiUrl + "/FoodData/ByUserId",
                method: "GET",
                data: {
                    pageNum: 1,
                    pageSize: 10,
                    userId: this.user.id,
                    timeStart: new Date("2020-01-01").pattern("yyyy-MM-dd"),
                    timeEnd: new Date().pattern("yyyy-MM-dd")
                },
            }).then(data => {
                console.log(data)
                uni.hideLoading();

                const orderList = data.data.list.map(order => {
                    const courseList = []
                    for (let key in order) {
                        if (key.match(/^(morning|noon|night)([a-z])(max|min)?$/i)) {
                            const mealTypeStr = RegExp.$1.toLowerCase() === "morning" ? "早" : (RegExp.$1.toLowerCase() === "noon" ? "午" : "晚")
                            const sizeStr = !RegExp.$3 ? "" : (RegExp.$3.toLowerCase() === "max" ? "(大份)" : "(小份)")
                            const price = RegExp.$1.toLowerCase() === "morning" ? 5 : (15 - (RegExp.$3.toLowerCase() === "max" ? 0 : 1))
                            courseList.push({
                                name: `${mealTypeStr}餐 ${sizeStr}`,
                                price
                            })
                        }
                    }
                    return {
                        courseList,
                        date: new Date(order.dataTime).pattern("yyyy-MM-dd"),
                        orderTime: new Date(order.stime).pattern("yyyy-MM-dd HH:mm:ss"),
                        // cancelTime
                    }
                })

                orderList.sort((a, b) => new Date(b.date) - new Date(a.date))
                this.orderList = orderList
            }).catch(err => {
                console.log(err)
                uni.hideLoading();
                uni.showToast({
                    icon: "none",
                    title: "获取信息失败",
                    duration: 2000
                })
            })
		},
        watch: {
            
        }
	}
</script>

<style lang="scss">
    .order-user-page {
        width: 100%;
        height: 100%;

        .order-list-container {
            width: 100%;
            height: auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-bottom: 20px;

            >div {
                margin-top: 10px;
                width: 700rpx;
                border-radius: 10rpx;
                background: #FFFFFF;
            }

            .order-container {
                box-sizing: border-box;
                padding: 14px 20px;

                div:not(:last-child) {
                    margin-bottom: 10px;
                }

                .order-header {
                    display: flex;
                    justify-content: space-between;

                    .order-date-text {
                        font-weight: bold;
                    }

                    .order-status-text {
                        color: #888888;
                    }
                }

                .order-course-list {
                    display: flex;
                    justify-content: space-between;
                }   

                .order-total-price {
                    display: flex;
                    justify-content: flex-end;
                }

                .order-transaction-container {
                    font-size: 14px;
                    color: #888888;
                }

                .order-option {
                    display: flex;
                    justify-content: flex-end;

                    .order-cancel-button {
                        width: 80px;
                        height: 36px;
                        text-align: center;
                        font-size: 14px;
                        line-height: 36px;
                        border-radius: 16px;
                        background: #09BB07;
                        color: #FFFFFF;
                    }
                }
            }
        }

        .order-none {
            width: 100%;
            height: 300px;
            line-height: 300px;
            text-align: center;
            color: #888888;
        }
    }
</style>
