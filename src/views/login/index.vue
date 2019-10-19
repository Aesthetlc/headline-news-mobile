<template>
  <div class="loginForm">
    <!-- 导航栏 -->
    <van-nav-bar title="欢迎登录" />

    <van-notice-bar :text="gonggao" left-icon="volume-o" />

    <!-- 验证 -->
    <ValidationObserver ref="loginForm">
      <!-- 登录表单 -->
      <van-cell-group>
        <ValidationProvider class="phone" tag="div" name="手机号" rules="required|phone" v-slot="{ errors }">
          <van-icon name="phone-o" />
          <van-field
            v-model="user.mobile"
            clearable
            label="手机号"
            placeholder="请输入手机号"
            :error-message="errors[0]"
          />
        </ValidationProvider>

        <ValidationProvider class="code" tag="div" name="验证码" rules="required|max:6|min:6" v-slot="{ errors }">
          <van-icon name="orders-o" />
          <van-field
            v-model="user.code"
            type="password"
            label="验证码"
            placeholder="请输入验证码"
            :error-message="errors[0]"
          />
          <van-button
            class="sendCode"
            :disabled="disabledState"
            size="small"
            type="default"
            @click="countDown "
          >{{ sendCode }}</van-button>
        </ValidationProvider>
      </van-cell-group>
      <!-- /登录表单 -->
    </ValidationObserver>

    <div class="btn-wrap">
      <van-button class="loginButton" type="info" @click="goLogin">登录</van-button>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/user'
import { setItem } from '@/utils/storage.js'
export default {
  name: 'login',
  data () {
    return {
      user: {
        mobile: '13811111111',
        code: '246810'
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
      let isValid = await this.$refs.loginForm.validate()
      if (!isValid) {
        return
      }
      // 加载
      const toast = this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: 'spinner',
        message: '登录中...'
      })
      try {
        const { data } = await login(this.user)
        toast.clear()
        this.$toast.success({
          duration: 2000,
          message: '登录成功'
        })
        // 登录成功之后将token存起来
        this.$store.commit('setUser', data.data)
        // 防止页面刷新token消失，将token存到本地
        setItem('user', data.data)
        this.$router.push('/')
      } catch (err) {
        toast.clear()
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
  .phone,
  .code {
    margin-left: 10px;
    display: flex;
    .van-icon {
      font-size: 18px;
      margin-top: 13px;
    }
    .van-cell {
      width: 70%;
    }
    .sendCode {
      margin-top: 5px;
      border-radius: 20px;
      background-color: rgb(237, 237, 237);
    }
  }
}
</style>
