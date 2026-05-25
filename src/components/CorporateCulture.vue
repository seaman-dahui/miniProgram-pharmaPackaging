<template>
	<view class="culture">
		<view v-for="(block, index) in introBlocks" :key="'intro-' + index" class="block">
			<text class="block-title">{{ block.title }}</text>
			<text class="block-content">{{ block.content }}</text>
		</view>

		<view class="block">
			<text class="block-title">我们的核心价值观</text>
		</view>
		<view class="values-grid">
			<view v-for="(row, rowIndex) in coreValueRows" :key="rowIndex" class="values-row">
				<template v-for="(item, index) in row" :key="item.zh">
					<text v-if="index > 0" class="values-plus">+</text>
					<view class="value-chip">
						<text class="chip-zh">{{ item.zh }}</text>
						<text class="chip-en">{{ item.en }}</text>
					</view>
				</template>
			</view>
		</view>

		<view v-if="marketBlock" class="block">
			<text class="block-title">{{ marketBlock.title }}</text>
			<text class="block-content">{{ marketBlock.content }}</text>
		</view>

		<view class="block">
			<text class="block-title">{{ culture.businessPhilosophy.title }}</text>
			<text class="block-content">{{ culture.businessPhilosophy.content }}</text>
			<view class="formula-row">
				<view class="formula-chip">{{ culture.businessPhilosophy.formula[0] }}</view>
				<text class="formula-op">+</text>
				<view class="formula-chip">{{ culture.businessPhilosophy.formula[1] }}</view>
				<text class="formula-op">=</text>
				<view class="formula-chip outline">{{ culture.businessPhilosophy.result }}</view>
			</view>
		</view>

		<view class="block">
			<text class="block-title">{{ culture.serviceTenet.title }}</text>
			<text class="block-content">{{ culture.serviceTenet.content }}</text>
			<view class="circle-row">
				<template v-for="(item, index) in culture.serviceTenet.values" :key="index">
					<text v-if="index > 0" class="circle-plus">+</text>
					<view class="circle-item">
						<view class="circle-chip">
							<text class="circle-zh">{{ item.zh }}</text>
						</view>
						<text class="circle-en">{{ item.en }}</text>
					</view>
				</template>
			</view>
		</view>

		<view v-for="(block, index) in closingBlocks" :key="'close-' + index" class="block">
			<text class="block-title">{{ block.title }}</text>
			<text class="block-content">{{ block.content }}</text>
		</view>

		<view class="action-values">
			<view v-for="(item, index) in culture.actionValues" :key="index" class="action-chip">
				<text class="action-zh">{{ item.zh }}</text>
				<text class="action-en">{{ item.en }}</text>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { computed } from 'vue';
	import type { CompanyCulture } from '@/types/content';

	const props = defineProps<{
		culture : CompanyCulture;
	}>();

	const introBlocks = computed(() => props.culture.blocks.slice(0, 2));
	const marketBlock = computed(() => props.culture.blocks[2]);
	const closingBlocks = computed(() => props.culture.blocks.slice(3));
	const coreValueRows = computed(() => [
		props.culture.coreValues.slice(0, 3),
		props.culture.coreValues.slice(3, 6),
	]);
</script>

<style lang="scss" scoped>
	@import '@/styles/variables.scss';

	.culture {
		.block {
			margin-bottom: 36rpx;

			&:last-child {
				margin-bottom: 0;
			}
		}

		.block-title {
			display: block;
			font-size: 30rpx;
			font-weight: 600;
			color: $text-primary;
			margin-bottom: 12rpx;
		}

		.block-content {
			display: block;
			font-size: 28rpx;
			color: $text-secondary;
			line-height: 1.7;
		}

		.values-header {
			display: flex;
			align-items: center;
			margin-bottom: 20rpx;
		}

		.brand-mark {
			width: 56rpx;
			height: 56rpx;
			background: $primary;
			border-radius: 8rpx;
			margin-right: 16rpx;
			position: relative;
			flex-shrink: 0;

			&::after {
				content: '';
				position: absolute;
				left: 14rpx;
				top: 14rpx;
				width: 28rpx;
				height: 28rpx;
				border-top: 6rpx solid #fff;
				border-right: 6rpx solid #fff;
				transform: rotate(-45deg);
			}
		}

		.values-header-text {
			flex: 1;

			.values-title-zh {
				display: block;
				font-size: 30rpx;
				font-weight: 600;
				color: $primary;
				margin-bottom: 4rpx;
			}

			.values-title-en {
				display: block;
				font-size: 24rpx;
				color: $text-secondary;
			}
		}

		.values-grid {
			display: flex;
			flex-direction: column;
			gap: 12rpx;
		}

		.values-row {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.values-plus {
			font-size: 28rpx;
			color: $primary;
			font-weight: 600;
			padding: 0 4rpx;
		}

		.value-chip {
			flex: 1;
			box-sizing: border-box;
			background: $primary;
			border-radius: 8rpx;
			padding: 16rpx 12rpx;
			margin-bottom: 8rpx;

			.chip-zh {
				display: block;
				font-size: 26rpx;
				font-weight: 600;
				color: #fff;
				text-align: center;
				margin-bottom: 4rpx;
			}

			.chip-en {
				display: block;
				font-size: 20rpx;
				color: rgba(255, 255, 255, 0.9);
				text-align: center;
				line-height: 1.3;
			}
		}

		.formula-row {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			justify-content: center;
			gap: 12rpx;
			margin-top: 20rpx;
		}

		.formula-chip {
			min-width: 140rpx;
			padding: 16rpx 20rpx;
			background: $primary;
			border-radius: 8rpx;
			font-size: 26rpx;
			font-weight: 600;
			color: #fff;
			text-align: center;

			&.outline {
				background: #fff;
				color: $primary;
				border: 2rpx solid $primary;
			}
		}

		.formula-op {
			font-size: 32rpx;
			font-weight: 600;
			color: $primary;
		}

		.circle-row {
			display: flex;
			flex-wrap: wrap;
			align-items: flex-start;
			justify-content: center;
			gap: 8rpx;
			margin-top: 20rpx;
		}

		.circle-plus {
			font-size: 28rpx;
			color: $primary;
			font-weight: 600;
			line-height: 88rpx;
			padding: 0 2rpx;
		}

		.circle-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 96rpx;
		}

		.circle-chip {
			width: 88rpx;
			height: 88rpx;
			border-radius: 50%;
			background: $primary;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-bottom: 8rpx;

			.circle-zh {
				font-size: 26rpx;
				font-weight: 600;
				color: #fff;
			}
		}

		.circle-en {
			font-size: 20rpx;
			color: $text-secondary;
			text-align: center;
			line-height: 1.2;
		}

		.action-values {
			display: flex;
			flex-wrap: wrap;
			gap: 16rpx;
			margin-top: 8rpx;
			padding-top: 24rpx;
			border-top: 4rpx solid $primary;
		}

		.action-chip {
			width: calc(25% - 12rpx);
			min-width: 140rpx;
			flex: 1 1 140rpx;
			background: $primary;
			border-radius: 12rpx;
			padding: 20rpx 8rpx;
			box-sizing: border-box;

			.action-zh {
				display: block;
				font-size: 24rpx;
				font-weight: 600;
				color: #fff;
				text-align: center;
				line-height: 1.4;
				margin-bottom: 8rpx;
			}

			.action-en {
				display: block;
				font-size: 18rpx;
				color: rgba(255, 255, 255, 0.9);
				text-align: center;
				line-height: 1.2;
			}
		}
	}
</style>