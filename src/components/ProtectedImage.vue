<template>
  <image
    :src="src"
    :mode="mode"
    :class="attrs.class"
    :style="attrs.style"
    :show-menu-by-longpress="false"
    @tap="emit('tap', $event)"
  />
</template>

<script setup lang="ts">
import { useAttrs } from 'vue';

defineOptions({ inheritAttrs: false });

const attrs = useAttrs();

withDefaults(
  defineProps<{
    src: string;
    mode?: string;
  }>(),
  {
    mode: 'aspectFill',
  },
);

const emit = defineEmits<{
  tap: [event: unknown];
}>();
</script>
