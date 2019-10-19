<template>
  <div class="search">
    <van-search
      @input="searchKeyWords"
      v-model="searchText"
      placeholder="请输入搜索关键词"
      show-action
      shape="round"
      @search="onSearch(searchText)"
    >
      <div slot="action" @click="$router.back()">取消</div>
    </van-search>

    <!-- 搜索关键词 -->
    <van-cell-group v-if="searchText">
      <van-cell
        icon="search"
        @click="onSearch(item)"
        v-for="(item,index) in searchList"
        :key="index"
      >
        <span v-html="highlight(item)" slot="title"></span>
      </van-cell>
    </van-cell-group>

    <!-- 历史记录 -->
    <van-cell-group v-else>
      <van-cell title="历史记录">
        <template v-if="isDeleteShow==false">
          <span @click="searchHistories=[]">全部删除</span>&nbsp;&nbsp;
          <span @click="isDeleteShow=true">完成</span>
        </template>
        <van-icon @click="isDeleteShow = false" v-else name="delete" />
      </van-cell>
      <van-cell
        :title="item"
        v-for="(item, index) in searchHistories"
        :key="item"
        @click="onSearch(item)"
      >
      <van-icon @click.stop="searchHistories.splice(index,1)" v-if="isDeleteShow==false" name="delete" />
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { getSearchSuggestion } from '@/api/search'
import { debounce } from 'lodash'
import { getItem, setItem } from '@/utils/storage'
export default {
  name: 'searchIndex',
  data () {
    return {
      searchText: '',
      searchList: [], // 搜索列表
      searchHistories: getItem('search-histories') || [], // 储存历史记录  先从本地读取--->没有则为空
      isDeleteShow: true // 历史记录状态切换
    }
  },
  watch: {
    searchHistories (value) {
      setItem('search-histories', value)
    }
  },
  methods: {
    onSearch (str) {
      const index = this.searchHistories.indexOf(str)
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      // 把搜索的数据存起来
      this.searchHistories.unshift(str)
      // 本地持久化
      setItem('search-histories', this.searchHistories)
      // 路由跳转
      this.$router.push(`/search-result/${str}`)
    },
    // 搜索检索
    searchKeyWords: debounce(async function () {
      const searchText = this.searchText.trim()
      if (searchText === '') {
        this.searchList = [] // 当searchText为空的时候，不要存在任何记录
        return
      }
      const { data } = await getSearchSuggestion({
        q: searchText
      })
      this.searchList = data.data.options
    }, 300),
    // 设置搜索关键词高亮
    highlight (value) {
      const reg = new RegExp(this.searchText, 'g')
      return value.replace(
        reg,
        `<span style="color:red">${this.searchText}</span>`
      )
    }
  }
}
</script>

<style>
</style>
