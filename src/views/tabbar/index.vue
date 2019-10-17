<template>
  <div>
    <router-view></router-view>
    <!-- 增加tabbar跳转 -->
    <van-tabbar route>
      <van-tabbar-item replace to="/" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item replace icon="search">问答</van-tabbar-item>
      <van-tabbar-item replace icon="friends-o">视频</van-tabbar-item>
      <!-- <van-tabbar-item replace to="/mine" v-if="$store.state.user" icon="setting-o">我的</van-tabbar-item>
      <van-tabbar-item replace to="/mine" v-else icon="setting-o">未登录</van-tabbar-item> -->
      <van-tabbar-item icon="setting-o" to="/mine">{{ $store.state.user ? '我的' : '未登录'}}</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 0
    }
  }
}
</script>

<style>
</style>
