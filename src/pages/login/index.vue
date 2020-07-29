<template>
    <div class="login-page">
        <div class="bg" :style="{ backgroundImage: `url(${imageUrl})` }"></div>
        <image class="logo" src="/static/image/logo.jpg"></image>
        <image class="title" src="/static/image/2.png"></image>
        <div class="error" v-if="hasError">用户名或密码错误</div>
        <div class="form-item">
            <!-- <label>手机号：</label> -->
            <input class="inputText" type="text" placeholder="请输入手机号" v-model.trim="telephone" />
        </div>
        <div class="form-item">
            <!-- <label>密码：</label> -->
            <input class="inputText" type="password" placeholder="请输入密码" v-model.trim="password" />
        </div>
        <button class="butt" @click="login" id="btn" >登录</button>
        <div class="bbb">
            <div class="yh">
                <checkbox-group @change="onChangeCheckbox">
                    <checkbox value="xieyi"></checkbox>
                    <text class="agreement-text" @tap="yhxy">用户协议</text>
                </checkbox-group>
                <text class="forget-text" @tap="wjmm">忘记密码？</text>
            </div>
        </div>
        <!-- <button class="cancel_btn" @click="backLogin">{{backText}}</button> -->
    </div>
</template>


<script>
import { mapState } from "vuex"

export default {
    data() {
        return {
            telephone: "",
            password: "",
            imageUrl: "/static/image/bj.jpg",
            agreementChecked: false,
            hasError: false
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
            } else if (!this.agreementChecked) {
                uni.showToast({
                    icon:'none',
                    title:'请勾选用户协议',
                    duration:2000,
                })
            } else {
                this.hasError = false

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
                    if (data.data) {
                        uni.setStorageSync("user", data.data)
                        this.$store.commit("setUser", data.data)
                        if (this.password.length < 12) {
                            uni.navigateTo({
                                url: "/pages/user/password"
                            })
                        } else {
                            uni.reLaunch({
                                url: "/pages/menu/index"
                            })
                        }
                    } else {
                        this.hasError = true
                    }
                }).catch(err => {
                    console.log(err)
                    uni.hideLoading()
                })
            }

        },
        wjmm() {
            uni.showModal({
                title:'友情提示',
                content:'如忘记密码，请联系餐厅管理员进行修改！',
                success:function(res){
                    console.log('用户点击确定');
                }
            })
        },
        onChangeCheckbox({ detail }) {
            this.agreementChecked = detail.value.length > 0
        },
        yhxy() {
            uni.showModal({
                title:'用户协议',
                content:'华北石油管理局有限公司华北油田宾馆同意按照本协议的规定及其不时发布的操作规则向用户提供餐饮统计服务。为获得餐饮统计服务， 本小程序服务使用人（以下称“用户”）需在认真阅读及独立思考的基础上认可、同意本协议的全部条款并按照页面上的提示完成全部的注册程序。用户在进行注册过程中点击“同意”按钮即表示用户完全接受本服务协议。如用户对本服务协议或协议的任何部分存有任何异议，应终止注册程序（或停止使用本小程序服务）。',
                success:function(res){
                    console.log('用户点击确定');
                }
            })
        },
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
        display: flex;
        flex-direction: column;
        align-items: center;

        .logo {
            width: 70px; 
            height: 70px;
            margin-top: 80px;
        }

        .title {
            width:210px;
            height:50px;
            margin-top: 10px;
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
        position: relative;  
        padding-bottom: 3px;
        margin-top: 10px;
        display: flex;
        justify-content: center;

        input { 
            width: 250px; 
            height: 40px; 
            border: 1px solid #fff; 
            border-radius: 25px;
            font-size: 18px; 
            background-color: #fff; 
            outline: none;
            display: flex;
            justify-content: center;
        }
    }

    .butt { 
        width: 250px;
        height: 40px; 
        margin-top: 10px;
        border: 0; 
        border-radius: 25px; 
        font-size: 18px; 
        color: #1f6f4a; 
        outline: none; 
        cursor: pointer; 
        background-color: #fff; 
    }
        
    .bbb{
        display: flex;
        justify-content: center;
    }
    .yh{
        width: 250px;
        // padding-left: 40px;
        padding-top: 20px;
        display: flex;
        justify-content: space-between;

        .agreement-text {
            color: #09BB07;
            text-decoration: underline;
        }

        .forget-text {
            color: #FFFFFF;
        }
    }
    .bg{
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
</style>