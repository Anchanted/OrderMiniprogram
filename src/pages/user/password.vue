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
                    v-model="oldPassword" />
            </div>
        </div>

        <div class="input-bar-wrapper">
            <div class="input-bar-header">新密码</div>
            <div class="input-bar">
                <input placeholder="请输入新的登录密码" placeholder-style="color: #888888" password="true" confirm-type="next"
                    v-model="newPassword" />
            </div>
        </div>

        <div class="input-bar-wrapper">
            <div class="input-bar-header">确认新密码</div>
            <div class="input-bar">
                <input placeholder="请再次输入新的登录密码" placeholder-style="color: #888888" password="true" confirm-type="done"
                    v-model="renewPassword" />
            </div>
        </div>

        <div class="restriction">新密码必须是12-20个英文字母（区分大小写）或数字</div>

        <button class="confirm-button" type="primary">提交</button>
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
            }),
        },
        methods: {
            
        },
		mounted() {
            
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
