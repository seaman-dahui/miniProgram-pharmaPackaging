<template>
  <swiper
    class="image-swiper"
    :style="{ height }"
    circular
    :indicator-dots="images.length > 1"
    :autoplay="autoplay"
    :interval="3000"
  >
    <swiper-item v-for="(src, index) in images" :key="index">
      <ProtectedImage
        class="slide-image"
        :src="src"
        mode="aspectFill"
        @tap="onPreview(index)"
      />
    </swiper-item>
  </swiper>
</template>

<script setup lang="ts">
import ProtectedImage from '@/components/ProtectedImage.vue';
import { previewImages } from '@/utils/preview';

const props = withDefaults(
  defineProps<{
    images: string[];
    height?: string;
    autoplay?: boolean;
  }>(),
  {
    height: '420rpx',
    autoplay: true,
  }
);

function onPreview(current: number) {
  if (!props.images.length) return;
  previewImages(props.images, props.images[current]);
}
</script>

<style lang="scss" scoped>
.image-swiper {
  width: 100%;
  background: #e5e7eb;

  .slide-image {
    width: 100%;
    height: 100%;
  }
}
</style>
