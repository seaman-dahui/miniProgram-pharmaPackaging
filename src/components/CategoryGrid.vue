<template>
  <view class="category-grid">
    <view
      v-for="item in categories"
      :key="item.id"
      class="grid-item"
      @tap="$emit('select', item.id)"
    >
      <view class="emoji-wrap">
        <text class="emoji">{{ item.emoji }}</text>
      </view>
      <text class="name">{{ item.name }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { Category } from '@/types/content';

defineProps<{
  categories: Category[];
}>();

defineEmits<{
  (e: 'select', categoryId: string): void;
}>();
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.category-grid {
  display: flex;
  flex-wrap: wrap;

  .grid-item {
    width: 25%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16rpx 0;

    .emoji-wrap {
      width: 96rpx;
      height: 96rpx;
      border-radius: 24rpx;
      background: $primary-light;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12rpx;

      .emoji {
        font-size: 44rpx;
      }
    }

    .name {
      font-size: 24rpx;
      color: $text-primary;
    }
  }
}
</style>
