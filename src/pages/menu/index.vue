<template>
	<div class="menu-container">
        <div class="week-date">{{weekDateStr}}</div>
        <div class="navbar">
            <div v-for="(weekday, i) in weekdayList" :key="i" class="navbar-item-container">
                <div class="navbar-item" :class="navbarActiveIndex === i ? 'navbar-item-active' : ''" :data-navbar-index="i" @tap="onNavBarTap">
                    <span>{{weekday}}</span>
                    <div v-if="orderedCountList[i] > 0" class="navbar-item-badge">{{orderedCountList[i]}}</div>
                </div>
            </div>
        </div>
        <div class="menu-content-wrapper">
            <swiper class="menu-content-swiper" :current="navbarActiveIndex" duration="200" circular="true" @change="onChangeSwiperItem">
                <swiper-item v-for="(weekday, i) in weekdayList" :key="i" class="menu-content-swiper-item">
                    <scroll-view scroll-x="false" scroll-y="true" class="meal-content-container">
                        <div v-if="menuList[i] != null" style="padding-bottom: 50px;">
                            <div v-for="(mealType, j) in mealTypeTitle" :key="j" class="meal-content-bar">
                                <div class="meal-type-container">
                                    <span class="meal-type-name">{{mealType.name}}</span>
                                    <span class="meal-type-price">{{mealType.price}}</span>
                                </div>

                                <div class="meal-content-container">
                                    <div v-for="(course, k) in menuList[i][j]" :key="k" class="course-container">
                                        <span class="course-title">{{course.name}}</span>
                                        <div class="course-content">
                                            <span v-for="(dish, n) in course.dishList" :key="n">{{dish}}</span>
                                        </div>
                                        <template>
                                            <div v-if="j === 0" class="course-select-area">
                                                <div class="iconfont course-select-icon-container" @tap="onTapCourse($event, i, j, k)">
                                                    <span class="iconfont course-select-icon" 
                                                        :class="orderedMap.get(`${i}${j}`) === k * 2 ? 'icon-selected' : 'icon-select'"
                                                        :style="{ color: orderedMap.get(`${i}${j}`) === k * 2 ? '#09BB07' : '' }"></span>
                                                </div>
                                            </div>
                                            <div v-else class="course-select-area">
                                                <div class="iconfont course-select-icon-container" @tap="onTapCourse($event, i, j, k, true)">
                                                    <span class="iconfont course-select-icon" 
                                                        :class="orderedMap.get(`${i}${j}`) === k * 2 + 1 ? 'icon-selected' : 'icon-select'"
                                                        :style="{ color: orderedMap.get(`${i}${j}`) === k * 2 + 1 ? '#09BB07' : '' }"></span>
                                                    <span>小</span>
                                                </div>
                                                <div class="iconfont course-select-icon-container" @tap="onTapCourse($event, i, j, k, false)">
                                                    <span class="iconfont course-select-icon" 
                                                        :class="orderedMap.get(`${i}${j}`) === k * 2 ? 'icon-selected' : 'icon-select'"
                                                        :style="{ color: orderedMap.get(`${i}${j}`) === k * 2 ? '#09BB07' : '' }"></span>
                                                    <span>大</span>
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else class="meal-content-nothing">
                            <span>无</span>
                        </div>
                    </scroll-view>
                </swiper-item>
            </swiper>
        </div>
        <div class="cart-wrapper">
            <div class="cart-description">
                <div class="cart-description-price-wrapper">
                    <span>合计:</span>
                    <span>￥{{totalPrice}}</span>
                </div>
                <span v-if="hasOrder" class="cart-description-clear" @tap="onTapClear">清空</span>
            </div>
            <button class="cart-order" type="primary" size="mini" :disabled="!hasOrder" @tap="onTapOrder">确认</button>
        </div>
    </div>
</template>

<script>
import menuInfo from "@/static/json/menu.json"
import DateList from "@/static/json/weekday.json"

