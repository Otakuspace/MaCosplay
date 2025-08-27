<script lang="ts">
	// Course categories data
	const categories = [
		{
			id: 'beginner',
			title: 'Beginner Friendly',
			description: 'Perfect for those just starting their cosplay makeup journey',
			icon: '🌱',
			color: 'from-green-400 to-blue-500',
			courses: [
				'Basic Cosplay Makeup Fundamentals',
				'Color Theory for Beginners',
				'Essential Tools & Products'
			],
			studentCount: 450,
			avgRating: 4.8
		},
		{
			id: 'anime-manga',
			title: 'Anime & Manga',
			description: 'Master the distinctive art of anime and manga character makeup',
			icon: '🎭',
			color: 'from-purple-400 to-pink-500',
			courses: [
				'Anime & Manga Makeup Mastery',
				'Large Eye Techniques',
				'Character Expression Through Makeup'
			],
			studentCount: 320,
			avgRating: 4.7
		},
		{
			id: 'special-effects',
			title: 'Special Effects',
			description: 'Advanced techniques for dramatic transformations and prosthetics',
			icon: '🎨',
			color: 'from-red-400 to-orange-500',
			courses: [
				'Advanced Character Transformation',
				'Prosthetics & Special Effects',
				'Fantasy Creature Makeup'
			],
			studentCount: 180,
			avgRating: 4.9
		},
		{
			id: 'horror-gothic',
			title: 'Horror & Gothic',
			description: 'Create spine-chilling and darkly beautiful gothic looks',
			icon: '🦇',
			color: 'from-gray-600 to-purple-800',
			courses: [
				'Horror & Gothic Cosplay Makeup',
				'Dark Fantasy Techniques',
				'Atmospheric Horror Effects'
			],
			studentCount: 210,
			avgRating: 4.6
		},
		{
			id: 'fantasy-sci-fi',
			title: 'Fantasy & Sci-Fi',
			description: 'Bring otherworldly characters to life with creative techniques',
			icon: '🌌',
			color: 'from-blue-500 to-purple-600',
			courses: [
				'Alien & Fantasy Makeup',
				'Cyberpunk & Futuristic Looks',
				'Mythical Creature Transformation'
			],
			studentCount: 165,
			avgRating: 4.7
		},
		{
			id: 'historical-period',
			title: 'Historical & Period',
			description: 'Authentic historical makeup styles and period-accurate techniques',
			icon: '👑',
			color: 'from-yellow-400 to-red-500',
			courses: [
				'Victorian Era Makeup',
				'Medieval & Renaissance Styles',
				'Historical Accuracy in Cosplay'
			],
			studentCount: 95,
			avgRating: 4.5
		}
	];

	let selectedCategory = null;
</script>

