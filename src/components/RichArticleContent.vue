<template>
  <view class="article-content">
    <block v-for="(block, index) in blocks" :key="index">
      <text v-if="block.type === 'text'" class="paragraph">{{ block.content }}</text>
      <image
        v-else
        class="article-image"
        :src="block.content"
        mode="widthFix"
        @tap="previewImage(block.content)"
      />
    </block>
  </view>
</template>

<script setup lang="ts">
import type { NewsBlock } from '@/types/content';

defineProps<{
  blocks: NewsBlock[];
}>();

function previewImage(url: string) {
  uni.previewImage({ urls: [url], current: url });
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.article-content {
  .paragraph {
    display: block;
    font-size: 30rpx;
    color: $text-primary;
    line-height: 1.8;
    margin-bottom: 24rpx;
    text-align: justify;
  }

  .article-image {
    width: 100%;
    border-radius: 12rpx;
    margin-bottom: 24rpx;
    background: $bg-page;
  }
}
</style>
