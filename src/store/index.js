import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        weekdayList: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        globalMenuList: [],
        orderList: [],
        userInfo: {
            name: "张逸宁",
            phone: "133xxxxxxxx",
            second: "公司办公室",
            third: "行政事务科"
        },
    },
    mutations: {
        setGlobalMenuList(state, payload) {
            state.globalMenuList = payload
        },
        setOrderList(state, payload) {
            state.orderList = payload
        }
    },
    actions: {
    },
    modules: {
    }
})