<template>
    <div class="login-page">
        <image class="bg" src="/static/image/bj.jpg"></image>
        <image class="logo" src="/static/image/logo.jpg"></image>
        <image class="title" src="/static/image/4.png"></image>
        <div class="error" v-if="hasError">用户名或密码错误</div>
        <div class="form-item">
            <!-- <label>手机号：</label> -->
            <input class="inputText" type="text" placeholder="请输入手机号" @input="onTelephoneInput" />
        </div>
        <div class="form-item">
            <!-- <label>密码：</label> -->
            <input class="inputText" type="password" placeholder="请输入密码" @input="onPasswordInput" />
        </div>
        <button class="butt" @click="login" id="btn" >登录</button>
        <div class="bbb">
            <div class="yh">
                <checkbox-group @change="onChangeCheckbox">
                    <!-- <checkbox value="xieyi"></checkbox> -->
                    <!-- <text class="agreement-text" @tap="yhxy">用户协议</text> -->
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
<<<<<<< HEAD
            // imageUrl: "/static/image/bj.jpg",
=======
>>>>>>> master
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
            // } else if (!this.agreementChecked) {
            //     uni.showToast({
            //         icon:'none',
            //         title:'请勾选用户协议',
            //         duration:2000,
            //     })
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
        onTelephoneInput({ detail }) {
            this.telephone = detail.value
        },
        onPasswordInput({ detail }) {
            this.password = detail.value
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
        // yhxy() {
        //     uni.showModal({
        //         title:'用户协议',
        //         content:'',
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
        width: 250px; 
        margin-top: 10px;
        border-radius: 25px;
        background-color: #fff; 
        display: flex;
        justify-content: center;

        input { 
            width: 210px;
            height: 40px;
            font-size: 18px; 
            outline: none;
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
</style>