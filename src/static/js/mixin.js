const mixin = {
    data() {
        return {
            weekdayList: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
            apiUrl: "http://172.16.0.102:8096/"
        }
    },
    methods: {
        getDateFormat(date, type) {
            const year = date.getFullYear()
            const month = `${date.getMonth() + 1 < 10 ? "0" : ""}${date.getMonth() + 1}`
            const day = `${date.getDate() < 10 ? "0" : ""}${date.getDate()}`

            let concat = ""
            switch (type) {
                case 1:
                    concat = "-"
                    break;
                case 2:
                    concat = "."
                    break;
                default:
                    concat = "-"
                    break;
            }

            return `${year}${concat}${month}${concat}${day}`
        },

        getChineseWeekdayName(date) {
            return this.weekdayList[(date.getDay() == 0 ? 7 : date.getDay()) - 1]
        }
    }
}

export default mixin