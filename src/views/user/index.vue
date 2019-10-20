<template>
  <div>
    <van-nav-bar
      title="个人信息"
      left-arrow
      right-text="保存"
      @click-right="updateUser"
      @click-left="$router.push({
        name:'mine'
      })"
    />
    <van-cell-group>
      <van-cell title="头像" is-link @click="checkImg">
        <van-image round width="30" height="30" :src="user.photo" />
      </van-cell>
      <van-cell title="昵称" :value="user.name" is-link @click="editUserNameShow" />
      <van-cell title="性别" :value="user.gender === 0 ? '男' : '女'" is-link @click="editUserGender" />
      <van-cell title="生日" :value="user.birthday" is-link @click="editUserBirthdayShow" />
    </van-cell-group>

    <!--
      表单元素的 hidden 表示隐藏这个表单元素
    -->
    <input type="file" ref="file" hidden @change="changeFile" />

    <!-- 编辑用户昵称弹窗 -->
    <van-dialog v-model="isUserNameShow" title="标题" show-cancel-button @confirm="confirmUserName">
      <van-cell-group>
        <van-field :value="user.name" placeholder="请输入用户名" @input="inputUserName" />
      </van-cell-group>
    </van-dialog>
    <!-- /编辑用户昵称弹窗 -->

    <!-- 编辑用户性别上拉菜单 -->
    <van-action-sheet
      v-model="isUserGenderShow"
      :actions="actions"
      cancel-text="取消"
      @cancel="onCancel"
      @select="selectUserGender"
    />
    <!-- /编辑用户性别上拉菜单 -->

    <!-- 编辑用户生日 -->
    <van-popup v-model="isUserBirthdayShow" position="bottom" :style="{ height: '30%' }">
      <van-datetime-picker
        :value="new Date(user.birthday)"
        type="date"
        @confirm="confirmBirthday"
        :min-date="minDate"
        :max-date="maxDate"
      />
    </van-popup>
    <!-- /编辑用户生日 -->
  </div>
</template>

<script>
import { getUserProfile, updateUserPhoto, updateUserMsg } from '@/api/user'
import dayjs from 'dayjs'

export default {
  name: 'UserIndex',
  data () {
    return {
      user: {}, // 存放用户的信息
      isUserNameShow: false, // 昵称的弹窗初始false
      isUserBirthdayShow: false, // 生日的初始弹窗false
      temporaryName: '', // 存放name修改的临时变量
      isUserGenderShow: false, // 性别的初始弹窗 false
      actions: [{ name: '男', value: 0 }, { name: '女', value: 1 }], // 存放性别信息
      minDate: new Date(1900, 0, 1), // 最小时间
      maxDate: new Date() // 最大时间
    }
  },

  created () {
    this.loadUserProfile()
  },

  methods: {
    // 获取用户个人资料
    async loadUserProfile () {
      const { data } = await getUserProfile()
      this.user = data.data
    },

    // 上传头像
    checkImg () {
      this.$refs.file.click()
    },

    // 选择图片(预览)
    changeFile () {
      const fileObj = this.$refs.file.files[0]
      if (fileObj) {
        this.user.photo = window.URL.createObjectURL(fileObj)
      }
    },

    // 保存的方法
    async updateUser () {
      this.$toast.loading({
        mask: true,
        message: '保存中...'
      })
      try {
        const fileObj = this.$refs.file.files[0]
        if (fileObj) {
          const data = new FormData()
          data.append('photo', fileObj)
          await updateUserPhoto(data)
        }
        await updateUserMsg({
          name: this.user.name,
          gender: this.user.gender,
          birthday: this.user.birthday
        })
        this.$toast.success('修改成功')
      } catch (error) {
        console.log(error)
        this.$toast.fail('修改失败')
      }
    },

    // 开启修改昵称的窗口
    editUserNameShow () {
      this.isUserNameShow = true
    },

    // 将输入的数值存入到临时的变量
    inputUserName (value) {
      this.temporaryName = value
    },

    // 修改昵称确认的方法
    confirmUserName () {
      this.user.name = this.temporaryName
    },

    // 弹出性别的弹窗
    editUserGender () {
      this.isUserGenderShow = true
    },

    // 取消性别弹窗
    onCancel () {
      this.isUserGenderShow = false
    },

    // 选择性别
    selectUserGender (item) {
      this.user.gender = item.value
      this.isUserGenderShow = false
    },

    // 弹出生日的弹窗
    editUserBirthdayShow () {
      this.isUserBirthdayShow = true
    },

    // 确认时间
    confirmBirthday (value) {
      this.user.birthday = dayjs(value).format('YYYY-MM-DD')
      this.isUserBirthdayShow = false
    }
  }
}
</script>
