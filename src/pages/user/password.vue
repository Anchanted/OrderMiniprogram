<template>
	<div class="change-password-page">
        <div>
            <div></div>
        </div>
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
                user: state => state.userInfo
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
    }
</style>
