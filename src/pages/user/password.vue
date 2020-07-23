<template>
	<div class="change-password-page">
        <div class="input-bar-wrapper">
            <div class="input-bar">
                <div class="input-type">账号</div>
                <input :placeholder="user.telephone" placeholder-style="color: #888888" disabled="true" />
            </div>
        </div>

        <div class="input-bar-wrapper">
            <div class="input-bar">
                <div class="input-type">当前密码</div>
                <input placeholder="请输入当前登录密码" placeholder-style="color: #888888" password="true" confirm-type="next" />
            </div>
        </div>

        <div class="input-bar-wrapper">
            <div class="input-bar">
                <div class="input-type">新密码</div>
                <input placeholder="请输入新的登录密码" placeholder-style="color: #888888" password="true" confirm-type="next" />
            </div>
        </div>

        <div class="input-bar-wrapper">
            <div class="input-bar">
                <div class="input-type">确认密码</div>
                <input placeholder="请再次输入新的登录密码" placeholder-style="color: #888888" password="true" confirm-type="done" />
            </div>
        </div>

        <button class="confirm-button" type="primary">提交</button>
    </div>
</template>

<script>
import { mapState } from "vuex"

	export default {
		data() {
			return {
                
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
            margin-top: 20px;
            width: 100%;
            border-radius: 10rpx;
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

            .input-type {
                width: 180rpx;
                flex-shrink: 0;
            }

            input {
                flex-grow: 1;
            }
        }

        .confirm-button {
            margin-top: 20px;
            width: 700rpx;
        }
    }
</style>
