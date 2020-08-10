<script>
	export default {
		async onLaunch() {
			console.log('App Launch')

			//#ifdef MP-WEIXIN  
			if (wx.canIUse('getUpdateManager')) {
				const updateManager = wx.getUpdateManager()
				updateManager.onCheckForUpdate(res => {
					// console.log(res)
					// 请求完新版本信息的回调
					if (res.hasUpdate) {
						updateManager.onUpdateReady(() => {
							wx.showModal({
								title: '更新提示',
								content: '新版本已经准备好，是否重启应用？',
								success: (res) => {
									if (res.confirm) {
										// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
										updateManager.applyUpdate()
									}
								}
							})
						})
						updateManager.onUpdateFailed(() => {
							// 新的版本下载失败
							wx.showModal({
								title: '已有新版本',
								content: '新版本已经上线，请您删除当前小程序，重新搜索打开'
							})
						})
					}
				})
			} else {
				wx.showModal({
					title: '提示',
					content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
				})
			}			
			//#endif

			const user = uni.getStorageSync("user")
			console.log(user)
            if (user && user.username && user.password) {
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
					if (data.data && JSON.stringify(data.data) !== "{}") {
						this.$store.commit("setUser", user)
						if (!data.data.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9]{12,20}$/g)) {
							uni.reLaunch({
								url: "/pages/user/password?change=1"
							})
						}
					} else {
						uni.showToast({
							icon: "none",
							title: "here",
							duration: 2000
						});
						uni.reLaunch({
							url: "/pages/login/index"
						})
					}
				} catch (error) {
					console.log(error)
					this.$store.commit("setUser", user)
				}
            } else {
                uni.reLaunch({
                    url: "/pages/login/index"
                })
            }
		},
		onShow() {
			console.log('App Show')
			//#ifdef MP-WEIXIN  
			if(wx.hideHomeButton){  
				wx.hideHomeButton();  
			}  
			//#endif
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
