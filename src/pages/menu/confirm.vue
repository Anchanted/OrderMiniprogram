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
                <div class="order-info-date-text"><div>{{dateObj.date}}</div></div>
                <div class="order-info-date-content">
                    <div v-for="(course, j) in dateObj.courseList" :key="j" class="order-info-date-course">
                        <span>{{course.name}}</span>
                        <span>￥{{course.price}}</span>
                    </div>
                </div>
                <div class="order-info-date-price"><span>小计：</span><span>￥{{dateObj.datePrice}}</span></div>
            </div>
        </div>
        <div class="total-price-container">
            <span>总计：</span><span>￥{{totalPrice}}</span>
        </div>
        <div class="notice">*订餐确认后，当天16:00前可取消，当天16:00后不可取消</div>
        <button class="confirm-button" type="primary">确认订单</button>
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
                weekdayList: state => state.weekdayList,
                user: state => state.user
            }),
            totalPrice() {
                return this.dateOrderList.reduce((acc, current) => acc += current.datePrice, 0)
            }
        },
        methods: {
            
        },
		mounted() {
            const courseList = JSON.parse(JSON.stringify(this.globalOrderList))
            courseList.sort((order1, order2) => {
                if (order1.date === order2.date) {
                    if (order1.mealType === order2.mealType) {
                        if (order1.course === order2.course) {
                            return order2.size - order1.size
                        } else
                            return order1.course - order2.course
                    } else
                        return order1.mealType - order2.mealType
                } else 
                    return order1.date - order2.date
            })

            const dateMap = new Map()
            courseList.forEach(course => {
                const mealTypeStr = course.mealType === 0 ? "早" : (course.mealType === 1 ? "午" : "晚")
                const courseStr = String.fromCharCode(course.course + 'A'.charCodeAt()) 
                const sizeStr = course.size ? "(小份)" : (course.mealType > 0 ? "(大份)" : "")
                course = {
                    ...course,
                    name: `${mealTypeStr}餐 (套餐${courseStr}) ${sizeStr}`,
                    price: course.mealType === 0 ? 5 : (course.size % 2 === 0 ? 15 : 14)
                }
                if (dateMap.get(`${course.date}`) == null) dateMap.set(`${course.date}`, [])
                dateMap.get(`${course.date}`).push(course)
            })
            
            dateMap.forEach((value, key) => {
                const weekdayDate = new Date(key)
                this.dateOrderList.push({
                    date: `${key} ${this.weekdayList[(weekdayDate.getDay() == 0 ? 7 : weekdayDate.getDay()) - 1]}`,
                    courseList: value,
                    datePrice: value.reduce((acc, current) => acc += current.price, 0)
                })
            })
            console.log(dateMap)
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
