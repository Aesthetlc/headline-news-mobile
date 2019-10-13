<template>
  <div class="loginForm">
    <van-nav-bar title="欢迎登录" />

    <van-notice-bar :text="gonggao" left-icon="volume-o" />

    <!-- 验证 -->
    <ValidationObserver tag="form" ref="loginForm">
      <!-- 登录表单 -->
      <van-cell-group>
        <ValidationProvider class="phone" tag="div" name="手机号" rules="required" v-slot="{ errors }">
          <van-icon name="phone-o" />
          <van-field
            v-model="user.mobile"
            clearable
            label="手机号"
            placeholder="请输入手机号"
            :error-message="errors[0]"
          />
        </ValidationProvider>

        <ValidationProvider class="code" tag="div" name="验证码" rules="required" v-slot="{ errors }">
          <van-icon name="orders-o" />
          <van-field
            v-model="user.code"
            type="password"
            label="验证码"
            placeholder="请输入验证码"
            :error-message="errors[0]"
          />
          <van-button class="sendCode" :disabled="disabledState" size="small" type="default" @click="countDown ">{{ sendCode }}</van-button>
        </ValidationProvider>
      </van-cell-group>
      <!-- /登录表单 -->
    </ValidationObserver>

    <div class="btn-wrap">
      <van-button
        class="loginButton"
        loading-text="加载中..."
        :loading="isLoginLoading"
        :disabled="disabledState"
        type="info"
        @click="goLogin"
      >登录</van-button>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/user'
export default {
  name: 'login',
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      },
      isLoginLoading: false,
      // 公告
      gonggao:
        '2019年10月11日0点-2019年12月12月0点停机维护，请广大客户合理安排使用时间，给你能带来的麻烦，还请谅解！',
      sendCode: '发送验证码',
      countDownTime: 60,
      disabledState: false
    }
  },
  methods: {
    async goLogin () {
      try {
        let isValid = await this.$refs.loginForm.validate()
        if (!isValid) {
          return
        }
        this.isLoginLoading = true
        this.disabledState = true
        await login(this.user)
        this.$toast.success('登录成功')
        this.isLoginLoading = false
        this.disabledState = false
        this.$router.push('/user')
      } catch (err) {
        if (err.response && err.response.status === 400) {
          this.$toast.fail('手机号或者密码错误')
          this.isLoginLoading = false
        }
      }
    },
    countDown () {
      this.disabledState = true
      this.countDownTime = 60
      this.sendCode = `发送验证码(${this.countDownTime})`
      let stopTime = setInterval(() => {
        --this.countDownTime
        this.sendCode = `发送验证码(${this.countDownTime})`
        if (this.countDownTime === 0) {
          this.sendCode = '发送验证码'
          clearInterval(stopTime)
          this.disabledState = false
        }
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.loginForm {
  .btn-wrap {
    padding: 20px;
    .loginButton {
      border-radius: 10px;
      width: 100%;
      background-color: #6db4fb;
      color: #fff;
    }
  }
  .phone,.code {
    margin-left: 10px;
    display: flex;
    .van-icon {
      font-size: 18px;
      margin-top: 13px;
    }
    .van-cell{
      width: 70%;
    }
    .sendCode{
      margin-top: 5px;
      border-radius: 20px;
      background-color: rgb(237, 237, 237)
    }
  }
}
</style>