<svelte:head>
	<title>Course Categories - MaCosplay</title>
	<meta name="description" content="Explore our comprehensive range of cosplay makeup course categories. Find the perfect course for your interests and skill level." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
	<!-- Hero Section -->
	<section class="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white">
		<div class="absolute inset-0 bg-black/20"></div>
		<div class="relative container mx-auto px-6 py-16">
			<div class="text-center max-w-4xl mx-auto">
				<h1 class="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
					Explore Course Categories
				</h1>
				<p class="text-xl md:text-2xl mb-8 text-purple-100">
					Find the perfect course category that matches your interests and skill level
				</p>
				<div class="flex justify-center">
					<a href="/courses" class="btn bg-white text-purple-600 hover:bg-purple-50 border-none px-8 py-3 text-lg font-semibold rounded-full">
						View All Courses
					</a>
				</div>
			</div>
		</div>
	</section>

	<!-- Categories Grid -->
	<section class="py-16">
		<div class="container mx-auto px-6">
			<div class="text-center mb-12">
				<h2 class="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
					Choose Your Path
				</h2>
				<p class="text-xl text-gray-600 max-w-2xl mx-auto">
					Each category is carefully designed to help you master specific styles and techniques
				</p>
			</div>

			<div class="grid md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
				{#each categories as category}
					<div class="group card bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
						<div class="card-body p-0">
							<!-- Category Header -->
							<div class="bg-gradient-to-r {category.color} p-6 text-white relative overflow-hidden">
								<div class="absolute top-0 right-0 text-6xl opacity-20 transform rotate-12">
									{category.icon}
								</div>
								<div class="relative z-10">
									<div class="text-4xl mb-3">{category.icon}</div>
									<h3 class="text-2xl font-bold mb-2">{category.title}</h3>
									<p class="text-white/90">{category.description}</p>
								</div>
							</div>

							<!-- Category Content -->
							<div class="p-6">
								<div class="flex items-center justify-between mb-4">
									<div class="flex items-center gap-4 text-sm text-gray-600">
										<span class="flex items-center gap-1">
											⭐ {category.avgRating}
										</span>
										<span class="flex items-center gap-1">
											👥 {category.studentCount} students
										</span>
									</div>
								</div>

								<div class="mb-6">
									<h4 class="font-semibold text-gray-900 mb-3">Featured Courses:</h4>
									<ul class="space-y-2">
										{#each category.courses as course}
											<li class="flex items-start gap-2">
												<span class="text-purple-500 mt-1">•</span>
												<span class="text-gray-700 text-sm">{course}</span>
											</li>
										{/each}
									</ul>
								</div>

								<div class="card-actions">
									<button 
										on:click={() => selectedCategory = category}
										class="btn btn-primary bg-gradient-to-r {category.color} border-none text-white w-full group-hover:shadow-lg transition-all duration-300"
									>
										Explore Category
									</button>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Learning Path Section -->
	<section class="py-16 bg-white">
		<div class="container mx-auto px-6">
			<div class="text-center mb-12">
				<h2 class="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
					Suggested Learning Paths
				</h2>
				<p class="text-xl text-gray-600 max-w-2xl mx-auto">
					Follow these curated learning paths to build your skills progressively
				</p>
			</div>

			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
				<div class="card bg-gradient-to-br from-green-50 to-blue-50 border border-green-200">
					<div class="card-body p-6">
						<div class="text-3xl mb-4">🌱</div>
						<h3 class="text-xl font-bold mb-3">Complete Beginner Path</h3>
						<div class="space-y-2 text-sm">
							<div class="flex items-center gap-2">
								<span class="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">1</span>
								<span>Basic Cosplay Makeup Fundamentals</span>
							</div>
							<div class="flex items-center gap-2">
								<span class="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">2</span>
								<span>Color Theory & Application</span>
							</div>
							<div class="flex items-center gap-2">
								<span class="w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-xs">3</span>
								<span>Character Analysis Techniques</span>
							</div>
						</div>
						<div class="mt-4">
							<span class="badge badge-success">Recommended for newcomers</span>
						</div>
					</div>
				</div>

				<div class="card bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
					<div class="card-body p-6">
						<div class="text-3xl mb-4">🎭</div>
						<h3 class="text-xl font-bold mb-3">Anime Specialist Path</h3>
						<div class="space-y-2 text-sm">
							<div class="flex items-center gap-2">
								<span class="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs">1</span>
								<span>Basic Cosplay Makeup Fundamentals</span>
							</div>
							<div class="flex items-center gap-2">
								<span class="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs">2</span>
								<span>Anime & Manga Makeup Mastery</span>
							</div>
							<div class="flex items-center gap-2">
								<span class="w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-xs">3</span>
								<span>Advanced Character Transformation</span>
							</div>
						</div>
						<div class="mt-4">
							<span class="badge badge-primary">Popular choice</span>
						</div>
					</div>
				</div>

				<div class="card bg-gradient-to-br from-red-50 to-orange-50 border border-red-200">
					<div class="card-body p-6">
						<div class="text-3xl mb-4">🎨</div>
						<h3 class="text-xl font-bold mb-3">Professional Artist Path</h3>
						<div class="space-y-2 text-sm">
							<div class="flex items-center gap-2">
								<span class="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">1</span>
								<span>Advanced Character Transformation</span>
							</div>
							<div class="flex items-center gap-2">
								<span class="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">2</span>
								<span>Prosthetics & Special Effects</span>
							</div>
							<div class="flex items-center gap-2">
								<span class="w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-xs">3</span>
								<span>Business & Portfolio Development</span>
							</div>
						</div>
						<div class="mt-4">
							<span class="badge badge-error">Advanced level</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="py-16 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white">
		<div class="container mx-auto px-6 text-center">
			<h2 class="text-4xl font-bold mb-4">Ready to Start Learning?</h2>
			<p class="text-xl mb-8 text-purple-100">Join thousands of students who have transformed their cosplay skills</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<a href="/courses" class="btn bg-white text-purple-600 hover:bg-purple-50 border-none px-8 py-3 text-lg font-semibold rounded-full">
					Browse All Courses
				</a>
				<a href="/courses/instructors" class="btn btn-outline border-white text-white hover:bg-white hover:text-purple-600 px-8 py-3 text-lg font-semibold rounded-full">
					Meet Instructors
				</a>
			</div>
		</div>
	</section>
</div>

<!-- Category Detail Modal -->
{#if selectedCategory}
	<div class="modal modal-open">
		<div class="modal-box w-11/12 max-w-2xl">
			<form method="dialog">
				<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" on:click={() => selectedCategory = null}>✕</button>
			</form>
			
			<div class="bg-gradient-to-r {selectedCategory.color} -m-6 mb-6 p-6 text-white">
				<div class="text-4xl mb-3">{selectedCategory.icon}</div>
				<h3 class="text-3xl font-bold mb-2">{selectedCategory.title}</h3>
				<p class="text-white/90 text-lg">{selectedCategory.description}</p>
			</div>

			<div class="mb-6">
				<div class="flex items-center gap-6 mb-4">
					<div class="text-center">
						<div class="text-2xl font-bold text-purple-600">{selectedCategory.avgRating}</div>
						<div class="text-sm text-gray-600">Average Rating</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold text-purple-600">{selectedCategory.studentCount}</div>
						<div class="text-sm text-gray-600">Students</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold text-purple-600">{selectedCategory.courses.length}</div>
						<div class="text-sm text-gray-600">Courses</div>
					</div>
				</div>
			</div>

			<div class="mb-6">
				<h4 class="text-lg font-bold mb-3">Available Courses</h4>
				<div class="space-y-3">
					{#each selectedCategory.courses as course}
						<div class="p-3 bg-gray-50 rounded-lg border border-gray-200">
							<div class="font-semibold text-gray-900">{course}</div>
							<div class="text-sm text-gray-600 mt-1">Click to view course details</div>
						</div>
					{/each}
				</div>
			</div>

			<div class="modal-action">
				<a href="/courses" class="btn btn-primary bg-gradient-to-r {selectedCategory.color} border-none">
					View All Courses
				</a>
			</div>
		</div>
	</div>
{/if}