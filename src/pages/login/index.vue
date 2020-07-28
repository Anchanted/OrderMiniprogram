<template>
    <div>
        <div class="bg" :style="{ backgroundImage: `url(${imageUrl})` }"></div>
            <div class="ig"><image style="width:70px;height:70px" src="/static/image/logo.jpg"></image>
        </div>
        <div class="bt"><image style="width:210px;height:50px" src="/static/image/2.png"></image></div>
        <div class="form-item">
            <!-- <label>手机号：</label> -->
            <input class="inputText" type="text" placeholder="请输入手机号" v-model="telephone" />
        </div>
        <div class="form-item">
            <!-- <label>密码：</label> -->
            <input class="inputText" type="password" placeholder="请输入密码" v-model="password" />
        </div>
        <button class="butt" @click="login" id="btn" >登录</button>
        <div class="bbb">
            <div class="yh">
                <checkbox color="#FFCC33" style="transform:scale(0.9)" value="xieyi" @click="yhxy" id="xieyi">用户协议</checkbox>
                <text @click="wjmm">忘记密码</text>
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
            imageUrl: "/static/image/bj.jpg"
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
            } else {
                this.request({
                    url: this.apiUrl + "/ulogin",
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
                    uni.setStorageSync("user", data.data)
                    if (this.password.length<12) {
                        uni.navigateTo({
                            url: "/pages/user/password"
                        })
                    } else {
                        uni.reLaunch({
                            url: "/pages/menu/index"
                        })
                    }
                    // this.$store.commit("setUser", res[1].data.data)
                }).catch(err => {
                    console.log(err)
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
    .form-item { 
        position: relative;  
        margin: 0 auto; 
        padding-bottom: 3px;
        display: flex;
        justify-content: center;
        font-family: 'Times New Roman';
    }

    .form-item input { 
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
    .butt { 
        width: 250px;
        height: 40px; 
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
        padding-top: 10px;
        display: flex;
        justify-content: space-between;
    }
    .bg{
        position:fixed;
        top:0;
        left:0;
        width:100%;
        height:100%;
        background-size:cover;
        z-index:-1;
        opacity: 0.8;
        filter: blur(10px);
    }
    .ig{
        width: 100%;
        height: 150px;

        display: flex;
        justify-content: center;
        align-items: flex-end;
    }

    .ok_btn{
        // opacity: 0.8;
        margin: 0 auto;
        width:80%;
        height: 37px;
    }
    .bt{
        // height: 40px;
        display: flex;
        justify-content: center;
        // font-size: 25px;
    }
    text{
        padding-top: 3px;
        transform:scale(0.9);
    }
</style>