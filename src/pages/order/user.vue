<template>
    <div class="order-user-page">
        <div class="order-type-select">
            <div v-for="(type, index) in typeList" :key="index" :class="selectedTypeIndex === index ? 'selected' : ''" @tap="onTapType(index)">{{type}}</div>
        </div>
        <div v-if="displayList.length" class="order-list-container">
            <div v-for="(order, i) in displayList" :key="i" class="order-container">
                <div class="order-header">
                    <span class="order-date-text">{{order.date}}</span>
                    <span class="order-status-text">{{order.cancelTime ? "已取消" : "已下单"}}</span>
                </div>
                <div class="order-course-container">
                    <div v-for="(course, j) in order.courseList" :key="j" class="order-course-list">
                        <!-- <span>{{course.name}} x{{course.count}}</span> -->
                        <span>{{course.name}}</span>
                        <span>￥{{course.price}}</span>
                    </div>
                </div>
                <div class="order-total-price"><span>总计：</span><span>￥{{order.ncountMoney}}</span></div>
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
                <div v-if="checkDate(i) && !order.cancelTime" class="order-option"><div class="order-cancel-button" @tap="onTapCancelOrder($event, order.id)">取消订单</div></div>
            </div>
        </div>
        <div v-else class="order-none">
            您还没有任何订单
        </div>
    </div>
</template>

<script>
import DateList from "@/static/json/weekday.json"

