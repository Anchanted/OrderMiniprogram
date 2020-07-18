<template>
	<div class="home-content">
        <div class="grid-container">
            <div class="grid-item" @tap="tap1">
                <image class="logo" src="/static/logo.png"></image>
                <span>系统管理</span>
            </div>
            <div class="grid-item">
                <image class="logo" src="/static/logo.png"></image>
                <span>公告通知</span>
            </div>
            <div class="grid-item">
                <image class="logo" src="/static/logo.png"></image>
                <span>人事档案</span>
            </div>
            <div class="grid-item">
                <image class="logo" src="/static/logo.png"></image>
                <span>步骤审批</span>
            </div>
            <div class="grid-item">
                <image class="logo" src="/static/logo.png"></image>
                <span>任务管理</span>
            </div>
            <div class="grid-item">
                <image class="logo" src="/static/logo.png"></image>
                <span>项目管理</span>
            </div>
            <div class="grid-item">
                <image class="logo" src="/static/logo.png"></image>
                <span>会议管理</span>
            </div>
            <div class="grid-item">
                <image class="logo" src="/static/logo.png"></image>
                <span>考勤管理</span>
            </div>
            <div class="grid-item">
                <image class="logo" src="/static/logo.png"></image>
                <span>地图</span>
            </div>
        </div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {

		},
		methods: {
            tap1() {
                uni.showLoading({
                    title: "系统管理"
                });

                setTimeout(function () {
                    uni.hideLoading();
                }, 2000);
            }
		}
	}
</script>

<style lang="scss">
	.home-content {
		// height: 400rpx;
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;

        .grid-container {
            width: 750rpx;
            height: 750rpx;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: repeat(3, 1fr);
            place-items: center center;

            .grid-item {
                border: 1px solid black;
                text-align: center;
                display: flex;
                flex-direction: column;
                align-items: center;

                .logo {
                    display: block;
                    width: 100rpx;
                    height: 100rpx;
                }
            }
        }
	}
</style>
