<template>
    <div class="layout" :class="{'layout-hide-text': spanLeft < 5}">
        <Row type="flex">
            <i-col :span="spanLeft" class="layout-menu-left">
                <Menu active-name="1" theme="dark" width="auto" @on-select="selectMenu" :active-name="selected">
                    <div class="layout-logo-left">
                        <Icon class="icon" type="erlenmeyer-flask" size="36"></Icon>
                        <span class="title" v-show="spanLeft >= 5">在线实验平台</span>    
                    </div>
                    <Menu-item class="menu-item" name="status">
                        <Icon type="ios-speedometer" :size="iconSize"></Icon>
                        <span class="layout-text">总览</span>
                    </Menu-item>
                    <Menu-item class="menu-item" name="usage">
                        <Icon type="ios-keypad" :size="iconSize"></Icon>
                        <span class="layout-text">运行情况</span>
                    </Menu-item>
                    <Menu-item class="menu-item" name="images">
                        <Icon type="ios-analytics" :size="iconSize"></Icon>
                        <span class="layout-text">镜像管理</span>
                    </Menu-item>
                </Menu>
            </i-col>
            <i-col :span="spanRight">
                <div class="layout-header">
                    <i-button type="text" @click="toggleClick">
                        <Icon type="navicon" size="32"></Icon>
                    </i-button>
                </div>
                <div class="layout-content">
                    <router-view class="layout-content-main"></router-view>
                </div>
                <Copy class="layout-copy"></Copy>
            </i-col>
        </Row>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                selected: 'status',
                spanLeft: 5,
                spanRight: 19,
            };
        },
        computed: {
            iconSize() {
                return this.spanLeft === 5 ? 14 : 32;
            },
        },
        methods: {
            toggleClick() {
                if (this.spanLeft === 5) {
                    this.spanLeft = 2;
                    this.spanRight = 22;
                } else {
                    this.spanLeft = 5;
                    this.spanRight = 19;
                }
            },
            selectMenu(name) {
                this.$router.push({ name });
            },
        },
        beforeRouteEnter(to, from, next) {
            next((vm) => {
                // eslint-disable-next-line no-param-reassign
                vm.selected = to.name;
            });
        },
    };
</script>
<style scoped>
    .layout{
        width: 100%;
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }
    .layout > .ivu-row-flex {
        min-height: 100%;
    }
    .layout-content {
        min-height: 200px;
        margin: 15px;
        overflow: hidden;
        background: #fff;
        border-radius: 4px;
    }
    .layout-content-main{
        padding: 10px;
    }
    .layout-copy{
        text-align: center;
        padding: 10px 0 20px;
        color: #9ea7b4;
    }
    .layout-menu-left{
        background: #464c5b;
    }
    .layout-header{
        height: 48px;
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }
    .layout-logo-left{
        width: 90%;
        height: 40px;
        line-height: 40px;
        /*background: #5b6270;*/
        color: #fff;
        text-align: center;
        overflow: hidden;
        border-radius: 3px;
        margin: 5px auto;
    }
    .layout-logo-left .icon {
        line-height: 40px;
    }
    .layout-logo-left .title {
        font-size: 24px;
        line-height: 14px;
    }
    .layout-ceiling-main a{
        color: #9ba7b5;
    }
    .layout-hide-text .layout-text{
        display: none;
    }
    .ivu-col{
        transition: width .2s ease-in-out;
    }
    .link {
        display: block;
        width: 100%;
    }
</style>
