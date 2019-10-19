<template>
  <div class="chat-container">
    <!-- 导航栏 -->
    <van-nav-bar
      title="小智同学"
      left-arrow
      @click-left="$router.back()"
      fixed
    />
    <!-- /导航栏 -->

    <!-- 消息列表 -->
    <div class="message-list" ref="message-list">
      <div
        class="message-item"
        :class="{ reverse: item.isMe }"
        v-for="(item, index) in messages"
        :key="index"
      >
        <van-image
          class="avatar"
          slot="icon"
          round
          width="30"
          height="30"
          :src="item.photo"
        />
        <div class="title">
          <span>{{ item.message }}</span>
        </div>
      </div>
    </div>
    <!-- /消息列表 -->

    <!-- 发送消息 -->
    <van-cell-group class="send-message">
      <van-field
        v-model="message"
        center
        clearable
      >
        <van-button
          slot="button"
          size="small"
          type="primary"
          @click="onSendMessage"
        >发送</van-button>
      </van-field>
    </van-cell-group>
    <!-- /发送消息 -->
  </div>
</template>

<script>
import io from 'socket.io-client'
import { getItem, setItem } from '@/utils/storage'

export default {
  name: 'ChatIndex',
  data () {
    return {
      message: '', // 发送的消息
      socket: '', // 定义socket 为了socket共享
      messages: getItem('chat-messages') || [] // 本地话读取
    }
  },

  watch: {
    messages () {
      setItem('chat-messages', this.messages)
      const messageList = this.$refs['message-list']
      this.$nextTick(() => {
        messageList.scrollTop = messageList.scrollHeight
      })
    }
  },

  created () {
    // 建立连接
    const socket = io('http://ttapi.research.itcast.cn')

    this.socket = socket

    // 当客户端与服务器建立连接之后===>触发connect事件
    socket.on('connect', () => {
      console.log('成功连接了')
    })

    // 监听服务端的消息
    socket.on('message', data => {
      // 将接收到的数据添加在messages数组中
      this.messages.push({
        message: data.msg,
        isMe: false,
        photo: 'http://file.qqtouxiang.com/nvsheng/2019-10-18/e921986336bf31cafdf83489e2ed7ce7.jpg'
      })
    })
  },

  mounted () {
    const messageList = this.$refs['message-list']
    // 卷起的高度 = html的高度
    messageList.scrollTop = messageList.scrollHeight
  },

  methods: {
    // 发送的方法
    onSendMessage () {
      const message = this.message.trim()
      if (!message) {
        return
      }
      // 发送消息
      this.socket.emit('message', {
        msg: message,
        timestamp: Date.now()
      })

      // 把消息存放到数组中
      this.messages.push({
        message,
        isMe: true,
        photo: 'http://file.qqtouxiang.com/nansheng/2019-10-18/7d01fe492e5185d763a65b1308f987c4.jpg'
      })

      // 清空文本框
      this.message = ''
    }
  }
}
</script>

<style scoped lang='less'>
.chat-container {
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 46px 0 50px 0;
  top: 0;
  left: 0;
  box-sizing: border-box;
  background: #f5f5f6;
  .message-list {
    height: 100%;
    overflow-y: scroll;
    .message-item {
      display: flex;
      align-items: center;
      padding: 10px;
      .title {
        background: #fff;
        padding: 5px;
        border-radius: 6px;
      }
      .avatar {
        margin-right: 5px;
      }
    }
    .reverse {
      flex-direction: row-reverse;
      .title {
        margin-right: 5px;
      }
    }
  }

  .send-message {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #f5f5f6 !important;
  }
}
</style>
