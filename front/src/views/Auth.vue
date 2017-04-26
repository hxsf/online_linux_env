<template>
    <div class="page">
        <div id="auth">
            <Form :label-width="200">
                <Form-item label="姓名" prop="name">
                    <Input v-model="name" placeholder="请输入姓名"></Input>
                </Form-item>
                <Form-item label="密码" prop="passwd">
                    <Input type="password" v-model="pass" placeholder="请输入密码"></Input>
                </Form-item>
                <Form-item>
                    <Button type="primary" @click="handleSubmit">提交</Button>
                    <Button type="ghost" @click="handleReset" style="margin-left: 8px">重置</Button>
                </Form-item>
            </Form>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                name: '',
                pass: '',
            };
        },
        methods: {
            handleSubmit() {
                fetch('/v1/auth', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `username=${this.name}&password=${this.pass}`,
                    // body: {
                    //     username: this.name,
                    //     password: this.pass,
                    // },
                })
                .then(resp => resp.json())
                .then((data) => {
                    this.$store.commit('token', data.token);
                    this.$router.push('/');
                })
                .catch((err) => {
                    console.error(err);
                });
            },
            handleReset() {
                this.name = '';
                this.pass = '';
            },
        },
    };
</script>
<style scoped>
.page {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    justify-content: center;
    align-content: center;
    align-items: center;
}
#auth {
    display: flex;
    flex-grow: 0;
    width: 500px;
    height: 300px;
}
</style>