import { mapState } from "vuex"

	export default {
		data() {
			return {
                weekDateStr: "",
				navbarActiveIndex: 0,
                mealTypeTitle: [
                    {
                        name: "早餐",
                        price: "5元"
                    },
                    {
                        name: "午餐",
                        price: "大份15元\n小份14元"
                    },
                    {
                        name: "晚餐",
                        price: "大份15元\n小份14元"
                    }
                ],
                selectedWeekdayIndex: 0,
                orderedMap: new Map(),
                orderedCountList: [0, 0, 0, 0, 0, 0, 0],
                totalPrice: 0,
                menuList: []
			}
        },
        computed: {
            ...mapState({
                globalMenuList: state => state.globalMenuList,
            }),
            hasOrder() {
                return this.orderedCountList.reduce((acc, current) => acc += current, 0) > 0
            }
        },
		methods: {
            onNavBarTap(event) {
                let navbarTapIndex = event.currentTarget.dataset.navbarIndex
                this.navbarActiveIndex = navbarTapIndex
            },

            onChangeSwiperItem({detail}) {
                this.navbarActiveIndex = detail.current
            },

            onTapWeekday(event, index) {
                this.selectedWeekdayIndex = index
            },

            onTapCourse(event, i, j, k, isSmall = false) {
                if (this.orderedMap.get(`${i}${j}`) == null) {
                    if (this.orderedMap.size < 3) this.orderedMap.set(`${i}${j}`, k * 2 + +isSmall)
                    else {
                        uni.showToast({
                            title: "最多只能点三种套餐",
                            icon: "none",
                            duration: 2000
                        });
                    }
                } else if (this.orderedMap.get(`${i}${j}`) !== k * 2 + +isSmall) {
                    this.orderedMap.set(`${i}${j}`, k * 2 + +isSmall)
                } else {
                    this.orderedMap.delete(`${i}${j}`)
                }
                console.log(this.orderedMap)

                this.updateOrder()
            },

            updateOrder() {
                let price = 0
                const orderedCountList = [0, 0, 0, 0, 0]
                this.orderedMap.forEach((value, key) => {
                    if (parseInt(key.charAt(1)) === 0) {
                        price += 5
                    } else {
                        price += value % 2 === 0 ? 15 : 14
                    }
                    if (parseInt(key.charAt(0)) < orderedCountList.length) orderedCountList[parseInt(key.charAt(0))]++
                })
                this.totalPrice = price
                this.orderedCountList = orderedCountList
            },

            onTapClear() {
                this.orderedMap.clear()
                this.updateOrder()
            },

            onTapOrder() {
                if (!this.hasOrder) return 
                const orderList = []
                this.orderedMap.forEach((value, key) => {
                    const weekdayIndex = +key.charAt(0)
                    const mealTypeIndex = +key.charAt(1)
                    const courseIndex = Math.floor(value / 2)
                    const size = value - courseIndex * 2

                    const courseObj = {
                        ...this.menuList[weekdayIndex].mealList[mealTypeIndex].courseList[courseIndex].meal,
                        date: this.menuList[weekdayIndex].date,
                        weekday: weekdayIndex,
                        mealType: mealTypeIndex,
                        course: courseIndex,
                        size
                    }
                    orderList.push(courseObj)
                })

                this.$store.commit("setOrderList", orderList)

                uni.navigateTo({
                    url: '/pages/menu/confirm'
                });
            }
        },

        created() {
            const today = new Date()
            const todayIndex = DateList.findIndex(day => this.getDateFormat(today) === day["dayStr"])
            let selectedDay = today
            if (todayIndex != null) {
                if (DateList[todayIndex]["type"] == 0 && today.getHours() < 8) {
                    selectedDay = today
                } else {
                    const nextDay = DateList.slice(todayIndex + 1).find(day => day["type"] === 0)
                    if (nextDay) {
                        selectedDay = new Date(nextDay["dayStr"])
                    }
                }
            }
            const weekday = selectedDay.getDay() == 0 ? 7 : selectedDay.getDay()
            const hour = selectedDay.getHours()

            const monday = new Date(selectedDay.getTime() + (1 - weekday) * 24 * 3600 * 1000)
            const sunday = new Date(selectedDay.getTime() + (7 - weekday) * 24 * 3600 * 1000)

            this.weekDateStr = `${this.getDateFormat(monday, 2)} - ${this.getDateFormat(sunday, 2)}`

            uni.request({
                url: this.apiUrl + "Food",
                method: "GET",
                data: {
                    time: this.getDateFormat(selectedDay)
                }
            }).then(res => {
                console.log(res)
                const courseList = res[1].data.data

                const dayMenuList = []

                // Arrange response data
                courseList.forEach(course => {
                    const weekday = course.weekId
                    while (dayMenuList.length < weekday) dayMenuList.push([])
                    const mealType = Math.floor((course.typeId - 1) / 2) + 1
                    while (dayMenuList[weekday - 1].length < mealType) dayMenuList[weekday - 1].push([])
                    const courseIndex = (course.typeId - 1) % 2
                    while (dayMenuList[weekday - 1][mealType - 1].length < courseIndex + 1) dayMenuList[weekday - 1][mealType - 1].push(null)
                    
                    const dishList = []
                    for (let key in course) {
                        if (key.match(/^food.*$/i)) {
                            dishList.push(course[key].trim().replace(/[\r\n]/g, ""))
                        }
                    }
                    
                    dayMenuList[weekday - 1][mealType - 1][courseIndex] = {
                        ...course,
                        dishList,
                        name: `套餐${String.fromCharCode("A".charCodeAt() + courseIndex)}`
                    }
                })
                while (dayMenuList.length < 7) dayMenuList.push([])
                console.log(dayMenuList)
                this.$store.commit("setGlobalMenuList", dayMenuList)
            }).catch(err => {
                console.log(err)
            })

            uni.request({
                url: this.apiUrl + "ulogin",
                method: "POST",
                header: {
                    "content-type": "application/x-www-form-urlencoded"
                },
                data: {
                    telephone: "13833759376",
                    password: "010337"
                }
            }).then(res => {
                console.log(res)
                
                this.$store.commit("setUser", res[1].data.data)
            }).catch(err => {
                console.log(err)
            })
        },
        
        mounted() {

        },
        
        watch: {
            globalMenuList: {
                immediate: true,
                deep: true,
                handler: function(val) {
                    this.menuList = val
                }
            }
        }
	}
