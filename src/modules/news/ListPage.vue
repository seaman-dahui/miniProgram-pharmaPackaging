<template>
  <scroll-view scroll-y class="page">
    <view v-if="articles.length" class="news-list">
      <view
        v-for="item in articles"
        :key="item.id"
        class="news-item"
        @tap="goDetail(item.id)"
      >
        <text class="news-title">{{ item.title }}</text>
        <text class="news-time">{{ item.publishTime }}</text>
      </view>
    </view>
    <view v-else class="empty-state">
      <text>暂无新闻</text>
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
import { getNewsList } from '@/utils/content';
import { SUBPACKAGE } from '@/utils/routes';

const articles = getNewsList();

function goDetail(id: string) {
  uni.navigateTo({ url: `${SUBPACKAGE.NEWS_DETAIL}?id=${id}` });
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page {
  min-height: 100vh;
  background: $bg-page;
  box-sizing: border-box;
}

.news-list {
  padding: $spacing-page;
}

.news-item {
  background: $bg-card;
  border-radius: $card-radius;
  padding: 28rpx $spacing-page;
  margin-bottom: $spacing-page;
  box-shadow: 0 4rpx 16rpx rgba(31, 41, 55, 0.06);

  .news-title {
    display: block;
    font-size: 30rpx;
    font-weight: 600;
    color: $text-primary;
    line-height: 1.5;
    margin-bottom: 12rpx;
  }

  .news-time {
    display: block;
    font-size: 24rpx;
    color: $text-secondary;
  }
}

.empty-state {
  padding: 120rpx 0;
  text-align: center;
  color: $text-secondary;
  font-size: 28rpx;
}
</style>
