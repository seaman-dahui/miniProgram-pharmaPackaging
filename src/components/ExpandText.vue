<template>
  <view class="expand-text">
    <text class="content" :class="{ collapsed: !expanded }">{{ text }}</text>
    <text v-if="showToggle" class="toggle" @tap="expanded = !expanded">
      {{ expanded ? '收起' : '展开' }}
    </text>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps<{
  text: string;
  maxLines?: number;
}>();

const expanded = ref(false);
const showToggle = computed(() => props.text.length > 120);
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.expand-text {
  .content {
    display: block;
    font-size: 28rpx;
    color: $text-secondary;
    line-height: 1.7;

    &.collapsed {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
    }
  }

  .toggle {
    display: inline-block;
    margin-top: 12rpx;
    font-size: 26rpx;
    color: $primary;
  }
}
</style>
