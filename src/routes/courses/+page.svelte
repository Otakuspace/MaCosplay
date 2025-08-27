<script lang="ts">
	import { onMount } from 'svelte';
	
	// Sample course data - in production this would come from a database
	const courses = [
		{
			id: 1,
			slug: 'basic-cosplay-makeup',
			title: 'Basic Cosplay Makeup Fundamentals',
			description: 'Learn the essential techniques for creating stunning cosplay makeup looks. Perfect for beginners who want to transform into their favorite characters.',
			instructor: 'Akira Tanaka',
			duration: '4 weeks',
			level: 'Beginner',
			price: 2500,
			image: '/static/course-basic.jpg',
			rating: 4.8,
			students: 156,
			topics: ['Color Theory', 'Basic Contouring', 'Character Analysis', 'Product Selection']
		},
		{
			id: 2,
			slug: 'advanced-character-transformation',
			title: 'Advanced Character Transformation',
			description: 'Master advanced techniques for dramatic character transformations including prosthetics, special effects, and complex color schemes.',
			instructor: 'Yuki Sato',
			duration: '8 weeks',
			level: 'Advanced',
			price: 4800,
			image: '/static/course-advanced.jpg',
			rating: 4.9,
			students: 89,
			topics: ['Prosthetics Application', 'Special Effects', 'Advanced Contouring', 'Fantasy Characters']
		},
		{
			id: 3,
			slug: 'anime-manga-makeup',
			title: 'Anime & Manga Makeup Mastery',
			description: 'Specialize in creating authentic anime and manga character looks with techniques for large eyes, unique face shapes, and vibrant colors.',
			instructor: 'Rei Nakamura',
			duration: '6 weeks',
			level: 'Intermediate',
			price: 3500,
			image: '/static/course-anime.jpg',
			rating: 4.7,
			students: 203,
			topics: ['Eye Enhancement', 'Face Shaping', 'Color Blending', 'Wig Styling Basics']
		},
		{
			id: 4,
			slug: 'horror-gothic-makeup',
			title: 'Horror & Gothic Cosplay Makeup',
			description: 'Create spine-chilling looks for horror and gothic characters with special effects, dark color palettes, and atmospheric techniques.',
			instructor: 'Kuro Yamada',
			duration: '5 weeks',
			level: 'Intermediate',
			price: 3200,
			image: '/static/course-horror.jpg',
			rating: 4.6,
			students: 124,
			topics: ['Dark Color Techniques', 'Wound Effects', 'Atmospheric Lighting', 'Gothic Aesthetics']
		}
	];

	let selectedLevel = 'all';
	let searchTerm = '';
	
	$: filteredCourses = courses.filter(course => {
		const matchesLevel = selectedLevel === 'all' || course.level.toLowerCase() === selectedLevel;
		const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
							course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
							course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
		return matchesLevel && matchesSearch;
	});
</script>

