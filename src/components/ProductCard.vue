<template>
  <view class="product-card" @tap="onTap">
    <image
      class="cover"
      :src="product.cover"
      mode="aspectFill"
      :show-menu-by-longpress="false"
    />
    <view class="info">
      <text class="name" selectable="false">{{ product.name }}</text>
      <text class="summary" selectable="false">{{ product.summary }}</text>
      <view v-if="product.tags?.length" class="tags">
        <text
          v-for="tag in product.tags.slice(0, 2)"
          :key="tag"
          class="tag"
          selectable="false"
        >{{ tag }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { Product } from '@/types/content';
import { SUBPACKAGE } from '@/utils/routes';

const props = defineProps<{
  product: Product;
}>();

function onTap() {
  uni.navigateTo({
    url: `${SUBPACKAGE.PRODUCTS_DETAIL}?id=${props.product.id}`,
  });
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.product-card {
  background: $bg-card;
  border-radius: $card-radius;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(31, 41, 55, 0.06);

  .cover {
    width: 100%;
    height: 240rpx;
    background: $primary-light;
  }

  .info {
    padding: 20rpx;

    .name {
      display: block;
      font-size: 28rpx;
      font-weight: 600;
      color: $text-primary;
      margin-bottom: 8rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .summary {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      font-size: 24rpx;
      color: $text-secondary;
      line-height: 1.5;
      min-height: 72rpx;
    }

    .tags {
      margin-top: 12rpx;

      .tag {
        display: inline-block;
        padding: 4rpx 12rpx;
        font-size: 20rpx;
        color: $primary;
        background: $primary-light;
        border-radius: 6rpx;
        margin-right: 8rpx;
      }
    }
  }
}
</style>
