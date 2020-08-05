<script>
	export default {
		async onLaunch() {
			console.log('App Launch')
			const user = uni.getStorageSync("user")
            if (user) {
				if (user.username && user.password) {
					try {
						const data = await this.request({
							url: "/ulogin",
							method: "POST",
							header: {
								"content-type": "application/x-www-form-urlencoded"
							},
							data: {
								telephone: user.telephone,
								password: user.password
							}
						})
						console.log(data)
						if (!data.data) {
							uni.reLaunch({
								url: "/pages/login/index"
							})
						} else {
							this.$store.commit("setUser", user)
						}
					} catch (error) {
						console.log(error)
						this.$store.commit("setUser", user)
					}
				}
            } else {
                uni.redirectTo({
                    url: "/pages/login/index"
                })
            }
		},
		onShow() {
			console.log('App Show')
			// #ifdef MP-WEIXIN  
			if(wx.hideHomeButton){  
				wx.hideHomeButton();  
			}  
			// #endif
		},
		onHide() {
			console.log('App Hide')
		}
	}
</script>

<style>
	@import "./static/css/iconfont/iconfont.css";

    page {
        height: 100%;
		background-color: #EFEFEF;
    }
</style>
