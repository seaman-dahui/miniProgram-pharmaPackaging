<template>
  <view class="page">
    <scroll-view scroll-x class="category-bar" :scroll-into-view="scrollIntoView">
      <view
        id="cat-all"
        class="chip"
        :class="{ active: activeCategory === '' }"
        @tap="setCategory('')"
      >
        全部
      </view>
      <view
        v-for="cat in categories"
        :id="'cat-' + cat.id"
        :key="cat.id"
        class="chip"
        :class="{ active: activeCategory === cat.id }"
        @tap="setCategory(cat.id)"
      >
        {{ cat.emoji }} {{ cat.name }}
      </view>
    </scroll-view>

    <scroll-view scroll-y class="product-list" @scrolltolower="() => {}">
      <view v-if="products.length" class="grid">
        <view v-for="item in products" :key="item.id" class="grid-cell">
          <ProductCard :product="item" />
        </view>
      </view>
      <view v-else class="empty-state">
        <text>该分类暂无设备，请选择其他分类</text>
      </view>
      <view class="list-bottom" />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import ProductCard from '@/components/ProductCard.vue';
import { getCategories, getProducts } from '@/utils/content';
import { CATEGORY_FILTER_KEY } from '@/utils/constants';

const categories = getCategories();
const activeCategory = ref('');
const scrollIntoView = ref('');

const products = computed(() => getProducts(activeCategory.value || undefined));

onShow(() => {
  const stored = uni.getStorageSync(CATEGORY_FILTER_KEY);
  if (stored) {
    activeCategory.value = stored as string;
    scrollIntoView.value = `cat-${stored}`;
    uni.removeStorageSync(CATEGORY_FILTER_KEY);
  }
});

function setCategory(id: string) {
  activeCategory.value = id;
  scrollIntoView.value = id ? `cat-${id}` : 'cat-all';
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: $bg-page;
}

.category-bar {
  flex-shrink: 0;
  white-space: nowrap;
  padding: 20rpx $spacing-page;
  background: $bg-card;
  border-bottom: 1rpx solid $border-color;

  .chip {
    display: inline-block;
    padding: 12rpx 28rpx;
    margin-right: 16rpx;
    font-size: 26rpx;
    color: $text-secondary;
    background: $bg-page;
    border-radius: 32rpx;

    &.active {
      color: $primary;
      background: $primary-light;
      font-weight: 500;
    }
  }
}

.product-list {
  flex: 1;
  height: 0;
  padding: $spacing-page;
  box-sizing: border-box;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.grid-cell {
  width: calc(50% - 12rpx);
  margin-bottom: 24rpx;
}

.list-bottom {
  height: 24rpx;
}
</style>
