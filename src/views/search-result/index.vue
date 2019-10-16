<template>
  <div class="search-result">
    <!-- 导航栏 -->
    <van-nav-bar :title="$route.params.q + '的搜索的结果'" fixed left-arrow @click-left="$router.back()" />
    <van-list
      class="search-list"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell v-for="(item,index) in searchList" :key="index" :title="item.title" />
    </van-list>
  </div>
</template>

<script>
import { getSearchText } from '@/api/search'
export default {
  data () {
    return {
      page: 1, // 页数，不传默认为1
      per_page: 10, // 每页数量，不传每页数量由后端决定
      searchList: [], // 搜索之后存放的集合
      loading: false,
      finished: false
    }
  },
  methods: {
    async onLoad () {
      // 1.获取数据
      const { data } = await getSearchText({
        q: this.$route.params.q,
        page: this.page,
        per_page: this.per_page
      })
      // 2.数据赋值
      this.searchList.push(...data.data.results)
      // 3.加载状态结束
      this.loading = false

      // 4.数据加载完成
      if (data.data.page) {
        this.page++
      } else {
        this.finished = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
.search-result {
  .search-list {
    margin-top: 46px;
  }
}
</style>
