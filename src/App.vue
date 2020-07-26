<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
			// #ifdef MP-WEIXIN  
			if(wx.hideHomeButton){  
				wx.hideHomeButton();  
			}  
			// #endif
		},
		onHide: function() {
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
