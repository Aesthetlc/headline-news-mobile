<template>
  <div class="userForm">
    <van-nav-bar
      title="个人信息"
      right-text="保存"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />

    <van-cell-group>
      <van-cell title="头像" value="内容" />
      <van-cell title="昵称" value="内容" />
      <van-cell title="介绍" value="内容" />
    </van-cell-group>

    <van-cell-group>
      <van-cell title="性别" value="内容" />
      <van-cell title="生日" value="内容" />
    </van-cell-group>
    <!-- <van-popup v-model="show" position="bottom" :style="{ height: '50%' }" /> -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      show: ''
    }
  },
  methods: {
    onClickLeft () {
      this.$toast('返回')
    },
    onClickRight () {
      this.$toast('按钮')
    }
  }
}
</script>

<style lang="less" scoped>
.userForm {
  background-color: #eee;
  .van-cell-group {
    margin-bottom: 20px;
  }
}
</style>
