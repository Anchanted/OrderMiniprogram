<template>
	<div class="menu-container">
        <div class="notification">当前工作日订餐时间为上个工作日的8:00至16:00</div>
        <div class="week-date">{{weekDateStr}}</div>
        <div class="navbar">
            <div v-for="(weekday, i) in weekdayList" :key="i" class="navbar-item-container">
                <div class="navbar-item" :class="navbarActiveIndex === i ? 'navbar-item-active' : ''" :data-navbar-index="i" @tap="onNavBarTap">
                    <span :style="{ color: (i === (selectedDate.getDay() == 0 ? 7 : selectedDate.getDay()) - 1) ? 'red' : '' }">{{weekday}}</span>
                    <div v-if="orderedCountList[i] > 0" class="navbar-item-badge">{{orderedCountList[i]}}</div>
                </div>
            </div>
        </div>
        <div class="menu-content-wrapper">
            <swiper class="menu-content-swiper" :current="navbarActiveIndex" duration="200" circular="true" @change="onChangeSwiperItem">
                <swiper-item v-for="(weekday, i) in weekdayList" :key="i" class="menu-content-swiper-item">
                    <scroll-view class="meal-content-container"
                        scroll-x="false" scroll-y="true">
                        <div style="padding-bottom: 50px;">
                            <div v-for="(mealType, j) in mealTypeTitle" :key="j" class="meal-content-bar">
                                <div class="meal-type-container">
                                    <span class="meal-type-name">{{mealType.name}}</span>
                                    <span class="meal-type-price">{{mealType.price}}</span>
                                </div>

                                <div class="meal-content-container">
                                    <div v-for="(course, k) in menuList[i][j]" :key="k" class="course-container">
                                        <span class="course-title">{{course.name}}</span>
                                        <div v-if="course.dishList.length" class="course-content">
                                            <div class="course-dish">
                                                <span v-for="(dish, n) in course.dishList" :key="n">{{dish}}</span>
                                            </div>
                                            <div v-if="course.display" class="course-select-area">
                                                <div class="iconfont course-select-icon-container" @tap="onTapCourse($event, i, j, k, 0)">
                                                    <span class="iconfont course-select-icon" 
                                                        :class="orderedMap.get(`${i}${j}`) === k * 2 ? 'icon-selected' : 'icon-select'"
                                                        :style="{ color: orderedMap.get(`${i}${j}`) === k * 2 ? '#09BB07' : '' }"></span>
                                                    <span v-if="j > 0">大</span>
                                                    <span v-else style="width: 16px;"></span>
                                                </div>
                                                <div v-if="j > 0" class="iconfont course-select-icon-container" @tap="onTapCourse($event, i, j, k, 1)">
                                                    <span class="iconfont course-select-icon" 
                                                        :class="orderedMap.get(`${i}${j}`) === k * 2 + 1 ? 'icon-selected' : 'icon-select'"
                                                        :style="{ color: orderedMap.get(`${i}${j}`) === k * 2 + 1 ? '#09BB07' : '' }"></span>
                                                    <span>小</span>
                                                </div>
                                            </div>
                                            <div v-else-if="i === (selectedDate.getDay() == 0 ? 7 : selectedDate.getDay()) - 1" class="course-select-area">
                                                <div v-if="selectedDateOrder[j][k] != null" class="iconfont course-select-icon-container">
                                                    <span class="iconfont icon-selected course-select-icon" style="color: #888888;"></span>
                                                    <span v-if="j > 0">{{selectedDateOrder[j][k] ? "小" : "大"}}</span>
                                                    <span v-else style="width: 16px;"></span>
                                                </div>
                                                <div v-else style="width: 100%; height: 50px;"></div>
                                            </div>
                                            <div v-else style="width: 100%; height: 50px;"></div>
                                        </div>
                                        <div v-else class="course-content-none">无</div>
                                    </div>
                                </div>
                            </div>
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
import DateList from "@/static/json/weekday.json"

