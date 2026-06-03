<template>
  <scroll-view v-if="article" scroll-y class="page">
    <view class="card">
      <text class="title">{{ article.title }}</text>
      <text class="time">{{ article.publishTime }}</text>
      <RichArticleContent :blocks="article.blocks" />
    </view>
    <view class="bottom-space" />
  </scroll-view>
  <view v-else class="empty-state">
    <text>详情不存在</text>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app';
import RichArticleContent from '@/components/RichArticleContent.vue';
import { getNewsById } from '@/utils/content';
import { SUBPACKAGE, TAB } from '@/utils/routes';
import type { NewsArticle } from '@/types/content';

const article = ref<NewsArticle | undefined>();

onLoad((query) => {
  const id = query?.id as string | undefined;
  if (id) {
    article.value = getNewsById(id);
  }
});

onShareAppMessage(() => ({
  title: article.value?.title || '动态详情',
  path: article.value ? `${SUBPACKAGE.NEWS_DETAIL}?id=${article.value.id}` : TAB.NEWS,
}));
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page {
  min-height: 100vh;
  background: $bg-page;
  box-sizing: border-box;
}

.card {
  margin: $spacing-page;
  padding: $spacing-page;
  background: $bg-card;
  border-radius: $card-radius;
  box-shadow: 0 4rpx 16rpx rgba(31, 41, 55, 0.06);

  .title {
    display: block;
    font-size: 36rpx;
    font-weight: 700;
    color: $text-primary;
    line-height: 1.5;
    margin-bottom: 16rpx;
  }

  .time {
    display: block;
    font-size: 24rpx;
    color: $text-secondary;
    margin-bottom: 32rpx;
    padding-bottom: 24rpx;
    border-bottom: 1rpx solid $border-color;
  }
}

.bottom-space {
  height: 40rpx;
}

.empty-state {
  padding: 120rpx 0;
  text-align: center;
  color: $text-secondary;
  font-size: 28rpx;
}
</style>
