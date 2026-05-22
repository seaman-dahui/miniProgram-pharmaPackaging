<template>
  <view v-if="product" class="page page-with-bottom-bar">
    <ImageSwiper :images="product.images" height="480rpx" :autoplay="false" />

    <view class="card main-info">
      <text class="name">{{ product.name }}</text>
      <view v-if="product.tags.length" class="tags">
        <text v-for="tag in product.tags" :key="tag" class="tag">{{ tag }}</text>
      </view>
      <text class="summary">{{ product.summary }}</text>
    </view>

    <view class="card">
      <SectionTitle title="技术参数" />
      <SpecList :specs="product.specs" />
    </view>

    <view class="card">
      <SectionTitle title="功能特点" />
      <FeatureList :features="product.features" />
    </view>

    <view class="card">
      <SectionTitle title="适用场景" />
      <view class="applications">
        <text v-for="app in product.applications" :key="app" class="tag">{{ app }}</text>
      </view>
    </view>

    <ContactBar />
  </view>
  <view v-else class="empty-state">
    <text>设备不存在</text>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app';
import ImageSwiper from '@/components/ImageSwiper.vue';
import SectionTitle from '@/components/SectionTitle.vue';
import SpecList from '@/components/SpecList.vue';
import FeatureList from '@/components/FeatureList.vue';
import ContactBar from '@/components/ContactBar.vue';
import { getProductById } from '@/utils/content';
import type { Product } from '@/types/content';

const product = ref<Product | undefined>();

onLoad((query) => {
  const id = (query as { id?: string })?.id;
  if (id) {
    product.value = getProductById(id);
    if (product.value) {
      uni.setNavigationBarTitle({ title: product.value.name });
    }
  }
});

onShareAppMessage(() => ({
  title: product.value?.name || '医药包装设备',
  path: `/pages/products/detail?id=${product.value?.id || ''}`,
}));
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
@import '@/styles/global.scss';

.page {
  background: $bg-page;
  min-height: 100vh;
}

.card {
  margin: $spacing-page;
  background: $bg-card;
  border-radius: $card-radius;
  padding: $spacing-page;
  box-shadow: 0 4rpx 16rpx rgba(31, 41, 55, 0.06);
}

.main-info {
  margin-top: $spacing-page;

  .name {
    display: block;
    font-size: 36rpx;
    font-weight: 700;
    color: $text-primary;
    margin-bottom: 16rpx;
  }

  .tags {
    margin-bottom: 16rpx;
  }

  .summary {
    font-size: 28rpx;
    color: $text-secondary;
    line-height: 1.6;
  }
}

.applications {
  display: flex;
  flex-wrap: wrap;
}
</style>
