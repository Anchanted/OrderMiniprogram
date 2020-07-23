<template>
    <scroll-view scroll-x="false" scroll-y="true" class="order-user-page">
        <div class="order-list-container">
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
    </scroll-view>
</template>

<script>
import orderInfo from "@/static/json/order.json"

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
                    const now = new Date()
                    return this.getDateFormat(now) === order.date
                }
            }
        },
        methods: {
            
        },
		mounted() {
            const userOrderList = orderInfo.filter(order => order.user === this.user.username)
            userOrderList.forEach(order => {
                order.courseList = order.courseList.map(course => {
                    let courseTypeObj = {}
                    switch (course.mealType) {
                        case 0:
                            courseTypeObj = this.courseTypeList[0]
                            break;
                        case 1:
                            courseTypeObj = this.courseTypeList[1 + course.size || 0]
                            break;
                        case 2:
                            courseTypeObj = this.courseTypeList[3 + course.size || 0]
                            break;
                    }
                    return {
                        ...course,
                        ...courseTypeObj
                    }
                })
            })
            userOrderList.sort((a, b) => {
                if (a.date < b.date) return 1
                else if (a.date > b.date) return -1
                else return 0
            })
            this.orderList = userOrderList
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
    }
</style>
