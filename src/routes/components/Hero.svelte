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

<div class="lg:py-5 lg:px-14">
	<swiper-container
		slides-per-view="1"
		navigation-prev-el=".swiper-button-prev-hero"
		navigation-next-el=".swiper-button-next-hero"
		pagination="true"
		mousewheel="true"
		keyboard="true"
		autoplay-delay="4000"
		autoplay-disable-on-interaction="true"
		class="relative lg:rounded-3xl bg-black overflow-hidden"
		on:swiperprogress={onProgress}
		on:swiperslidechange={onSlideChange}
	>
		{#each heroData as data, index}
			<swiper-slide class="relative w-full">
				<img
					src={data.image}
					alt={data.title}
					class="w-full h-[28rem] md:h-[40rem] object-cover"
					width="800"
					height="400"
				/>
				<div class="absolute inset-0 bg-base-content/30" />
				<div
					class="absolute inset-0 left-5 md:left-10 lg:left-20 flex flex-col justify-center mt-10 md:mt-0"
				>
					<div class="flex flex-col">
						<!-- <div class="badge badge-sm font-black italic mb-4 rounded-full">
							GET UPTO 50% OFF SHOP NOW
						</div> -->
						<h1
							class="text-4xl md:text-5xl lg:text-[4rem] font-extrabold text-base-100 max-w-sm md:max-w-xl lg:max-w-2xl"
						>
							{data.title}
						</h1>
						<p
							class="text-base-100/80 mt-4 md:mt-5 max-w-xs md:max-w-md lg:max-w-xl text-sm md:text-lg"
						>
							{data.desc}
						</p>
					</div>
					<div class="flex flex-col md:flex-row mt-5 md:mt-10 lg:rounded-3xl gap-4">
						<a
							class="w-36 md:w-52 btn rounded-full flex items-center justify-center gap-2"
							href="/upscaler"
						>
							AI Upscale
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="18"
								height="18"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path d="M7 7h8.586L5.293 17.293l1.414 1.414L17 8.414V17h2V5H7v2z" />
							</svg>
						</a>
						<a
							class="w-36 md:w-52 btn rounded-full flex items-center justify-center gap-2"
							href="/manage-store"
						>
							เปิดร้านค้า
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="18"
								height="18"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path d="M7 7h8.586L5.293 17.293l1.414 1.414L17 8.414V17h2V5H7v2z" />
							</svg>
						</a>
						<a
							class="w-36 md:w-52 btn rounded-full flex items-center justify-center gap-2"
							href="/shop"
						>
							หาชุดเช่า
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="18"
								height="18"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path d="M7 7h8.586L5.293 17.293l1.414 1.414L17 8.414V17h2V5H7v2z" />
							</svg>
						</a>
					</div>
				</div>
			</swiper-slide>
		{/each}

		<div class="absolute flex gap-7 top-7 right-7 z-10">
			<button
				aria-label="hero-prev"
				class="swiper-button-prev-hero btn btn-circle btn-sm"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
					<path
						fill="currentColor"
						d="M15.293 3.293 6.586 12l8.707 8.707 1.414-1.414L9.414 12l7.293-7.293-1.414-1.414z"
					/>
				</svg>
			</button>

			<button
				aria-label="hero-next"
				class="swiper-button-next-hero btn btn-circle btn-sm"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
					<path
						fill="currentColor"
						d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z"
					/>
				</svg>
			</button>
		</div>
	</swiper-container>
</div>