import { mapState } from "vuex"

	export default {
		data() {
			return {
                weekdayList: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
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

                // selectedDate: new Date(this.nowDateStr.replace(/\.|\-/g, '/')),
                selectedDate: new Date(),
                selectedDateOrder: [
                    [null, null],
                    [null, null],
                    [null, null]
                ],
                orderedMap: new Map(),
                orderedCountList: [0, 0, 0, 0, 0, 0, 0],
                totalPrice: 0,
                menuList: []
			}
        },
        computed: {
            ...mapState({
                user: state => state.user
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

            onTapCourse(event, i, j, k, sizeIndex) {
                if (this.orderedMap.get(`${i}${j}`) == null) {
                    if (this.orderedMap.size < 3) this.orderedMap.set(`${i}${j}`, k * 2 + sizeIndex)
                    else {
                        uni.showToast({
                            icon: "none",
                            title: "最多只能点三种套餐",
                            duration: 2000
                        });
                    }
                } else if (this.orderedMap.get(`${i}${j}`) !== k * 2 + sizeIndex) {
                    this.orderedMap.set(`${i}${j}`, k * 2 + sizeIndex)
                } else {
                    this.orderedMap.delete(`${i}${j}`)
                }
                // console.log(this.orderedMap)

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

            async onTapOrder() {
                if (!this.hasOrder) return

                const orderList = []
                this.orderedMap.forEach((value, key) => {
                    const weekdayIndex = +key.charAt(0)
                    const mealTypeIndex = +key.charAt(1)
                    const courseTypeIndex = Math.floor(value / 2)
                    const size = value - courseTypeIndex * 2

                    const courseObj = {
                        ...this.menuList[weekdayIndex][mealTypeIndex][courseTypeIndex],
                        date: this.menuList[weekdayIndex][mealTypeIndex][courseTypeIndex].etime,
                        weekday: weekdayIndex + 1,
                        mealType: mealTypeIndex + 1,
                        courseType: courseTypeIndex + 1,
                        size
                    }
                    orderList.push(courseObj)
                })

                this.$store.commit("setOrderList", orderList)

                uni.navigateTo({
                    url: "/pages/menu/confirm"
                });
            },
        },

        async onPullDownRefresh() {
            this.orderedMap = new Map()
            this.orderedCountList = [0, 0, 0, 0, 0, 0, 0]
            this.totalPrice = 0

            // const now = new Date(this.nowDateStr.replace(/\.|\-/g, '/'))
            const now = new Date()
            // uni.setNavigationBarTitle({
            //     title: `选餐（今 ${now.pattern("yyyy年MM月dd日")}）`
            // })

            const todayIndex = DateList.findIndex(day => now.pattern("yyyy-MM-dd") === day["dayStr"])
            let selectedDate = now
            if (todayIndex != null) {
                if (DateList[todayIndex]["type"] == 0 && now.getHours() < 8) {
                    selectedDate = now
                } else {
                    const nextDay = DateList.slice(todayIndex + 1).find(day => day["type"] === 0)
                    if (nextDay) {
                        selectedDate = new Date(`${nextDay["dayStr"]}T${now.pattern("HH:mm:ss")}`)
                    }
                }
            }
            this.selectedDate = selectedDate
            console.log(selectedDate)

            const selectedWeekday = this.selectedDate.getDay() == 0 ? 7 : this.selectedDate.getDay()
            const hour = this.selectedDate.getHours()

            this.navbarActiveIndex = selectedWeekday - 1

            const monday = new Date(this.selectedDate.getTime() + (1 - selectedWeekday) * 24 * 3600 * 1000)
            const sunday = new Date(this.selectedDate.getTime() + (7 - selectedWeekday) * 24 * 3600 * 1000)

            this.weekDateStr = `${monday.pattern("yyyy.MM.dd")} - ${sunday.pattern("yyyy.MM.dd")}（今 ${now.pattern("yyyy.MM.dd")}）`

            const menuList = []
            for (let i = 0; i < 7; i++) {
                const weekday = []
                for (let j = 0; j < 3; j++) {
                    const mealType = []
                    for (let k = 0; k < 2; k++) {
                        const course = {
                            name: `套餐${String.fromCharCode("A".charCodeAt() + k)}`,
                            dishList: [],
                            display: false
                        }
                        mealType.push(course)
                    }
                    weekday.push(mealType)
                }
                menuList.push(weekday)
            }
            this.menuList = menuList

            try {
                const data = await this.request({
                    url: "/Food",
                    method: "GET",
                    data: {
                        time: this.selectedDate.pattern("yyyy-MM-dd")
                    }
                })

                uni.stopPullDownRefresh()

                console.log(data)
                const courseList = data.data

                // Arrange response data
                courseList.forEach(course => {
                    const weekday = course.weekId
                    const mealType = Math.floor((course.typeId - 1) / 2) + 1
                    const courseIndex = (course.typeId - 1) % 2
                    
                    const dishList = []
                    for (let key in course) {
                        if (key.match(/^food.*$/i)) {
                            dishList.push(course[key].trim().replace(/[\r\n]/g, ""))
                        }
                    }
                    
                    menuList[weekday - 1][mealType - 1][courseIndex] = {
                        ...course,
                        ...menuList[weekday - 1][mealType - 1][courseIndex],
                        dishList,
                        // display: selectedWeekday == weekday && (hour >= 8 && hour < 16)
                        display: false
                    }
                })
                console.log(menuList)
                this.menuList = JSON.parse(JSON.stringify(menuList))

                // this.request({
                //     url: "/FoodData/ByUserId",
                //     method: "GET",
                //     data: {
                //         pageNum: 1,
                //         pageSize: 10,
                //         userId: this.user.id,
                //         timeStart: this.selectedDate.pattern("yyyy-MM-dd"),
                //         timeEnd: this.selectedDate.pattern("yyyy-MM-dd")
                //     }
                // }).then(data => {
                //     console.log(data)
                //     const order = data.data.list.find(order => !order.mark)
                //     if (order) {
                //         const selectedDateOrder = JSON.parse(JSON.stringify(this.selectedDateOrder))
                //         for (let key in order) {
                //             if (key.match(/^(morning|noon|night)([a-z])(max|min)?$/i)) {
                //                 if (order[key]) {
                //                     const mealType = RegExp.$1.toLowerCase() === "morning" ? 1 : (RegExp.$1.toLowerCase() === "noon" ? 2 : 3)
                //                     const courseType = RegExp.$2.toUpperCase().charCodeAt() - 'A'.charCodeAt() + 1
                //                     const size = !RegExp.$3 ? 0 : (RegExp.$3.toLowerCase() === "max" ? 0 : 1)
                //                     selectedDateOrder[mealType - 1][courseType - 1] = size
                //                 }
                //             }
                //         }
                //         this.selectedDateOrder = selectedDateOrder
                //         console.log(this.selectedDateOrder)
                //     } else {
                //         for (let j = 0; j < 3; j++) {
                //             for (let k = 0; k < 2; k++) {
                //                 this.menuList[selectedWeekday - 1][j][k].display = (hour >= 8 && hour < 16)
                //             }
                //         }
                //     }
                // }).catch(err => {
                //     console.log(err)
                //     for (let j = 0; j < 3; j++) {
                //         for (let k = 0; k < 2; k++) {
                //             this.menuList[selectedWeekday - 1][j][k].display = (hour >= 8 && hour < 16)
                //         }
                //     }
                // })
            } catch (error) {
                console.log(error)
                uni.stopPullDownRefresh()
                uni.showToast({
                    icon: "none",
                    title: "获取菜单失败，请重试",
                    duration: 2000
                });
            }
        },

        onLoad() {
            try {
                const user = uni.getStorageSync("user")
                console.log(user)
				if (user) {
					this.$store.commit("setUser", user)
				} else {
					uni.redirectTo({
						url: "/pages/login/index"
                    })
                    return
				}
			} catch (err) {
                // error
                console.log(err)
            } 

            uni.startPullDownRefresh()
        },

        onShow() {
            // #ifdef MP-WEIXIN  
            if(wx.hideHomeButton){  
                wx.hideHomeButton();  
            }  
            // #endif
        },
        
        watch: {
        }
	}
</script>

<style lang="scss">
    .menu-container{
        display: flex;
        flex-direction: column;
        height: 100%;

        .notification {
            width: 100%;
            height: 20px;
            font-size: 12px;
            line-height: 20px;
            background: #FFFFFF;
            text-align: center;
            color: #A8A8A8;
            border-bottom: 1px solid #F5F5F5;
        }

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
                    right: 0;
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
        height: calc(100% - 150px);
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
                                background: #FFFFFF;
                                border: 1px solid #F5F5F5;
                                // border-radius: 10px;

                                .course-title {
                                    font-weight: bold;
                                    line-height: 2.5;
                                    flex-shrink: 0;
                                }

                                .course-content {
                                    width: 100%;
                                    flex-grow: 1;
                                    display: flex;
                                    flex-direction: column;
                                    justify-content: space-between;
                                    align-items: center;

                                    .course-dish {
                                        display: flex;
                                        flex-direction: column;
                                        align-items: center;
                                        line-height: 1.8;
                                    }

                                    .course-select-area {
                                        box-sizing: border-box;
                                        width: 100%;
                                        height: auto;
                                        display: flex;
                                        flex-direction: row-reverse;

                                        .course-select-icon-container {
                                            flex-grow: 1;
                                            display: flex;
                                            justify-content: flex-end;
                                            align-items: center;
                                            padding: 15px 10px;

                                            .course-select-icon {
                                                margin-right: 2px;
                                            }
                                        }
                                    }
                                }

                                .course-content-none {
                                    width: 100%;
                                    height: 190px;
                                    line-height: 190px;
                                    text-align: center;
                                }
                            }
                        }
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
