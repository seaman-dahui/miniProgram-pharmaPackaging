<template>
  <view class="spec-list">
    <view v-for="(item, index) in specs" :key="index" class="spec-row">
      <text class="label">{{ item.label }}</text>
      <text class="value">{{ item.value }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { Spec } from '@/types/content';

defineProps<{
  specs: Spec[];
}>();
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.spec-list {
  .spec-row {
    display: flex;
    padding: 20rpx 0;
    border-bottom: 1rpx solid $border-color;

    &:last-child {
      border-bottom: none;
    }

    .label {
      width: 200rpx;
      flex-shrink: 0;
      color: $text-secondary;
      font-size: 28rpx;
    }

    .value {
      flex: 1;
      color: $text-primary;
      font-size: 28rpx;
    }
  }
}
</style>
