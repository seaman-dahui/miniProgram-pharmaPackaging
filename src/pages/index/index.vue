<template>
  <view class="page">
    <view class="header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="header-inner" :style="{ height: navBarHeight + 'px' }">
        <text class="brand">{{ company.brandName }}</text>
      </view>
      <text class="slogan">{{ company.slogan }}</text>
    </view>

    <scroll-view scroll-y class="scroll-body" :style="{ height: scrollHeight }">
      <swiper
        v-if="banners.length"
        class="banner-swiper"
        circular
        indicator-dots
        autoplay
        :interval="4000"
      >
        <swiper-item v-for="item in banners" :key="item.id" @tap="onBannerTap(item)">
          <image class="banner-img" :src="item.image" mode="aspectFill" />
          <view v-if="item.title" class="banner-mask">
            <text class="banner-title">{{ item.title }}</text>
          </view>
        </swiper-item>
      </swiper>

      <view class="section card">
        <SectionTitle title="设备分类" />
        <CategoryGrid :categories="categories" @select="onCategorySelect" />
      </view>

      <view class="section card">
        <SectionTitle title="推荐设备" more-text="全部产品" @more="goProducts" />
        <scroll-view scroll-x class="featured-scroll" enable-flex>
          <view class="featured-list">
            <view
              v-for="item in featuredProducts"
              :key="item.id"
              class="featured-item"
              @tap="goDetail(item.id)"
            >
              <image class="featured-cover" :src="item.cover" mode="aspectFill" />
              <text class="featured-name">{{ item.name }}</text>
              <text class="featured-summary">{{ item.summary }}</text>
            </view>
          </view>
        </scroll-view>
      </view>

      <view class="section card company-brief" @tap="goAbout">
        <SectionTitle title="公司简介" more-text="了解更多" @more="goAbout" />
        <text class="brief-text">{{ company.introSummary }}</text>
      </view>

      <view class="bottom-space" />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import SectionTitle from '@/components/SectionTitle.vue';
import CategoryGrid from '@/components/CategoryGrid.vue';
import {
  getBanners,
  getCategories,
  getCompany,
  getFeaturedProducts,
} from '@/utils/content';
import { CATEGORY_FILTER_KEY } from '@/utils/constants';
import type { Banner } from '@/types/content';

const company = getCompany();
const categories = getCategories();
const banners = getBanners();
const featuredProducts = getFeaturedProducts();

const statusBarHeight = ref(20);
const navBarHeight = ref(44);
const scrollHeight = ref('100vh');

onMounted(() => {
  const sys = uni.getSystemInfoSync();
  statusBarHeight.value = sys.statusBarHeight || 20;
  const menu = uni.getMenuButtonBoundingClientRect?.();
  if (menu) {
    navBarHeight.value = menu.height + (menu.top - statusBarHeight.value) * 2;
  }
  const headerH = statusBarHeight.value + navBarHeight.value + 60;
  scrollHeight.value = `calc(100vh - ${headerH}px)`;
});

function onCategorySelect(categoryId: string) {
  uni.setStorageSync(CATEGORY_FILTER_KEY, categoryId);
  uni.switchTab({ url: '/pages/products/index' });
}

function goProducts() {
  uni.removeStorageSync(CATEGORY_FILTER_KEY);
  uni.switchTab({ url: '/pages/products/index' });
}

function goDetail(id: string) {
  uni.navigateTo({ url: `/pages/products/detail?id=${id}` });
}

function onBannerTap(banner: Banner) {
  if (banner.linkProductId) {
    goDetail(banner.linkProductId);
  }
}

function goAbout() {
  uni.switchTab({ url: '/pages/about/index' });
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page {
  min-height: 100vh;
  background: $bg-page;
}

.header {
  background: linear-gradient(180deg, $primary 0%, #ff3333 100%);
  padding: 0 $spacing-page 24rpx;
  color: #fff;

  .header-inner {
    display: flex;
    align-items: center;

    .brand {
      font-size: 36rpx;
      font-weight: 700;
    }
  }

  .slogan {
    font-size: 24rpx;
    opacity: 0.9;
    margin-top: 8rpx;
  }
}

.scroll-body {
  box-sizing: border-box;
}

.banner-swiper {
  height: 320rpx;
  margin: $spacing-page;
  border-radius: $card-radius;
  overflow: hidden;

  .banner-img {
    width: 100%;
    height: 100%;
  }

  .banner-mask {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 24rpx;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.5));

    .banner-title {
      color: #fff;
      font-size: 28rpx;
      font-weight: 600;
    }
  }
}

.section {
  margin: 0 $spacing-page $spacing-page;
}

.card {
  background: $bg-card;
  border-radius: $card-radius;
  padding: $spacing-page;
  box-shadow: 0 4rpx 16rpx rgba(31, 41, 55, 0.06);
}

.featured-scroll {
  width: 100%;
  white-space: nowrap;
}

.featured-list {
  display: inline-flex;
  gap: 20rpx;
  padding-bottom: 8rpx;
}

.featured-item {
  display: inline-flex;
  flex-direction: column;
  width: 280rpx;
  flex-shrink: 0;
  background: $bg-page;
  border-radius: 12rpx;
  overflow: hidden;

  .featured-cover {
    width: 280rpx;
    height: 180rpx;
    background: $primary-light;
  }

  .featured-name {
    padding: 12rpx 16rpx 4rpx;
    font-size: 26rpx;
    font-weight: 600;
    color: $text-primary;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .featured-summary {
    padding: 0 16rpx 16rpx;
    font-size: 22rpx;
    color: $text-secondary;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    white-space: normal;
  }
}

.company-brief {
  .brief-text {
    font-size: 28rpx;
    color: $text-secondary;
    line-height: 1.7;
  }
}

.bottom-space {
  height: 32rpx;
}
</style>