<svelte:head>
	<title>Cosplay Makeup Courses - MaCosplay</title>
	<meta name="description" content="Professional cosplay makeup courses taught by expert instructors. Learn character transformation, special effects, and advanced techniques." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
	<!-- Hero Section -->
	<section class="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white">
		<div class="absolute inset-0 bg-black/20"></div>
		<div class="relative container mx-auto px-6 py-20">
			<div class="text-center max-w-4xl mx-auto">
				<h1 class="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
					Master the Art of Cosplay Makeup
				</h1>
				<p class="text-xl md:text-2xl mb-8 text-purple-100">
					Transform into any character with professional techniques taught by industry experts
				</p>
				<div class="flex flex-col sm:flex-row gap-4 justify-center">
					<button class="btn bg-white text-purple-600 hover:bg-purple-50 border-none px-8 py-3 text-lg font-semibold rounded-full">
						Browse Courses
					</button>
					<button class="btn btn-outline border-white text-white hover:bg-white hover:text-purple-600 px-8 py-3 text-lg font-semibold rounded-full">
						Free Trial Lesson
					</button>
				</div>
			</div>
		</div>
		
		<!-- Decorative elements -->
		<div class="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
		<div class="absolute bottom-10 right-10 w-32 h-32 bg-pink-300/20 rounded-full blur-xl"></div>
		<div class="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-300/20 rounded-full blur-xl"></div>
	</section>

	<!-- Features Section -->
	<section class="py-16 bg-white">
		<div class="container mx-auto px-6">
			<div class="grid md:grid-cols-3 gap-8">
				<div class="text-center p-6">
					<div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
						</svg>
					</div>
					<h3 class="text-xl font-bold mb-2">Expert Instructors</h3>
					<p class="text-gray-600">Learn from professional makeup artists with years of cosplay experience</p>
				</div>
				
				<div class="text-center p-6">
					<div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
						</svg>
					</div>
					<h3 class="text-xl font-bold mb-2">Video Tutorials</h3>
					<p class="text-gray-600">High-quality video lessons with step-by-step demonstrations</p>
				</div>
				
				<div class="text-center p-6">
					<div class="w-16 h-16 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
						</svg>
					</div>
					<h3 class="text-xl font-bold mb-2">Community Support</h3>
					<p class="text-gray-600">Join a community of fellow cosplayers and get feedback on your work</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Courses Section -->
	<section class="py-16">
		<div class="container mx-auto px-6">
			<div class="text-center mb-12">
				<h2 class="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
					Available Courses
				</h2>
				<p class="text-xl text-gray-600 max-w-2xl mx-auto">
					Choose from our comprehensive selection of cosplay makeup courses designed for all skill levels
				</p>
			</div>

			<!-- Search and Filter -->
			<div class="flex flex-col md:flex-row gap-4 mb-8 max-w-2xl mx-auto">
				<div class="flex-1">
					<input 
						type="text" 
						placeholder="Search courses..." 
						bind:value={searchTerm}
						class="input input-bordered w-full bg-white border-gray-200 focus:border-purple-500 focus:ring-purple-500"
					/>
				</div>
				<select bind:value={selectedLevel} class="select select-bordered bg-white border-gray-200 focus:border-purple-500">
					<option value="all">All Levels</option>
					<option value="beginner">Beginner</option>
					<option value="intermediate">Intermediate</option>
					<option value="advanced">Advanced</option>
				</select>
			</div>

			<!-- Course Grid -->
			<div class="grid md:grid-cols-2 xl:grid-cols-2 gap-8 max-w-6xl mx-auto">
				{#each filteredCourses as course}
					<div class="card bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
						<div class="card-body p-6">
							<div class="flex items-start justify-between mb-4">
								<div class="flex-1">
									<h3 class="card-title text-xl font-bold text-gray-800 mb-2">
										{course.title}
									</h3>
									<div class="flex items-center gap-4 text-sm text-gray-600 mb-3">
										<span class="badge badge-outline badge-primary">{course.level}</span>
										<span>👨‍🏫 {course.instructor}</span>
										<span>⏱️ {course.duration}</span>
									</div>
								</div>
								<div class="text-right">
									<div class="text-2xl font-bold text-purple-600">฿{course.price.toLocaleString()}</div>
									<div class="flex items-center gap-1 text-sm text-gray-600">
										<span>⭐ {course.rating}</span>
										<span>({course.students} students)</span>
									</div>
								</div>
							</div>
							
							<p class="text-gray-600 mb-4 line-clamp-3">
								{course.description}
							</p>
							
							<div class="mb-4">
								<h4 class="font-semibold text-gray-800 mb-2">What you'll learn:</h4>
								<div class="flex flex-wrap gap-2">
									{#each course.topics as topic}
										<span class="badge badge-ghost bg-purple-50 text-purple-700 border-purple-200">
											{topic}
										</span>
									{/each}
								</div>
							</div>
							
							<div class="card-actions justify-between items-center pt-4 border-t border-gray-100">
								<a href="/courses/{course.slug}" class="btn btn-primary bg-gradient-to-r from-purple-600 to-pink-600 border-none text-white hover:shadow-lg">
									View Course
								</a>
								<button class="btn btn-ghost btn-sm text-purple-600 hover:bg-purple-50">
									Add to Wishlist ♡
								</button>
							</div>
						</div>
					</div>
				{/each}
			</div>

			{#if filteredCourses.length === 0}
				<div class="text-center py-12">
					<div class="text-6xl mb-4">🔍</div>
					<h3 class="text-2xl font-bold text-gray-800 mb-2">No courses found</h3>
					<p class="text-gray-600">Try adjusting your search or filter criteria</p>
				</div>
			{/if}
		</div>
	</section>

	<!-- CTA Section -->
	<section class="py-16 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white">
		<div class="container mx-auto px-6 text-center">
			<h2 class="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
			<p class="text-xl mb-8 text-purple-100">Join thousands of cosplayers who have transformed their skills with our courses</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<button class="btn bg-white text-purple-600 hover:bg-purple-50 border-none px-8 py-3 text-lg font-semibold rounded-full">
					Get Started Today
				</button>
				<button class="btn btn-outline border-white text-white hover:bg-white hover:text-purple-600 px-8 py-3 text-lg font-semibold rounded-full">
					Contact Us
				</button>
			</div>
		</div>
	</section>
</div>

<style>
	.line-clamp-3 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>