<template>
  <scroll-view scroll-y class="page">
    <view class="brand-header">
      <image class="logo" :src="company.logo" mode="aspectFit" />
      <view class="brand-text">
        <text class="name">{{ company.brandName }}</text>
        <text class="slogan">{{ company.slogan }}</text>
      </view>
    </view>

    <view class="card">
      <SectionTitle title="公司介绍" />
      <ExpandText :text="introFullText" />
    </view>

    <view class="card">
      <SectionTitle title="发展历程" />
      <view class="timeline">
        <view v-for="(item, index) in company.milestones" :key="index" class="timeline-item">
          <view class="line-col">
            <view class="dot" />
            <view v-if="index < company.milestones.length - 1" class="line" />
          </view>
          <view class="content-col">
            <text class="year">{{ item.year }}</text>
            <text class="event">{{ item.event }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="card">
      <SectionTitle title="资质荣誉" />
      <scroll-view scroll-x class="cert-scroll">
        <view class="cert-list">
          <view
            v-for="(cert, index) in company.certifications"
            :key="index"
            class="cert-item"
            @tap="previewCert(index)"
          >
            <image class="cert-img" :src="cert.image" mode="aspectFit" />
            <text class="cert-name">{{ cert.name }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="card">
      <SectionTitle title="联系我们" />
      <view class="contact-row" @tap="onCall">
        <text class="label">电话</text>
        <text class="value link">{{ company.contact.phone }}</text>
      </view>
      <view class="contact-row" @tap="onCopyWechat">
        <text class="label">微信</text>
        <text class="value link">{{ company.contact.wechat }}</text>
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
import { getCompany } from '@/utils/content';

const company = getCompany();
const introFullText = computed(() => company.intro.join('\n\n'));

function previewCert(index: number) {
  const urls = company.certifications.map((c) => c.image);
  uni.previewImage({ urls, current: urls[index] });
}

function onCall() {
  uni.makePhoneCall({ phoneNumber: company.contact.phone });
}

function onCopyWechat() {
  uni.setClipboardData({
    data: company.contact.wechat,
    success: () => uni.showToast({ title: '微信号已复制', icon: 'success' }),
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
  display: flex;
  align-items: center;
  padding: 32rpx;
  margin-bottom: $spacing-page;
  background: linear-gradient(135deg, #1a5fb4, #2d7dd4);
  border-radius: $card-radius;
  color: #fff;

  .logo {
    width: 120rpx;
    height: 120rpx;
    border-radius: 16rpx;
    background: #fff;
    margin-right: 24rpx;
  }

  .brand-text {
    flex: 1;

    .name {
      display: block;
      font-size: 34rpx;
      font-weight: 700;
      margin-bottom: 8rpx;
    }

    .slogan {
      font-size: 24rpx;
      opacity: 0.9;
    }
  }
}

.card {
  background: $bg-card;
  border-radius: $card-radius;
  padding: $spacing-page;
  margin-bottom: $spacing-page;
  box-shadow: 0 4rpx 16rpx rgba(31, 41, 55, 0.06);
}

.timeline {
  .timeline-item {
    display: flex;

    .line-col {
      width: 40rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 20rpx;

      .dot {
        width: 20rpx;
        height: 20rpx;
        border-radius: 50%;
        background: $primary;
        flex-shrink: 0;
      }

      .line {
        flex: 1;
        width: 4rpx;
        background: $primary-light;
        min-height: 60rpx;
      }
    }

    .content-col {
      flex: 1;
      padding-bottom: 32rpx;

      .year {
        display: block;
        font-size: 30rpx;
        font-weight: 600;
        color: $primary;
        margin-bottom: 8rpx;
      }

      .event {
        font-size: 28rpx;
        color: $text-secondary;
        line-height: 1.6;
      }
    }
  }
}

.cert-scroll {
  width: 100%;
}

.cert-list {
  display: inline-flex;
  gap: 20rpx;
}

.cert-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  width: 200rpx;

  .cert-img {
    width: 200rpx;
    height: 140rpx;
    background: $bg-page;
    border-radius: 12rpx;
  }

  .cert-name {
    margin-top: 12rpx;
    font-size: 22rpx;
    color: $text-secondary;
    text-align: center;
  }
}

.contact-row {
  display: flex;
  padding: 20rpx 0;
  border-bottom: 1rpx solid $border-color;

  &:last-of-type {
    border-bottom: none;
  }

  .label {
    width: 100rpx;
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
