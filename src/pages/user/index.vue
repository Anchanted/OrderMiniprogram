<template>
	<div class="user-page">
        <div class="user-info-container">
			<image class="user-image" src="/static/image/user.png" mode="aspectFit"></image>
			<div class="user-info">
				<div class="user-info-name"><span>{{`${user.username} (${user.telephone})`}}</span></div>
				<div class="user-info-secondary"><span>{{user.stationName}}</span></div>
				<div class="user-info-secondary"><span>{{user.wellName}}</span></div>
			</div>
		</div>
		<div class="option-list-container">
			<div class="option-bar" @tap="onTapPassword">
				<span>修改密码</span>
				<span class="iconfont icon-left-arrow"></span>
			</div>
			<div class="option-bar" @tap="onTapUserOrder">
				<span>查看我的订单</span>
				<span class="iconfont icon-left-arrow"></span>
			</div>
			<div class="option-bar" @tap="onTapDepartmentOrder">
				<span>查看部门历史订单</span>
				<span class="iconfont icon-left-arrow"></span>
			</div>
		</div>
		<div class="logout-container" @tap="onTapLogout">
			退出登录
		</div>
	</div>
</template>

<script>
import { mapState } from "vuex"

	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		computed: {
			...mapState({
				user: state => state.user
			})
		},
		methods: {
			onTapPassword() {
				uni.navigateTo({
                    url: '/pages/user/password'
                });
			},
			onTapUserOrder() {
				uni.navigateTo({
                    url: '/pages/order/user'
                });
			},
			onTapDepartmentOrder() {
				uni.navigateTo({
                    url: '/pages/order/department'
                });
			},
			onTapLogout() {
				uni.clearStorageSync("user")
				uni.reLaunch({
                    url: '/pages/login/index'
                });
			}
		},
		onShow() {
			// #ifdef MP-WEIXIN  
			if(wx.hideHomeButton){  
				wx.hideHomeButton();  
			}  
			// #endif
		}
	}
</script>

<style lang="scss">
	.user-page {
		width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;

		>div {
            width: 100%;
            background: #FFFFFF;
        }

		.user-info-container {
			box-sizing: border-box;
			padding: 30px 20px 20px;
			display: flex;
			align-items: center;

			.user-image {
				flex-shrink: 0;
				width: 150rpx;
				height: 150rpx;
				border-radius: 75rpx;
				background: #B2B2B2;
			}

			.user-info {
				flex-grow: 1;
				margin-left: 20px;

				.user-info-name {
					font-size: 18px;
					font-weight: bold;
					margin-bottom: 10px;
				}

				.user-info-secondary {
					margin-top: 4px;
					color: #888888;
					font-size: 14px;
				}
			}
		}

		.option-list-container {
			box-sizing: border-box;
			padding: 0 20px;
			margin-top: 20px;

			.option-bar:not(:last-child) {
				border-bottom: 1rpx solid #DFDFDF;
			}

			.option-bar {
				// font-size: 16px;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 20px 0;
			}
		}

		.logout-container {
			box-sizing: border-box;
			width: 100%;
			height: 60px;
			margin-top: 20px;
			// font-size: 18px;
			line-height: 60px;
			text-align: center;
		}
	}
</style>
