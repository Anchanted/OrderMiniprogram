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
            <div class="order-table-title">{{`${user.stationName}订餐统计`}}</div>
            <div class="table order-table">
                <div class="thead">
                    <div class="tr">
                        <div class="th">姓名</div>
                        <div class="th">金额（元）</div>
                    </div>
                </div>
                <div class="tbody">
                    <div class="tr" v-for="(user, index) in userList" :key="index">
                        <div class="td">{{user.username}}</div>
                        <div class="td">{{user.ncountMoney}}</div>
                    </div>
                </div>
                <div class="tfoot">
                    <div class="tr">
                        <div class="td">总计</div>
                        <div class="td">{{userList.reduce((acc, user) => acc += user.ncountMoney, 0)}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex"

	export default {
		data() {
            const now = new Date();
			return {
                startDate: now.pattern("yyyy-MM-dd"),
                endDate: now.pattern("yyyy-MM-dd"),
                calendarStartDate: "2020-01-01",
                calendarEndDate: "2021-01-01",
                userList: []
			}
        },
        computed: {
            ...mapState({
                user: state => state.user
            })
        },
        methods: {
            bindStartDateChange(e) {
                this.startDate = e.target.value
            },
            bindEndDateChange(e) {
                this.endDate = e.target.value
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

                uni.showLoading({
                    title: '加载中'
                });

                try {
                    const data = await this.request({
                        url: "/FoodData/ByMoney",
                        data: {
                            stationId: this.user.stationId,
                            timeStart: this.startDate,
                            timeEnd: this.endDate
                        }
                    })
                    console.log(data)

                    if (data.data) this.userList = data.data.sort((a, b) => a.userId - b.userId)
                    uni.hideLoading()
                } catch (error) {
                    console.log(error)
                    uni.hideLoading()
                    uni.showToast({
                        icon:'none',
                        title:'数据加载失败，请重试',
                        duration:2000,
                    })
                    this.userList = []
                }
            }
        },
		onLoad() {
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
            margin: 30px 0 80px;

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
                    grid-template-columns: 1fr 1fr;
                }
            }
        }
    }
</style>
