<template>
    <div class="login-page">
        <!-- <image class="bg" src="/static/image/bj.jpg"></image> -->
        <image class="logo" src="/static/image/logo.png"></image>
        <!-- <image class="title" src="/static/image/4.png"></image> -->
        <div class="title title-zh">宾馆点餐</div>
        <div class="title title-en">Hotel Order</div>
        <div class="error" v-if="errMsg">{{errMsg}}</div>
        <div class="form-item telephone-input">
            <image class="input-icon" src="/static/image/phone.png"></image>
            <input class="form-input" type="text" placeholder="请输入微信号（手机号）" @input="onTelephoneInput" />
        </div>
        <div class="form-item password-input">
            <image class="input-icon" src="/static/image/lock.png"></image>
            <input class="form-input" type="password" placeholder="请输入密码" @input="onPasswordInput" />
        </div>
        <button class="button" @click="login">登录</button>
        <div class="bbb">
            <div class="yh">
                <!-- <checkbox-group @change="onChangeCheckbox">
                    <checkbox value="xieyi"></checkbox>
                    <text class="agreement-text" @tap="yhxy">用户协议</text>
                </checkbox-group> -->
                <text class="forget-text" @tap="wjmm">忘记密码？</text>
            </div>
        </div>
        <image class="bottom-image" src="/static/image/loginbottom.png"></image>
        <div class="beian">冀ICP备B2-20060069-21号</div>
    </div>
</template>


<script>
import { mapState } from "vuex"

export default {
    data() {
        return {
            telephone: "",
            password: "",
            agreementChecked: false,
            errMsg: ""
        }
    },

    methods: {
        login() {
            if (!this.telephone || !this.password){
                uni.showToast({
                    icon:'none',
                    title:'用户名或密码不能为空',
                    duration:2000,
                })
            // } else if (!this.agreementChecked) {
            //     uni.showToast({
            //         icon:'none',
            //         title:'请勾选用户协议',
            //         duration:2000,
            //     })
            } else {
                this.errMsg = ""

                uni.showLoading({
                    title: "加载中"
                });

                this.request({
                    url: "/ulogin",
                    method: "POST",
                    header: {
                        "content-type": "application/x-www-form-urlencoded"
                    },
                    data: {
                        telephone: this.telephone,
                        password: this.password
                    }
                }).then(data => {
                    console.log(data)
                    uni.hideLoading()
                    console.log()
                    if (data.data && JSON.stringify(data.data) !== "{}" && data.data.roleId !== 1) {
                        uni.setStorageSync("user", data.data)
                        this.$store.commit("setUser", data.data)
                        if (!this.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9]{12,20}$/g)) {
                            uni.navigateTo({
                                url: "/pages/user/password?change=1"
                            })
                        } else {
                            uni.reLaunch({
                                url: "/pages/menu/index"
                            })
                        }
                    } else {
                        this.errMsg = "用户名或密码错误"
                    }
                }).catch(err => {
                    console.log(err)
                    uni.hideLoading()
                    this.errMsg = "登录出错，请重试"
                })
            }
        },
        onTelephoneInput({ detail }) {
            this.telephone = detail.value
        },
        onPasswordInput({ detail }) {
            this.password = detail.value
        },
        wjmm() {
            console.log("here")
            uni.showModal({
                title:'友情提示',
                content:'如忘记密码，请联系餐厅管理员进行修改！',
                showCancel: false,
                success:function(res) {
                    console.log('用户点击确定');
                }
            })
        },
        onChangeCheckbox({ detail }) {
            this.agreementChecked = detail.value.length > 0
        },
        // yhxy() {
        //     uni.showModal({
        //         title:'用户协议',
        //         content:'',
        //         showCancel: false,
        //         success:function(res){
        //             console.log('用户点击确定');
        //         }
        //     })
        // },
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
    .login-page {
        width: 100%;
        height: 100%;
        background-color: #ffe243;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;

        .logo {
            width: 250upx; 
            height: 250upx;
            margin-top: 30px;
        }

        .title {
            // width:210px;
            // height:50px;
            // margin-top: 10px;
            color: #342704;
        }

        .title-zh {
            font-weight: bold;
            font-size: 70rpx;
            letter-spacing: 10rpx;
        }

        .title-en {
            font-size: 48rpx;
        }

        .error {
            width: 250px;
            height: 30px;
            line-height: 30px;
            color: #E64340;
            margin-top: 10px;
        }
    }

    .form-item { 
        width: 500rpx; 
        background-color: #ffffff; 
        padding: 5px 0;
        display: flex;
        justify-content: center;
        align-items: center;

        .input-icon {
            width: 60rpx;
            height: 60rpx;
        }

        .form-input { 
            width: 400rpx;
            height: 40px;
            font-size: 18px; 
            outline: none;
            margin-left: 5px;
        }
    }

    .telephone-input {
        margin-top: 10px;
        border-top-left-radius: 20rpx;
        border-top-right-radius: 20rpx;
        border-bottom: 1rpx solid #dddddd;
    }

    .password-input {
        border-bottom-left-radius: 20rpx;
        border-bottom-right-radius: 20rpx;
        border-top: 1rpx solid #dddddd;
    }

    .button { 
        width: 500rpx;
        height: 40px; 
        font-size: 18px; 
        line-height: 40px;
        letter-spacing: 15px;
        margin-top: 15px;
        border: 0; 
        border-radius: 20rpx; 
        outline: none;
        background-color: #2d363d; 
        color: #ffffff;
    }
        
    .bbb{
        display: flex;
        justify-content: center;
    }
    .yh{
        width: 250px;
        // padding-left: 40px;
        margin-top: 50px;
        display: flex;
        justify-content: center;
        z-index: 2;

        .agreement-text {
            color: #09BB07;
            text-decoration: underline;
        }

        .forget-text {
            // font-size: 20px;
            font-weight: bold;
            color: #2d363d;
        }
    }
    .bg{
        display: flex;
        // flex-direction: column;
        // align-items: center;
        // height: 150px;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-size: cover;
        z-index: -1;
        // opacity:  0.8;
        filter:  blur(10px);
    }

    .ok_btn{
        // opacity: 0.8;
        margin: 0 auto;
        width:80%;
        height: 37px;
    }

    .bottom-image {
        width: 750rpx;
        height: 300rpx;
        position: absolute;
        bottom: 0;
    }

    .beian {
        width: 750rpx;
        position: absolute;
        bottom: 30px;
        text-align: center;
        color: #888888;
    }
</style>