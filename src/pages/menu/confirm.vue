<template>
	<div class="order-confirm-page">
        <div class="user-info-container">
            <!-- <div>订餐人信息</div> -->
            <div class="user-info-name"><span>{{`${user.username} (${user.telephone})`}}</span></div>
            <div class="user-info-secondary"><span>{{user.stationName}}</span></div>
            <div class="user-info-secondary"><span>{{user.wellName}}</span></div>
        </div>
        <div class="order-info-container">
            <div v-for="(dateObj, i) in dateOrderList" :key="i" class="order-info-date-container">
                <div class="order-info-date-text"><div>{{dateObj.dateText}}</div></div>
                <div class="order-info-date-content">
                    <div v-for="(course, j) in dateObj.courseList" :key="j" class="order-info-date-course">
                        <!-- <span>{{course.name}} x{{course.count}}</span> -->
                        <span>{{course.name}}</span>
                        <span>￥{{course.price * course.count}}</span>
                    </div>
                </div>
                <div class="order-info-date-price"><span>小计：</span><span>￥{{dateObj.datePrice}}</span></div>
            </div>
        </div>
        <div class="total-price-container">
            <span>总计：</span><span>￥{{totalPrice}}</span>
        </div>
        <div class="notice">*订餐确认后，当天16:00前可取消，当天16:00后不可取消</div>
        <button class="confirm-button" type="primary" @tap="onTapConfirm">确认订单</button>
    </div>
</template>

<script>
import { mapState } from "vuex"

	export default {
		data() {
			return {
                dateOrderList: [],
			}
        },
        computed: {
            ...mapState({
                globalOrderList: state => state.orderList,
                user: state => state.user
            }),
            totalPrice() {
                return this.dateOrderList.reduce((acc, current) => acc += current.datePrice, 0)
            }
        },
        methods: {
            onTapConfirm() {
                const now = new Date()
                if (!(now.getHours() >= 8 && now.getHours() < 16)) {
                    uni.showModal({
                        title: "提示",
                        content: "当前时间不在订餐时间范围内，请在8:00至16:00订餐",
                        showCancel: false,
                        success: function({ confirm }) {
                            if (confirm) {
                                uni.reLaunch({
                                    url: "/pages/menu/index"
                                })
                            }
                        }
                    })
                    return
                }

                this.dateOrderList.forEach(async (order) => {
                    uni.showLoading({
                        title: "加载中"
                    })
                    try {
                        const data = await this.request({
                            url: "/FoodData/ById",
                            method: "GET",
                            data: {
                                pageNum: 1,
                                pageSize: 10,
                                userId: this.user.id,
                                timeStart: order.date,
                                timeEnd: order.date
                            }
                        })
                        console.log(data)

                        uni.hideLoading()
                        if (data.data.length
                            && data.data.some(order => !order.mark)) {
                            uni.showModal({
                                title: "提示",
                                content: "您已有本日订单",
                                showCancel: false,
                                success: function({ confirm }) {
                                    if (confirm) {
                                        uni.reLaunch({
                                            url: "/pages/menu/index"
                                        })
                                    }
                                }
                            })
                            return
                        }
                    } catch (error) {
                        console.log(error)
                        uni.hideLoading()
                    }

                    const courseObj = {}
                    courseObj["userId"] = this.user.id
                    courseObj["dataTime"] = order.date

                    order.courseList.forEach(course => {
                        let courseKey = ""
                        if (course.mealType === 1) courseKey += "morning"
                        else if (course.mealType === 2) courseKey += "noon"
                        else if (course.mealType === 3) courseKey += "night"

                        if (course.courseType === 1) courseKey += "A"
                        else if (course.courseType === 2) courseKey += "B"

                        if (course.mealType !== 1) {
                            if (course.size === 0) courseKey += "Max"
                            else if (course.size === 1) courseKey += "Min"
                        }

                        courseObj[courseKey] = 1
                    })

                    console.log(courseObj)
                    
                    uni.showLoading({
                        title: "加载中"
                    });
                    this.request({
                        url: "/FoodData/Insert",
                        method: "GET",
                        data: courseObj,
                    }).then(data => {
                        console.log(data)
                        uni.hideLoading();
                        if (data.data) {
                            uni.showToast({
                                icon: "success",
                                title: "订单提交成功",
                                duration: 2000,
                                complete: function() {
                                    uni.reLaunch({
                                        url: "/pages/menu/index"
                                    })
                                }
                            })
                        }
                    }).catch(err => {
                        console.log(err)
                        uni.hideLoading();
                        uni.showToast({
                            icon: "none",
                            title: "订单提交失败，请重试",
                            duration: 2000
                        })
                    })
                })
            }
        },
		onLoad() {
            const courseList = JSON.parse(JSON.stringify(this.globalOrderList))
            courseList.sort((order1, order2) => {
                if (order1.date === order2.date) {
                    if (order1.mealType === order2.mealType) {
                        if (order1.courseType === order2.courseType) {
                            return order2.size - order1.size
                        } else
                            return order1.courseType - order2.courseType
                    } else
                        return order1.mealType - order2.mealType
                } else 
                    return new Date(order1.date.replace(/\.|\-/g, '/')) - new Date(order2.date.replace(/\.|\-/g, '/'))
            })

            const dateMap = new Map()
            courseList.forEach(course => {
                const mealTypeStr = course.mealType === 1 ? "早" : (course.mealType === 2 ? "午" : "晚")
                const courseStr = String.fromCharCode(course.courseType - 1 + 'A'.charCodeAt()) 
                const sizeStr = course.size ? "(小份)" : (course.mealType > 1 ? "(大份)" : "")
                course = {
                    ...course,
                    name: `${mealTypeStr}餐 (套餐${courseStr}) ${sizeStr}`
                }
                if (dateMap.get(`${course.date}`) == null) dateMap.set(`${course.date}`, [])
                dateMap.get(`${course.date}`).push(course)
            })
            
            dateMap.forEach((value, key) => {
                const date = new Date(key.replace(/\.|\-/g, '/'))
                this.dateOrderList.push({
                    date: key,
                    dateText: date.pattern("yyyy-MM-dd EE"),
                    courseList: value,
                    datePrice: value.reduce((acc, current) => acc += current.price, 0)
                })
            })
		},
	}
</script>

<style lang="scss">
    .order-confirm-page {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;

        >div {
            margin-top: 10px;
            width: 700rpx;
            border-radius: 10rpx;
            background: #FFFFFF;
        }

        .user-info-container {
            box-sizing: border-box;
            padding: 14px 20px;

            .user-info-name {
                font-weight: bold;
                font-size: 18px;
                margin-bottom: 10px;
            }

            .user-info-secondary {
                margin-top: 4px;
                color: #888888;
                font-size: 14px;
            }
        }

        .order-info-container {
            box-sizing: border-box;
            padding: 14px 20px;

            .order-info-date-container {
                >div {
                    margin-bottom: 10px;
                }

                .order-info-date-text {
                    font-weight: bold;
                }

                .order-info-date-course {
                    display: flex;
                    justify-content: space-between;
                }   

                .order-info-date-price {
                    display: flex;
                    justify-content: flex-end;
                }
            }
        }

        .total-price-container {
            box-sizing: border-box;
            padding: 14px 20px;
            display: flex;
            justify-content: flex-end;
        }

        .notice {
            // height: 32px;
            font-size: 14px;
            line-height: 1.5;
            color: #E64340;
            background: transparent;
        }

        .confirm-button {
            margin-top: 10px;
            width: 700rpx;
        }
    }
</style>
