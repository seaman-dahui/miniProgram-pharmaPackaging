<template>
  <view class="contact-bar">
    <view class="btn outline" @tap="onCall">
      <text class="btn-icon">📞</text>
      <text>销售电话</text>
    </view>
    <view class="btn primary" @tap="onCopyWechat">
      <text class="btn-icon">💬</text>
      <text>微信咨询</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { getCompany } from '@/utils/content';

const contact = getCompany().contact;

function onCall() {
  uni.makePhoneCall({ phoneNumber: contact.salesPhone });
}

function onCopyWechat() {
  uni.setClipboardData({
    data: contact.wechat,
    success: () => {
      uni.showToast({ title: '微信号已复制', icon: 'success' });
    },
  });
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.contact-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  gap: 24rpx;
  padding: 16rpx 24rpx;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  background: $bg-card;
  box-shadow: 0 -4rpx 20rpx rgba(31, 41, 55, 0.08);

  .btn {
    flex: 1;
    height: 88rpx;
    border-radius: 44rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    font-weight: 500;

    .btn-icon {
      margin-right: 8rpx;
    }

    &.outline {
      border: 2rpx solid $primary;
      color: $primary;
      background: $bg-card;
    }

    &.primary {
      background: $primary;
      color: #fff;
    }
  }
}
</style>
