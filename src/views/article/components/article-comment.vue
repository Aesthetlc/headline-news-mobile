<template>
  <div class="article-comments">
    <!-- 评论列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="(item, index) in list"
        :key="index"
        :title="item.aut_name"
      >
        <van-image
          slot="icon"
          round
          width="30"
          height="30"
          style="margin-right: 10px;"
          :src="item.aut_photo"
        />
        <span style="color: #466b9d;" slot="title">{{ item.aut_name }}</span>
        <div slot="label">
          <p style="color: #363636;">{{ item.content }}</p>
          <p>
            <span style="margin-right: 10px;">{{ item.pubdate | relativeTime }}</span>
            <van-button
              size="mini"
              type="default"
              @click="onReplyShow(item)"
            >回复 {{ item.reply_count }}</van-button>
          </p>
        </div>
        <van-icon
          slot="right-icon"
          :name="item.is_liking ? 'like' : 'like-o'"
          color="red"
          @click="onCommentLike(item)"
        />
      </van-cell>
    </van-list>
    <!-- 评论列表 -->

    <!-- 发布评论 -->
    <van-cell-group class="publish-wrap">
      <van-field
        v-model="commentText"
        clearable
        placeholder="请输入评论内容"
      >
        <van-button
          slot="button"
          size="mini"
          type="info"
          @click="onAddComment"
        >发布</van-button>
      </van-field>
    </van-cell-group>
    <!-- /发布评论 -->

    <!-- 评论回复 -->
    <van-popup
      v-model="isReplyShow"
      round
      position="bottom"
      :style="{ height: '90%' }"
    >
      <comment-reply
        :comment="currentComment"
        v-if="isReplyShow"
        @close="isReplyShow = false"
      />
    </van-popup>
    <!-- /评论回复 -->
  </div>
</template>

<script>
import CommentReply from './comment-reply'
import { getComments, addComment, addCommentLike, deleteCommentLike } from '@/api/comment'
export default {
  name: 'ArticleComment',
  components: {
    CommentReply
  },
  props: {},
  data () {
    return {
      list: [], // 评论列表
      loading: false, // 上拉加载更多的 loading
      finished: false, // 是否加载结束
      offset: null, // 评论内容
      commentText: '',
      isReplyShow: false,
      currentComment: {} // 查看回复的当前评论
    }
  },

  methods: {
    /**
     * 加载评论数据
     */
    async onLoad () {
      // 1.加载数据
      const { data } = await getComments({
        type: 'a', // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
        source: this.$route.params.articleId, // 源id，文章id或评论id
        offset: this.offset // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
        // limit // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
      })

      // 2.赋值
      this.list.push(...data.data.results)

      // 3.关闭loading
      this.loading = false

      // 4.完成
      if (data.data.results.length) {
        this.offset = data.data.last_id
      } else {
        this.finished = true
      }
    },

    /**
     * 发布评论
     */
    async onAddComment () {
      // 对输入的内容去除空格处理
      const commentText = this.commentText.trim()
      if (!commentText) {
        return
      }
      const { data } = await addComment({
        target: this.$route.params.articleId, // 评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
        content: commentText // 评论内容
        // art_id: ''// 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数
      })
      this.list.unshift(data.data.new_obj)
      // 清空输入文本框
      this.commentText = ''
    },

    /**
     * 评论点赞/取消评论点赞
     */
    async onCommentLike (comment) {
      const commentId = comment.com_id.toString()
      // 如果已点赞，则取消点赞
      if (comment.is_liking) {
        await deleteCommentLike(commentId)
      } else {
        // 否则，点赞
        await addCommentLike(commentId)
      }
      comment.is_liking = !comment.is_liking
    },

    /**
     * 展示回复弹层
     */
    onReplyShow (comment) {
      this.currentComment = comment
      this.isReplyShow = true
    }
  }
}
</script>

<style scoped lang='less'>
.publish-wrap {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}

.van-list {
  margin-bottom: 45px;
}
</style>
