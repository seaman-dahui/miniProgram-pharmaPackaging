<template>
  <scroll-view scroll-y class="page">
    <view class="brand-header">
      <view class="logo-wrap">
        <image class="company-logo" :src="company.logo" mode="widthFix" />
      </view>
      <text class="brand-name">{{ company.brandName }}</text>
      <text class="slogan">{{ company.slogan }}</text>
    </view>

    <view class="card">
      <SectionTitle title="公司介绍" />
      <ExpandText :text="introFullText" />
    </view>

    <view class="card">
      <SectionTitle title="企业文化" />
      <CorporateCulture :culture="company.culture" />
    </view>

    <view class="card">
      <SectionTitle title="资质荣誉" />
      <image
        class="honors-img"
        :src="company.honorsImage"
        mode="widthFix"
        @tap="previewHonors"
      />
    </view>

    <view class="card">
      <SectionTitle title="联系我们" />
      <view class="contact-row" @tap="onCallSales">
        <text class="label">销售电话</text>
        <text class="value link">{{ company.contact.salesPhone }}</text>
      </view>
      <view class="contact-row" @tap="onCallAfterSales">
        <text class="label">售后电话</text>
        <text class="value link">{{ company.contact.afterSalesPhone }}</text>
      </view>
      <view class="contact-row">
        <text class="label">传真号码</text>
        <text class="value">{{ company.contact.fax }}</text>
      </view>
      <view class="contact-row" @tap="onCopyEmail">
        <text class="label">邮箱</text>
        <text class="value link">{{ company.contact.email }}</text>
      </view>
      <view class="contact-row">
        <text class="label">地址</text>
        <text class="value">{{ company.contact.address }}</text>
      </view>
      <view class="map-btn" @tap="openMap">打开地图导航</view>
    </view>

    <view class="bottom-space" />
  </scroll-view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import SectionTitle from '@/components/SectionTitle.vue';
import ExpandText from '@/components/ExpandText.vue';
import CorporateCulture from '@/components/CorporateCulture.vue';
import { getCompany } from '@/utils/content';

const company = getCompany();
const introFullText = computed(() => company.intro.join('\n\n'));

function previewHonors() {
  uni.previewImage({ urls: [company.honorsImage], current: company.honorsImage });
}

function onCallSales() {
  uni.makePhoneCall({ phoneNumber: company.contact.salesPhone });
}

function onCallAfterSales() {
  uni.makePhoneCall({ phoneNumber: company.contact.afterSalesPhone });
}

function onCopyEmail() {
  uni.setClipboardData({
    data: company.contact.email,
    success: () => uni.showToast({ title: '邮箱已复制', icon: 'success' }),
  });
}

function openMap() {
  uni.openLocation({
    latitude: company.contact.latitude,
    longitude: company.contact.longitude,
    name: company.brandName,
    address: company.contact.address,
  });
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page {
  min-height: 100vh;
  background: $bg-page;
  padding: $spacing-page;
  box-sizing: border-box;
}

.brand-header {
  padding: 24rpx;
  margin-bottom: $spacing-page;
  background: $bg-card;
  border-radius: $card-radius;
  box-shadow: 0 4rpx 16rpx rgba(31, 41, 55, 0.06);

  .logo-wrap {
    padding: 20rpx 16rpx;
    background: #fff;
    border-radius: 12rpx;
  }

  .company-logo {
    width: 100%;
    display: block;
  }

  .brand-name {
    display: block;
    margin-top: 16rpx;
    font-size: 32rpx;
    font-weight: 700;
    color: $text-primary;
    text-align: center;
    line-height: 1.4;
  }

  .slogan {
    display: block;
    margin-top: 8rpx;
    font-size: 26rpx;
    color: $text-secondary;
    text-align: center;
    line-height: 1.5;
  }
}

.card {
  background: $bg-card;
  border-radius: $card-radius;
  padding: $spacing-page;
  margin-bottom: $spacing-page;
  box-shadow: 0 4rpx 16rpx rgba(31, 41, 55, 0.06);
}

.honors-img {
  width: 100%;
  border-radius: 12rpx;
  background: $bg-page;
}

.contact-row {
  display: flex;
  padding: 20rpx 0;
  border-bottom: 1rpx solid $border-color;

  &:last-of-type {
    border-bottom: none;
  }

  .label {
    width: 160rpx;
    color: $text-secondary;
    font-size: 28rpx;
  }

  .value {
    flex: 1;
    font-size: 28rpx;
    color: $text-primary;

    &.link {
      color: $primary;
    }
  }
}

.map-btn {
  margin-top: 24rpx;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  background: $primary-light;
  color: $primary;
  border-radius: 40rpx;
  font-size: 28rpx;
}

.bottom-space {
  height: 40rpx;
}
</style>