</script>

<style lang="scss">
    .menu-container{
        display: flex;
        flex-direction: column;
        height: 100%;

        .week-date {
            width: 100%;
            height: 30px;
            line-height: 30px;
            background: #FFFFFF;
            text-align: center;
            color: #A8A8A8;
        }  
    }

    .navbar{
        display: flex;
        // position: absolute;
        // left: 0;
        // top: 0;
        z-index: 1;
        width: 100%;
        height: 50px;
        flex-direction: row;
        text-align: center;
        color: #A8A8A8;
        font-size: 14px;
        box-sizing: border-box;
        background-color: #FFFFFF;
        border-top: 1rpx solid #DFDFDF;
        border-bottom: 1rpx solid #DFDFDF;
        justify-content: space-around;

        .navbar-item-container {
            flex-grow: 1;

            .navbar-item {
                padding: 26rpx 0px;
                position: relative;

                &-badge {
                    width: 14px;
                    height: 14px;
                    background: #E64340;
                    color: #FFFFFF;
                    border-radius: 7px;
                    font-size: 10px;
                    line-height: 14px;
                    position: absolute;
                    top: 2px;
                    right: 5px;
                }
            }
        }
    }
    
    .navbar-item-active{
        transition: all 0.3s;
        border-bottom: 10rpx solid #09BB07;
        color: #09BB07;
    }

    .menu-content-wrapper{
        height: calc(100% - 130px);
        // margin-top: 50px;

        .menu-content-swiper {
            height: 100%;

            &-item {
                height: 100%;
                display: flex;
                flex-wrap: nowrap;

                .meal-content-container {
                    // width: 100%;
                    // height: auto;
                    // flex: 1;

                    .meal-content-bar {
                        display: flex;
                        
                        .meal-type-container {
                            width: 150rpx;
                            background: #F5F5F5;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            flex-shrink: 0;
                            border-top: 1px solid #FFFFFF;
                            border-bottom: 1px solid #FFFFFF;
                            white-space: pre-wrap;
                            text-align: center;

                            .meal-type-name {
                                margin-bottom: 10px;
                            }

                            .meal-type-price {
                                font-size: 12px;
                                color: #888888;
                            }
                        }   

                        .meal-content-container {
                            display: flex;
                            // justify-content: space-evenly;
                            // align-items: center;
                            flex-grow: 1;

                            .course-container {
                                width: 50%;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                position: relative;
                                padding-bottom: 50px;
                                background: #FFFFFF;
                                // border-radius: 10px;

                                .course-title {
                                    font-weight: bold;
                                    line-height: 2.5;
                                }

                                .course-content {
                                    display: flex;
                                    flex-direction: column;
                                    align-items: center;
                                    line-height: 1.8;
                                }

                                .course-select-area {
                                    box-sizing: border-box;
                                    width: 100%;
                                    height: auto;
                                    position: absolute;
                                    bottom: 0;
                                    display: flex;

                                    .course-select-icon-container {
                                        flex-grow: 1;
                                        display: flex;
                                        justify-content: flex-end;
                                        align-items: center;
                                        padding: 0 10px 10px;

                                        .course-select-icon {
                                            margin-right: 2px;
                                        }
                                    }
                                }
                            }
                        }
                    }   

                    .meal-content-nothing {
                        width: 100%;
                        height: 100%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                }
            }
        }
    }

    .cart-wrapper {
        box-sizing: border-box;
        width: 100%;
        height: 50px;
        background: #FFFFFF;
        border-top: 1px #EEEEEE solid;
        padding: 0 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .cart-description {
            display: flex;
            align-items: center;

            .cart-description-price-wrapper {
                width: 180rpx;
            }

            .cart-description-clear {
                font-size: 14px;
                text-decoration: underline;
                color: #B2B2B2;
            }
        }

        .cart-order {
            width: 80px;
            height: 36px;
            border-radius: 20px;
            font-size: 18px;
            line-height: 36px;
            padding: 0;
            margin: 0;
        }
    }
</style>
