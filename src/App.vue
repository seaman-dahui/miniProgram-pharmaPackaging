<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';

onLaunch(() => {
  console.log('pharmaPackaging launch');
});
onShow(() => {});
onHide(() => {});
</script>

<style lang="scss">
@import '@/styles/global.scss';

page {
  background-color: $bg-page;
  color: $text-primary;
  font-size: 28rpx;
}
</style>
