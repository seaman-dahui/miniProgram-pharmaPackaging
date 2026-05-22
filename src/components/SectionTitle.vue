<template>
  <view class="section-title">
    <text class="title">{{ title }}</text>
    <text v-if="moreText" class="more" @tap="$emit('more')">{{ moreText }}</text>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  moreText?: string;
}>();

defineEmits<{
  (e: 'more'): void;
}>();
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;

  .title {
    font-size: 32rpx;
    font-weight: 600;
    color: $text-primary;
  }

  .more {
    font-size: 26rpx;
    color: $primary;
  }
}
</style>
