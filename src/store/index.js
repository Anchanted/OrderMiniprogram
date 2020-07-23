import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        globalMenuList: [],
        orderList: [],
        user: {},
    },
    mutations: {
        setUser(state, payload) {
            state.user = payload
        },
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