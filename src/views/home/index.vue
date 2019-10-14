<template>
  <div class="home">
    <!-- 导航栏 -->
    <van-nav-bar title="首页" />

    <!-- 频道展示 -->
    <!--swipeable 左右滑动-->
    <!--animated 启切换标签内容时的转场动画-->
    <van-tabs v-model="active" swipeable animated>
      <van-tab v-for="channel in channels" :key="channel.id" :title="channel.name">
        <!-- 文章展示-->
        <van-list
          v-model="channel.loading"
          :finished="channel.finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <!-- 文章下拉刷新 -->
          <van-pull-refresh v-model="channel.pullLoading" @refresh="onRefresh">
            <van-cell
              v-for="(article, index) in channel.articles"
              :key="index"
              :title="article.title"
            >

              <div slot="label">
                <van-grid :border="false" :column-num="3">
                  <van-grid-item v-for="(img, index) in article.cover.images" :key="index">
                    <van-image height="80" :src="img" lazy-load/>
                  </van-grid-item>
                </van-grid>
                <div class="article-info">
                  <div class="meta">
                    <span>{{ article.aut_name }}</span>
                    <span>{{ article.comm_count }}评论</span>
                    <span>{{ article.pubdate| relativeTime}}</span>
                  </div>
                </div>
              </div>
            </van-cell>

            <van-cell
              v-for="article in channel.articles"
              :key="article.art_id.toString()"
              :title="article.title"
            />
          </van-pull-refresh>
        </van-list>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { getChannels } from '@/api/channel.js'
import { getArticles } from '@/api/articles.js'
export default {
  name: 'HomeIndex',
  data () {
    return {
      active: 0, // 默认选中第1个tab
      channels: [], // 频道列表
      articles: [] // 文章列表
    }
  },
  methods: {
    // 加载频道
    async onloadChannel () {
      const { data } = await getChannels()
      data.data.channels.forEach(item => {
        // 为每个频道添加上相应的属性
        item.finished = false
        item.loading = false // 上拉加载loading
        item.articles = [] // 添加文章列表
        item.timestamp = null // 定义时间戳
        item.pullLoading = false // 下拉加载loading
      })
      this.channels = data.data.channels
    },
    // 上拉加载
    async onLoad () {
      const activeChannel = this.channels[this.active]
      // 1.获取文章的方法
      const { data } = await getArticles({
        channel_id: activeChannel.id,
        timestamp: activeChannel.pre_timestamp || Date.now(), // 时间戳
        with_top: 1 // 是否包含置顶
      })
      // 2.数据赋值
      // 数据的合并
      // activeChannel.articles = activeChannel.articles.concat(data.data.results) //此种合并方式需要重新赋值
      activeChannel.articles.push(...data.data.results) // ...展开运算符
      // 3.关闭loading
      activeChannel.loading = false
      // 4.判断下一页是否存在
      if (data.data.pre_timestamp) {
        activeChannel.timestamp = data.data.pre_timestamp
      } else {
        activeChannel.finished = true
      }
    },
    // 下拉刷新
    async onRefresh () {
      const activeChannel = this.channels[this.active]
      // 1.获取数据
      const { data } = await getArticles({
        channel_id: activeChannel.id,
        timestamp: Date.now(),
        with_top: 1 // 是否包含置顶
      })
      // 2.合并数据
      activeChannel.articles.unshift(...data.data.results)
      // 3.关闭加载
      activeChannel.pullLoading = false
      // 4.提示刷新成功
      this.$toast.success('刷新成功')
    }
  },
  created () {
    this.onloadChannel()
  }
}
</script>

<style lang="less" scoped>
.home {
  .article-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .meta span {
      margin-right: 10px;
    }
  }
}
</style>
