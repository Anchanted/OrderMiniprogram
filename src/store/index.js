import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        weekdayList: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        globalMenuList: [],
        orderList: [],
        user: {
            areaId: 2,
            areaName: "华北油田公司",
            id: 1,
            mark: 0,
            password: "010337",
            roleId: 3,
            roleName: "一般用户",
            stationId: 1,
            stationName: "公司办公室（党委办公室）",
            stime: "2020-07-18 16:12:12",
            telephone: "13833759376",
            username: "王海涛",
            wellId: 1,
            wellName: "处领导"
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