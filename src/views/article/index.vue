<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="文章详情"></van-nav-bar>
    <!-- /导航栏 -->

    <!-- 加载中 loading -->
    <van-loading class="article-loading" v-if="loading" />
    <!-- /加载中 loading -->

    <!-- 文章详情 -->
    <div class="detail" v-else-if="article.title">
      <h3 class="title">{{ article.title }}</h3>
      <div class="author">
        <van-image round width="2rem" height="2rem" fit="fill" :src="article.aut_photo" />
        <div class="text">
          <p class="name">{{ article.aut_name }}</p>
          <p class="time">{{ article.pubdate | relativeTime }}</p>
        </div>
        <van-button
          round
          size="small"
          type="info"
          @click="onFollow"
        >{{ article.is_followed ? "取消关注":"+ 关注" }}</van-button>
      </div>
      <div class="content" v-html="article.content"></div>
      <div class="zan">
        <van-button
          round
          size="small"
          hairline
          type="primary"
          plain
          :icon="article.attitude === 1 ? 'good-job' : 'good-job-o'"
          @click="onLike"
        >{{ article.attitude===1 ? "取消点赞":"点赞" }}</van-button>&nbsp;&nbsp;&nbsp;&nbsp;
        <van-button
          round
          size="small"
          hairline
          type="danger"
          plain
          icon="delete"
          @click="onDislike"
        >{{ article.attitude===0 ? "取消不喜欢":"不喜欢" }}</van-button>
      </div>
    </div>
    <!-- /文章详情 -->

    <!-- 加载失败的消息提示 -->
    <div class="error" v-else>
      <!--
        stop 是阻止冒泡
        prevent 是阻止元素的默认行为
      -->
      <p>
        网络超时，点击
        <a href="#" @click.prevent="loadArticle">刷新</a> 试一试。
      </p>
    </div>
    <!-- /加载失败的消息提示 -->
    <article-comment/>
  </div>
</template>

<script>
import { getArticleMsgById, addLike, deleteAddLike, addDislike, deleteDislike } from '@/api/articles'
import { FollowUser, unFollowUser } from '@/api/user'
import ArticleComment from './components/article-comment'
export default {
  name: 'ArticleIndex',
  components: {
    ArticleComment
  },
  data () {
    return {
      loading: true, // 控制加载中的 loading 状态
      article: {} // 文章详情
    }
  },

  created () {
    this.onLoadArticleMsgById()
  },

  methods: {
    /**
     * 获取文章详情
     */
    async onLoadArticleMsgById () {
      this.loading = true
      try {
        const { data } = await getArticleMsgById(this.$route.params.articleId)
        this.article = data.data
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },

    /**
     * 关注/取消关注
     */
    async onFollow () {
      if (this.article.is_followed) {
        await unFollowUser(this.article.aut_id)
      } else {
        await FollowUser(this.article.aut_id)
      }
      this.article.is_followed = !this.article.is_followed
    },

    /**
     * 点赞/取消点赞
     */
    async onLike () {
      const articleId = this.article.art_id.toString()
      if (this.article.attitude === 1) {
        await deleteAddLike(articleId)
        this.article.attitude = -1
      } else {
        await addLike(articleId)
        this.article.attitude = 1
      }
    },

    /**
     * 不喜欢/取消不喜欢
     */
    async onDislike () {
      const articleId = this.article.art_id.toString()
      if (this.article.attitude === 0) {
        await deleteDislike(articleId)
        this.article.attitude = -1
      } else {
        await addDislike(articleId)
        this.article.attitude = 0
      }
    }
  }
}
</script>

<style scoped lang='less'>
.article-container {
  position: absolute;
  left: 0;
  top: 0;
  overflow-y: scroll;
  width: 100%;
  height: 100%;
}
.article-loading {
  padding-top: 100px;
  text-align: center;
}
.error {
  padding-top: 100px;
  text-align: center;
}
.detail {
  padding: 50px 10px;
  .title {
    font-size: 16px;
  }
  .zan {
    text-align: center;
  }
  .author {
    padding: 10px 0;
    display: flex;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.3;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img {
      max-width: 100%;
      background: #f9f9f9;
    }
  }
}
</style>
