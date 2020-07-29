const mixin = {
    data() {
        return {
            apiUrl: "http://221.195.189.163:8096",
            nowDateStr: "2020-07-13 12:00:00"
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