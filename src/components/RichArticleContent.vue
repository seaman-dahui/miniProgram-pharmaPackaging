<template>
  <view class="article-content">
    <block v-for="(block, index) in blocks" :key="index">
      <text v-if="block.type === 'text'" class="paragraph" selectable="false">{{ block.content }}</text>
      <ProtectedImage
        v-else
        class="article-image"
        :src="block.content"
        mode="widthFix"
        @tap="onPreview(block.content)"
      />
    </block>
  </view>
</template>

<script setup lang="ts">
import ProtectedImage from '@/components/ProtectedImage.vue';
import type { NewsBlock } from '@/types/content';
import { previewImages } from '@/utils/preview';

defineProps<{
  blocks: NewsBlock[];
}>();

function onPreview(url: string) {
  previewImages([url], url);
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
