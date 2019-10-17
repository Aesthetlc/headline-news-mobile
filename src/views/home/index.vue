<template>
  <div class="home">
    <!-- 导航栏 -->
    <van-nav-bar fixed>
      <van-button
        class="search-btn"
        slot="title"
        round
        type="info"
        size="small"
        icon="search"
        @click="$router.push('/search')"
      >搜索</van-button>
    </van-nav-bar>
    <!--fixed 固定定位-->

    <!-- 频道展示 -->
    <!--swipeable 左右滑动-->
    <!--animated 启切换标签内容时的转场动画-->
    <van-tabs v-model="active" swipeable animated>
      <!-- 面包菜单按钮 -->
      <div slot="nav-right" class="wap-nav" @click="changePopupState">
        <van-icon name="wap-nav" size="34" class="icon" />
      </div>
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
                    <van-image height="80" :src="img" lazy-load />
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

    <!-- 弹层 -->
    <van-popup v-model="isPopupstate" round closeable position="bottom" :style="{ height: '92%' }">
      <div class="myChannel">
        <van-cell title="我的频道" :border="false" size="large">
          <van-button
            type="danger"
            size="mini"
            @click="isEditShow = !isEditShow"
          >{{ isEditShow? "完成" : "编辑" }}</van-button>
        </van-cell>
        <van-grid :column-num="4" :gutter="10">
          <van-grid-item
            v-for="(channel,index) in channels"
            :key="channel.id"
            :text="channel.name"
            @click="changeMyChannel(index)"
          >
            <van-icon
              v-show="isEditShow"
              v-if="channel.id!==0"
              class="close-icon"
              slot="icon"
              name="close"
              size="20px"
            />
          </van-grid-item>
        </van-grid>
      </div>
      <div class="recommendChannels">
        <van-cell title="推荐频道" :border="false" size="large" />
        <van-grid :column-num="4" :gutter="10">
          <van-grid-item
            v-for="channel in getrecommendChannels"
            :key="channel.id"
            :text="channel.name"
            @click="addMyChannel(channel)"
          />
        </van-grid>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { getChannels, getAllChannels } from '@/api/channel.js'
import { getArticles } from '@/api/articles.js'
import { setItem, getItem } from '@/utils/storage.js'
export default {
  name: 'HomeIndex',
  data () {
    return {
      searchText: '', // 搜索text
      active: 0, // 默认选中第1个tab
      channels: [], // 频道列表
      articles: [], // 文章列表
      isPopupstate: false, // 弹层状态 默认关闭
      isEditShow: false, // 频道编辑的状态
      allChannels: [] // 全部频道
    }
  },
  methods: {
    // 加载频道
    async onloadChannel () {
      let channels = []
      const channelFromLostorage = getItem('channel')
      if (channelFromLostorage) {
        channels = channelFromLostorage
      } else {
        const { data } = await getChannels()
        channels = data.data.channels
      }

      this.extendChannel(channels)
      this.channels = channels
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
    },
    // 获得全部频道
    async getAllChannelList () {
      const { data } = await getAllChannels()
      const channels = data.data.channels
      this.extendChannel(channels)
      this.allChannels = channels
    },
    // 控制弹层状态
    changePopupState () {
      this.isPopupstate = true
    },
    // 将推荐频道增加到我的频道中
    addMyChannel (channel) {
      this.channels.push(channel)
    },
    // 移除我的频道
    changeMyChannel (index) {
      // 为true ===>编辑   // 为false ===>跳转
      if (this.isEditShow) {
        if (index !== 0) {
          this.channels.splice(index, 1)
        }
      } else {
        this.active = index // 跳转
        this.isPopupstate = false // 弹窗关闭
      }
    },
    // 导出extend=>channel=>forEach
    extendChannel (channels) {
      channels.forEach(item => {
        // 为每个频道添加上相应的属性
        item.finished = false
        item.loading = false // 上拉加载loading
        item.articles = [] // 添加文章列表
        item.timestamp = null // 定义时间戳
        item.pullLoading = false // 下拉加载loading
      })
    },
    // 搜索
    onSearch () {
      console.log('搜索了')
    }
  },
  created () {
    this.onloadChannel()
    this.getAllChannelList()
  },
  computed: {
    // 推荐频道 ====> 全部频道 - 我的频道
    getrecommendChannels () {
      const arr = []
      this.allChannels.forEach(channel => {
        const result = this.channels.find(item => item.id === channel.id)
        if (!result) {
          arr.push(channel)
        }
      })
      return arr
    }
  },
  watch: {
    channels (newVal) {
      setItem('channel', newVal)
    }
  }
}
</script>

<style lang="less" scoped>
.home {
  .van-tabs {
    .article-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .meta span {
        margin-right: 20px;
      }
    }
    /deep/.van-tabs__wrap {
      position: fixed;
      z-index: 2;
      top: 46px;
      right: 35px;
      left: 0;
    }
    /deep/ .van-tabs__content {
      margin-top: 90px;
      margin-bottom: 50px;
    }
    //面包组件
    .wap-nav {
      position: fixed;
      right: 0;
      width: 40px;
      background-color: #fff;
      .icon {
        line-height: 44px;
        height: 44px;
      }
    }
  }
  .search-btn {
    background-color: rgb(91, 171, 251);
    width: 100%;
  }
  .myChannel {
      margin-top: 30px;
      .close-icon {
        position: absolute;
        top: -10px;
        right: -10px;
      }
    }
}
</style>
