const mixin = {
    data() {
        return {
            apiUrl: "http://172.16.0.102:8096/",
            // apiUrl: "https://yddc.oilhb.com:8097/"
        }
    },
    computed: {
        nowDate() {
            const fakeDateStr = "2020-08-04T13:"
            const now = new Date()
            const fakeISODate = new Date(`${fakeDateStr}${now.pattern("mm:ss")}Z`)
            const fakeDate = new Date(fakeISODate.getTime() + fakeISODate.getTimezoneOffset() * 60 * 1000)
            return fakeDate
        }
    },
    methods: {
        request({ url, method, data, header }) {
            return new Promise((resolve, reject) => {
                uni.request({
                    url: `${this.apiUrl}${url}`,
                    method,
                    data,
                    header,
                    success: (res) => {
                        resolve(res.data);
                    },
                    fail: (err) => {
                        reject(err)
                    }
                });
            })
        }
    }
}

export default mixin