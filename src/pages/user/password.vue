<template>
	<div class="change-password-page">
        <div class="input-bar-wrapper">
            <div class="input-bar-header">账号</div>
            <div class="input-bar">
                <input :placeholder="user.telephone" placeholder-style="color: #888888" disabled="true" />
            </div>
        </div>

        <div class="input-bar-wrapper">
            <div class="input-bar-header">当前密码</div>
            <div class="input-bar">
                <input placeholder="请输入当前登录密码" placeholder-style="color: #888888" password="true" confirm-type="next" 
                    @input="onInputOldPassword" />
            </div>
            <div v-if="!oldPassword" class="input-bar-error">未输入当前密码</div>
        </div>

        <div class="input-bar-wrapper">
            <div class="input-bar-header">新密码</div>
            <div class="input-bar">
                <input placeholder="请输入新的登录密码" placeholder-style="color: #888888" password="true" confirm-type="next"
                    @input="onInputNewPassword" />
            </div>
        </div>

        <div class="input-bar-wrapper">
            <div class="input-bar-header">确认新密码</div>
            <div class="input-bar">
                <input placeholder="请再次输入新的登录密码" placeholder-style="color: #888888" password="true" confirm-type="done"
                    @input="onInputRenewPassword" />
            </div>
            <div v-if="renewPassword !== newPassword" class="input-bar-error">两次新密码输入不一致</div>
        </div>

        <div class="restriction" :style="{ color: !!newPassword.match(/^[a-zA-Z0-9]{12,20}$/g) ? '' : '#FF0000' }">新密码必须是12-20个英文字母（区分大小写）或数字</div>

        <button class="confirm-button" type="primary" @tap="onTapSubmit">提交</button>
    </div>
</template>

<script>
import { mapState } from "vuex"

	export default {
		data() {
			return {
                oldPassword: "",
                newPassword: "",
                renewPassword: ""
			}
        },
        computed: {
            ...mapState({
                user: state => state.user
            })
        },
        methods: {
            onTapSubmit() {
                let errMsg = ""
                if (!this.oldPassword) {
                    errMsg = "未输入当前密码"
                } else if (!this.newPassword.match(/^[a-zA-Z0-9]{12,20}$/g)) {
                    errMsg = "新密码必须是12-20个英文字母（区分大小写）或数字"
                } else if (this.renewPassword !== this.newPassword) {
                    errMsg = "两次新密码输入不一致"
                } else if (this.oldPassword === this.newPassword) {
                    errMsg = "新旧密码不能一致"
                }
                
                if (errMsg) {
                    uni.showToast({
                        icon: "none",
                        title: errMsg,
                        duration: 2000
                    })
                    return
                }

                console.log("修改密码")
                uni.showLoading({
                    title: "加载中"
                });
                if (this.encryptPassword(this.oldPassword) !== this.user.password) {
                    uni.hideLoading()
                    uni.showToast({
                        icon: "none",
                        title: "当前登录密码输入错误",
                        duration: 2000
                    })
                    return
                } else {
                    this.request({
                        url: "/ulogin/Updata",
                        method: "GET",
                        header: {
                            "content-type": "application/x-www-form-urlencoded"
                        },
                        data: {
                            id: this.user.id,
                            password: this.encryptPassword(this.newPassword)
                        }
                    }).then(data => {
                        console.log(data)
                        uni.hideLoading()
                        uni.removeStorageSync("user")
                        uni.reLaunch({
                            url:"/pages/login/index"
                        })
                    }).catch(err => {
                        console.log(err)
                        uni.hideLoading()
                        uni.showToast({
                            icon: "none",
                            title: err,
                            duration: 2000
                        })
                    })
                }
            },
            onInputOldPassword({ detail }) {
                this.oldPassword = detail.value
            },
            onInputNewPassword({ detail }) {
                this.newPassword = detail.value
            },
            onInputRenewPassword({ detail }) {
                this.renewPassword = detail.value
            },
        },
		onLoad() {
            
		},
	}
</script>

<style lang="scss">
    .change-password-page {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;

        >div {
            margin-top: 15px;
            width: 100%;
            border-radius: 10rpx;
        }

        .input-bar-wrapper {
            .input-bar-header {
                font-size: 14px;
                color: #888888;
                margin: 0 0 8px 20px;
            }

            .input-bar {
                width: 100%;
                height: 50px;
                background: #FFFFFF;
                box-sizing: border-box;
                padding: 0 20px;
                font-size: 17px;
                line-height: 50px;
                display: flex;
                align-items: center;

                input {
                    flex-grow: 1;
                }
            }

            .input-bar-error {
                width: 100%;
                font-size: 14px;
                color: #FF0000;
                margin: 8px 0 0 20px;
            }
        }

        .restriction {
            box-sizing: border-box;
            width: 100%;
            padding: 0 20px;
            font-size: 14px;
            color: #888888;
        }

        .confirm-button {
            box-sizing: border-box;
            margin-top: 20px;
            width: 700rpx;
        }
    }
</style>
