<template>
    <div>
    <div class="bg" :style="{ backgroundImage: `url(${imageUrl})` }"></div>
    <div class="ig"><image style="width:70px;height:70px" src="/static/image/logo.jpg"></image>
    </div>
    <div class="bt">点餐小程序</div>
    <div class="form-item">
    <!-- <label>手机号：</label> -->
    <input class="inputText" bindinput="getUserName" type="text" placeholder="请输入手机号" v-model="telephone" />
    </div>
    <div class="form-item">
    <!-- <label>密码：</label> -->
    <input class="inputText" bindinput="getPassword" type="password" placeholder="请输入密码" v-model="password" />
    </div>
    <button  class="butt" @click="doLogin" id="btn" >登录</button>
    <div class="bbb"><div class="yh">
        <checkbox  color="#FFCC33" style="transform:scale(0.9)" value="xieyi" @click="yhxy" id="xieyi">用户协议</checkbox>
        <text @click="wjmm">忘记密码</text>
    </div></div>
    <!-- <button class="cancel_btn" @click="backLogin">{{backText}}</button> -->
    </div>
</template>


<script>
import { mapState } from "vuex"

export default {
    data() {
    return {
    imageUrl: "/static/image/bj.jpg"
    }
    },

    methods: {
    bindLogin() {
				const data = {
					telephone: this.telephone,
					password: this.password,
				};
				
				console.log(data);
				uni.request({
					url: 'http://172.16.0.102:8096/ulogin?',
					method: 'POST',
					data: {telephone:this.telephone,password:this.password},
					success: res => {

						console.log(res.data);
						
					},
					fail: () => {
						
					},
					complete: () => {}
				});
                },
                
    getUserName:function(e){
        var value = e.detail.value;  //获取输入的内容
        this.setData({
            username:value, 
        })
        wx.setStorageSync('username', value); //获取到的username存到本地
    },
    getPassword:function(e){
        var value = e.detail.value;
        this.setData({
            userpass:value,
        })
        wx.setStorageSync('userpass', value);
    },
    doLogin:function(e){

        var that = this;
        if(that.data.username.length==0||that.data.userpass.length==0){
            wx.showToast({
                icon:'none',
                title:'用户名或密码不能为空',
                duration:2000,
            })
        }else{
            wx.request({
                url: 'https://URL',
                data: {
                    username:this.data.username,
                    userpass:this.data.userpass
                },
                method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                // header: {}, // 设置请求的 header
                success: function(res){
                    console.log("res.data"+res.data.code),
                    that.setData({
                        userId:res.data.data,
                        code:res.data.data,
                    })
                    console.log(res.data);
                    if(that.data.code == 200){
                        wx.showToast({
                            title:'登录成功'
                        })
                        wx.setStorageSync('userId', res.data.data);
                        console.log(res.data.data);
                        wx.redirectTo({
                            url: '/pages/user/password',
                            
                        })
                    }else{
                        wx.showToast({
                            icon:'none',
                            title:'用户名或密码错误',
                        })
                    }
                },
                fail: function() {
                    // fail
                },
                complete: function() {
                    // complete
                }
            })
        }
    },
        wjmm(){
                    uni.showModal({
                    title:'友情提示',
                    content:'如忘记密码，请联系餐厅管理员进行修改！',
                    success:function(res){
                        console.log('用户点击确定');
                        uni.navigateTo({
                        url:"/pages/login/index"
                        })
                    }
                })


		},
        yhxy(){
                    uni.showModal({
                    title:'用户协议',
                    content:'华北石油管理局有限公司华北油田宾馆同意按照本协议的规定及其不时发布的操作规则向用户提供餐饮统计服务。为获得餐饮统计服务， 本小程序服务使用人（以下称“用户”）需在认真阅读及独立思考的基础上认可、同意本协议的全部条款并按照页面上的提示完成全部的注册程序。用户在进行注册过程中点击“同意”按钮即表示用户完全接受本服务协议。如用户对本服务协议或协议的任何部分存有任何异议，应终止注册程序（或停止使用本小程序服务）。',
                    success:function(res){
                        console.log('用户点击确定');
                        uni.navigateTo({
                        url:"/pages/login/index"
                        })
                    }
                })
                },
       
        

        },
        
    
}
</script>

//         doJudge(){
//             var xieyi=document.get("xieyi");
//             if(!xieyi.checked){
//                 alert("请先阅读并勾选注册协议！");
//                 return;
//             }
            
//         }
//     },
//     mounted() {
//         // this.login()
//     }
</script>

<style lang="scss">
.form-item { position: relative;  margin: 0 auto; padding-bottom: 2px;display: flex;
justify-content: center;font-family: Times New Roman; }
.form-item input { width: 250px; height: 40px; border: 1px solid #fff; border-radius: 25px; font-size: 18px; background-color: #fff; outline: none;display: flex;
justify-content: center;}
.butt { width: 250px; height: 40px; border: 0; border-radius: 25px; font-size: 18px; color: #1f6f4a; outline: none; cursor: pointer; background-color: #fff; }
    
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
    height: 40px;
    display: flex;
    justify-content: center;
    font-size: 25px;
    }
    text{
        padding-top: 3px;
        transform:scale(0.9);
    }



</style>