import { mapState } from "vuex"

	export default {
		data() {
			return {
                orderList: [],
                displayList: [],
                orderCanceled: false,
                typeList: ["全部", "已下单", "已取消"],
                selectedTypeIndex: 0
			}
        },
        computed: {
            ...mapState({
                user: state => state.user
            }),
            checkDate() {
                return i => {
                    const order = this.displayList[i]

                    const now = new Date()
                    const todayIndex = DateList.findIndex(day => now.pattern("yyyy-MM-dd") === day["dayStr"])
                    const todayISODate = new Date(`${now.pattern("yyyy-MM-dd")}T00:00:00Z`)
                    const todayLocalDate = new Date(todayISODate.getTime() + todayISODate.getTimezoneOffset() * 60 * 1000)

                    let selectedDate = todayLocalDate
                    let threshold = todayLocalDate
                    if (todayIndex != null) {
                        if (DateList[todayIndex]["type"] == 0 && now.getHours() < 8) {
                            selectedDate = todayLocalDate
                        } else {
                            const nextWorkday = DateList.slice(todayIndex + 1).find(day => day["type"] === 0)
                            if (nextWorkday) {
                                const nextWorkdayISODate = new Date(`${nextWorkday["dayStr"]}T00:00:00Z`)
                                selectedDate = new Date(nextWorkdayISODate.getTime() + nextWorkdayISODate.getTimezoneOffset() * 60 * 1000)
                            }
                        }
                        const dateBeforeSelectedDate = new Date(selectedDate.getTime() - 1 * 24 * 60 * 60 * 1000)
                        const thresholdISODate = new Date(`${dateBeforeSelectedDate.pattern("yyyy-MM-dd")}T16:00:00Z`)
                        threshold = new Date(thresholdISODate.getTime() + thresholdISODate.getTimezoneOffset() * 60 * 1000)
                    }
                    const orderISODate = new Date(`${order.date}T00:00:00Z`)
                    const orderLocalDate = new Date(orderISODate.getTime() + orderISODate.getTimezoneOffset() * 60 * 1000)
                    return (orderLocalDate - selectedDate >= 1 * 24 * 60 * 60 * 1000) || (orderLocalDate >= selectedDate && now < threshold)
                }
            }
        },
        methods: {
            onTapType(index) {
                if (this.selectedTypeIndex === index) return
                this.selectedTypeIndex = index
            },
            onTapCancelOrder(e, id) {
                uni.showLoading({
                    title: "加载中"
                });
                this.request({
                    url: "/FoodData/Updata",
                    data: {
                        id,
                        mark: 1,
                        remark: new Date().pattern("yyyy-MM-dd HH:mm:ss")
                    }
                }).then(data => {
                    console.log(data)
                    uni.hideLoading()

                    if (!data.data) throw new Error("Error from then")

                    uni.showToast({
                        icon:'success',
                        title:'订单取消成功',
                        duration:2000,
                    })
                    this.orderCanceled = true
                    uni.startPullDownRefresh()
                }).catch(err => {
                    console.log(err)
                    uni.hideLoading()
                    uni.showToast({
                        icon:'none',
                        title:'订单取消失败，请重试',
                        duration:2000,
                    })
                })
            },
            changeDisplayList(selectedTypeIndex) {
                switch (selectedTypeIndex) {
                    case 0:
                        this.displayList = this.orderList
                        break;
                    case 1:
                        this.displayList = this.orderList.filter(order => !order.mark)
                        break;
                    case 2:
                        this.displayList = this.orderList.filter(order => order.mark)
                        break;
                    default:
                        this.displayList = this.orderList
                        break;
                }
            }
        },
		onLoad() {
            uni.startPullDownRefresh()
        },
        onPullDownRefresh() {
            this.request({
                url: "/FoodData/ByUserId",
                method: "GET",
                data: {
                    pageNum: 1,
                    pageSize: 10,
                    userId: this.user.id,
                    timeStart: new Date("2020-01-01".replace(/\.|\-/g, '/')).pattern("yyyy-MM-dd HH:mm:ss"),
                    timeEnd: new Date().pattern("yyyy-MM-dd HH:mm:ss")
                },
            }).then(data => {
                console.log(data)
                uni.stopPullDownRefresh()

                const orderList = data.data.list.map(order => {
                    const courseList = []
                    for (let key in order) {
                        if (key.match(/^(morning|noon|night)([a-z])(max|min)?$/i)) {
                            if (order[key]) {
                                const mealTypeStr = RegExp.$1.toLowerCase() === "morning" ? "早" : (RegExp.$1.toLowerCase() === "noon" ? "午" : "晚")
                                const courseTypeStr = RegExp.$2.toUpperCase()
                                const sizeStr = !RegExp.$3 ? "" : (RegExp.$3.toLowerCase() === "max" ? "(大份)" : "(小份)")
                                courseList.push({
                                    name: `${mealTypeStr}餐 (套餐${courseTypeStr}) ${sizeStr}`,
                                    mealType: RegExp.$1.toLowerCase() === "morning" ? 1 : (RegExp.$1.toLowerCase() === "noon" ? 2 : 3),
                                    size: !RegExp.$3 ? 0 : (RegExp.$3.toLowerCase() === "max" ? 0 : 1),
                                    count: order[key],
                                    price: order[`${key}Money`]
                                })
                                courseList.sort((order1, order2) => {
                                    if (order1.mealType === order2.mealType) {
                                        return order1.size - order2.size
                                    } else
                                        return order1.mealType - order2.mealType
                                })
                            }
                        }
                    }
                    return {
                        ...order,
                        courseList,
                        date: new Date(order.dataTime.replace(/\.|\-/g, '/')).pattern("yyyy-MM-dd"),
                        orderTime: new Date(order.stime.replace(/\.|\-/g, '/')).pattern("yyyy-MM-dd HH:mm:ss"),
                        cancelTime: order.remark && new Date(order.remark.replace(/\.|\-/g, '/')).pattern("yyyy-MM-dd HH:mm:ss")
                    }
                })

                orderList.sort((a, b) => new Date(b.orderTime.replace(/\.|\-/g, '/')) - new Date(a.orderTime.replace(/\.|\-/g, '/')))
                this.orderList = orderList
                this.changeDisplayList(this.selectedTypeIndex)
            }).catch(err => {
                console.log(err)
                uni.stopPullDownRefresh()
                uni.showToast({
                    icon: "none",
                    title: "获取信息失败",
                    duration: 2000
                })
            })
        },
        watch: {
            selectedTypeIndex: {
                immediate: true,
                handler: function(val) {
                    this.changeDisplayList(val)
                }
            }
        },
        onUnload() {
            if (this.orderCanceled) {
                uni.reLaunch({
                    url: "/pages/menu/index"
                })
            }
        }
	}
</script>

<style lang="scss">
    .order-user-page {
        width: 100%;
        height: auto;
        display: flex;
        flex-direction: column;
        align-items: center;

        .order-type-select {
            width: 700rpx;
            padding: 10px 0 5px;
            display: flex;
            align-items: center;

            >div {
                padding: 8px 10px;
                border-radius: 50rpx;
                background-color: #ffffff;
                color: #888888;
                margin-right: 30rpx;
            }

            .selected {
                background-color: #09BB07;
                color: #ffffff;
            }
        }

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
