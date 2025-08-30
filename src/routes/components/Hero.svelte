<script>
	import { onMount } from 'svelte';
	import { register } from 'swiper/element/bundle';
	import { heroData } from '../data/site';

	// Register Swiper custom elements
	onMount(() => {
		register();
	});

	const spaceBetween = 10;

	const onProgress = (e) => {
		const [swiper, progress] = e.detail;
		console.log(progress);
	};

	const onSlideChange = (e) => {
		console.log('slide changed');
	};
</script>

<div class="py-1 sm:py-3 lg:py-5 max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-8">
	<swiper-container
		slides-per-view="1"
		navigation-prev-el=".swiper-button-prev-hero"
		navigation-next-el=".swiper-button-next-hero"
		pagination="true"
		mousewheel="true"
		keyboard="true"
		autoplay-delay="4000"
		autoplay-disable-on-interaction="true"
		class="relative rounded-lg sm:rounded-2xl lg:rounded-3xl bg-black overflow-hidden"
		on:swiperprogress={onProgress}
		on:swiperslidechange={onSlideChange}
	>
		{#each heroData as data, index}
			<swiper-slide class="relative w-full">
				<img
					src={data.image}
					alt={data.title}
					class="w-full h-[24rem] sm:h-[28rem] md:h-[36rem] lg:h-[40rem] object-cover"
					width="800"
					height="400"
				/>
				<div class="absolute inset-0 bg-base-content/30" />
				<div class="absolute inset-0 flex items-center">
					<div class="w-full max-w-[120rem] mx-auto px-3 sm:px-6 lg:px-8">
						<div class="flex flex-col mt-8 sm:mt-10 md:mt-0">
						<!-- <div class="badge badge-sm font-black italic mb-4 rounded-full">
							GET UPTO 50% OFF SHOP NOW
						</div> -->
						<h1
							class="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[4rem] font-extrabold text-base-100 max-w-xs sm:max-w-sm md:max-w-xl lg:max-w-2xl leading-tight"
						>
							{data.title}
						</h1>
						<p
							class="text-base-100/80 mt-2 sm:mt-4 md:mt-5 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl text-xs sm:text-sm md:text-base lg:text-lg"
						>
							{data.desc}
						</p>
					</div>
					<div class="flex flex-col sm:flex-row md:flex-row mt-4 sm:mt-6 md:mt-8 lg:mt-10 gap-3 sm:gap-4">
						<a
							class="w-auto sm:w-32 md:w-40 lg:w-52 btn btn-sm sm:btn-md rounded-full flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base px-4 sm:px-5 md:px-6"
							href="/manage-store"
						>
							เปิดร้านค้า
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								viewBox="0 0 24 24"
								class="sm:w-4 sm:h-4 md:w-5 md:h-5"
							>
								<path d="M7 7h8.586L5.293 17.293l1.414 1.414L17 8.414V17h2V5H7v2z" />
							</svg>
						</a>
						<a
							class="w-auto sm:w-32 md:w-40 lg:w-52 btn btn-sm sm:btn-md rounded-full flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base px-4 sm:px-5 md:px-6"
							href="/shop"
						>
							หาชุดเช่า
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								viewBox="0 0 24 24"
								class="sm:w-4 sm:h-4 md:w-5 md:h-5"
							>
								<path d="M7 7h8.586L5.293 17.293l1.414 1.414L17 8.414V17h2V5H7v2z" />
							</svg>
						</a>
						</div>
					</div>
				</div>
			</swiper-slide>
		{/each}

		<div class="absolute flex gap-3 sm:gap-5 md:gap-7 top-4 sm:top-6 md:top-7 right-4 sm:right-6 md:right-7 z-10">
			<button
				aria-label="hero-prev"
				class="swiper-button-prev-hero btn btn-circle btn-xs sm:btn-sm md:btn-md"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="sm:w-5 sm:h-5 md:w-6 md:h-6">
					<path
						fill="currentColor"
						d="M15.293 3.293 6.586 12l8.707 8.707 1.414-1.414L9.414 12l7.293-7.293-1.414-1.414z"
					/>
				</svg>
			</button>

			<button
				aria-label="hero-next"
				class="swiper-button-next-hero btn btn-circle btn-xs sm:btn-sm md:btn-md"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="sm:w-5 sm:h-5 md:w-6 md:h-6">
					<path
						fill="currentColor"
						d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z"
					/>
				</svg>
			</button>
		</div>
	</swiper-container>
</div>
