<script>
	import allSettled from "promise.allsettled"

	export default {
		onLaunch() {
			console.log('App Launch')

			//#ifdef MP-WEIXIN  
			if (!wx.canIUse('getUpdateManager')) {
				wx.showModal({
					title: '提示',
					content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
				})
				return
			}

			const updateManager = wx.getUpdateManager()
			const promises = [
				new Promise(resolve => {
					updateManager.onCheckForUpdate(res => resolve(res))
				}) 
			]

			const user = uni.getStorageSync("user")
			console.log(user)
			if (user && user.username && user.password) {
				promises.push(new Promise((resolve, reject) => {
					this.request({
						url: "/ulogin",
						method: "POST",
						header: {
							"content-type": "application/x-www-form-urlencoded"
						},
						data: {
							telephone: user.telephone,
							password: user.password
						}
					}).then(data => {
						if (data.data && JSON.stringify(data.data) !== "{}") this.$store.commit("setUser", user)
						resolve(data)
					}).catch(error => {
						this.$store.commit("setUser", user)
						reject(error)
					})
				}))
			}

			allSettled(promises).then(result => {
				console.log(result)
				if (result[0].value.hasUpdate) {
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
				} else {
					if (user && user.username && user.password) {
						if (result.length === 1) return

						if (result[1].status === "fulfilled") {
							const data = result[1].value
							console.log(data)
							if (data.data && JSON.stringify(data.data) !== "{}") {
								if (!data.data.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9]{12,20}$/g)) {
									uni.reLaunch({
										url: "/pages/user/password?change=1"
									})
								}
							} else {
								uni.reLaunch({
									url: "/pages/login/index"
								})
							}
						} else {
							const error = result[1].value
							console.log(error)
						}
					} else {
						uni.reLaunch({
							url: "/pages/login/index"
						})
					}
				}
			})
			// if (res.hasUpdate) {
			// 	updateManager.onUpdateReady(() => {
			// 		wx.showModal({
			// 			title: '更新提示',
			// 			content: '新版本已经准备好，是否重启应用？',
			// 			success: (res) => {
			// 				if (res.confirm) {
			// 					// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
			// 					updateManager.applyUpdate()
			// 				}
			// 			}
			// 		})
			// 	})
			// 	updateManager.onUpdateFailed(() => {
			// 		// 新的版本下载失败
			// 		wx.showModal({
			// 			title: '已有新版本',
			// 			content: '新版本已经上线，请您删除当前小程序，重新搜索打开'
			// 		})
			// 	})
			// }
			
			// const user = uni.getStorageSync("user")
			// console.log(user)
			// if (user && user.username && user.password) {
			// 	const data = this.request({
			// 		url: "/ulogin",
			// 		method: "POST",
			// 		header: {
			// 			"content-type": "application/x-www-form-urlencoded"
			// 		},
			// 		data: {
			// 			telephone: user.telephone,
			// 			password: user.password
			// 		}
			// 	}).then(data => {
			// 		console.log(data)
			// 		if (data.data && JSON.stringify(data.data) !== "{}") {
			// 			this.$store.commit("setUser", user)
			// 			if (!data.data.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9]{12,20}$/g)) {
			// 				uni.reLaunch({
			// 					url: "/pages/user/password?change=1"
			// 				})
			// 			}
			// 		} else {
			// 			uni.reLaunch({
			// 				url: "/pages/login/index"
			// 			})
			// 		}
			// 	}).catch(error => {
			// 		console.log(error)
			// 		this.$store.commit("setUser", user)
			// 	})
			// } else {
			// 	uni.reLaunch({
			// 		url: "/pages/login/index"
			// 	})
			// }
			//#endif
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

<style lang="scss">
	@import "./static/css/iconfont/iconfont.css";

    page {
        height: 100%;
		background-color: #EFEFEF;
	}
	
	.table {
		.tr {
			width: 100%;
			display: grid;
			place-items: center stretch;
			place-content: center stretch;
		}

		.th, .td {
			// box-sizing: border-box;
			padding: 8px 10px;
			// border-top: 1rpx solid #DFDFDF;
			// border-bottom: 1rpx solid #DFDFDF;
			border: 1rpx solid #DFDFDF;
			text-align: center;
		}

		.thead, .tbody, .tfoot {
			width: 100%;
		}

		.thead {
			.tr {
				// border-top: none;
				font-weight: bold;
				background: #09BB07;
				color: #FFFFFF;
				border-top-left-radius: 10rpx;
				border-top-right-radius: 10rpx;

				.th:first-child {
                    border-top-left-radius: 10rpx;
                }

                .th:last-child {
                    border-top-right-radius: 10rpx;
                }
			}
		}

		.tbody {

		}

		.tfoot {
			.tr {
				box-sizing: border-box;
				border: 2rpx solid #09bb07;

				border-bottom-left-radius: 10rpx;
				border-bottom-right-radius: 10rpx;

				.td:first-child {
                    border-bottom-left-radius: 10rpx;
                }

                .td:last-child {
                    border-bottom-right-radius: 10rpx;
                }
			}
		}
	}
</style>
