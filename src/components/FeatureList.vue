<template>
  <view class="feature-list">
    <view v-for="(item, index) in features" :key="index" class="feature-item">
      <view class="icon-wrap">
        <text class="icon-num">{{ index + 1 }}</text>
      </view>
      <view class="content">
        <text class="title">{{ item.title }}</text>
        <text class="desc">{{ item.desc }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { Feature } from '@/types/content';

defineProps<{
  features: Feature[];
}>();
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.feature-list {
  .feature-item {
    display: flex;
    padding: 24rpx 0;
    border-bottom: 1rpx solid $border-color;

    &:last-child {
      border-bottom: none;
    }

    .icon-wrap {
      width: 56rpx;
      height: 56rpx;
      border-radius: 50%;
      background: $primary-light;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20rpx;
      flex-shrink: 0;

      .icon-num {
        color: $primary;
        font-size: 26rpx;
        font-weight: 600;
      }
    }

    .content {
      flex: 1;

      .title {
        display: block;
        font-size: 30rpx;
        font-weight: 600;
        color: $text-primary;
        margin-bottom: 8rpx;
      }

      .desc {
        font-size: 26rpx;
        color: $text-secondary;
        line-height: 1.6;
      }
    }
  }
}
</style>
