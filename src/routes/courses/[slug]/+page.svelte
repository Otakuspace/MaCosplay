<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	
	// In production, this would fetch course data from a database based on the slug
	const courseData = {
		'basic-cosplay-makeup': {
			id: 1,
			title: 'Basic Cosplay Makeup Fundamentals',
			description: 'Learn the essential techniques for creating stunning cosplay makeup looks. Perfect for beginners who want to transform into their favorite characters.',
			fullDescription: `This comprehensive course is designed for complete beginners who want to master the art of cosplay makeup. Over 4 weeks, you'll learn everything from basic color theory to character analysis, giving you the skills to transform into any character you choose.

Our expert instructor will guide you through hands-on exercises, provide personalized feedback, and help you build confidence in your makeup abilities. By the end of this course, you'll have created several complete character looks and understand the fundamental principles that make cosplay makeup so captivating.`,
			instructor: {
				name: 'Akira Tanaka',
				bio: 'Professional makeup artist with 8+ years of experience in cosplay and theatrical makeup. Winner of multiple cosplay competitions and featured makeup artist at major conventions.',
				image: '/static/instructor-akira.jpg',
				specialties: ['Character Analysis', 'Color Theory', 'Beginner-Friendly Teaching']
			},
			duration: '4 weeks',
			level: 'Beginner',
			price: 2500,
			originalPrice: 3500,
			image: '/static/course-basic.jpg',
			rating: 4.8,
			students: 156,
			reviews: 42,
			language: 'Thai with English subtitles',
			certificate: true,
			curriculum: [
				{
					week: 1,
					title: 'Foundation & Color Theory',
					lessons: [
						'Understanding your face shape and features',
						'Color theory basics for cosplay',
						'Choosing the right foundation and base',
						'Basic contouring techniques'
					]
				},
				{
					week: 2,
					title: 'Character Analysis & Planning',
					lessons: [
						'Breaking down character features',
						'Reference gathering and mood boards',
						'Planning your makeup approach',
						'Product selection for different characters'
					]
				},
				{
					week: 3,
					title: 'Eye Makeup & Expression',
					lessons: [
						'Creating different eye shapes',
						'Eyeshadow blending techniques',
						'Eyeliner styles for various characters',
						'Adding depth and dimension'
					]
				},
				{
					week: 4,
					title: 'Final Touches & Presentation',
					lessons: [
						'Highlighting and finishing touches',
						'Setting your makeup for photos',
						'Troubleshooting common issues',
						'Final project presentation'
					]
				}
			],
			features: [
				'4 weeks of structured lessons',
				'20+ video tutorials',
				'Live Q&A sessions',
				'Personal feedback on your work',
				'Course completion certificate',
				'Access to private Discord community',
				'Lifetime access to course materials',
				'Mobile-friendly content'
			],
			requirements: [
				'Basic makeup supplies (list provided)',
				'Camera or smartphone for practice photos',
				'Willingness to practice and experiment',
				'No prior makeup experience needed'
			],
			testimonials: [
				{
					name: 'Sarah Chen',
					rating: 5,
					comment: 'Amazing course! Akira-sensei explains everything so clearly. I went from knowing nothing about makeup to creating my first cosplay look!',
					image: '/static/student-1.jpg'
				},
				{
					name: 'Mike Johnson',
					rating: 5,
					comment: 'As a guy new to makeup, I was nervous, but the course made everything approachable. Now I can transform into any character!',
					image: '/static/student-2.jpg'
				}
			]
		},
		'advanced-character-transformation': {
			id: 2,
			title: 'Advanced Character Transformation',
			description: 'Master advanced techniques for dramatic character transformations including prosthetics, special effects, and complex color schemes.',
			fullDescription: `Take your cosplay makeup to the next level with advanced techniques used by professional makeup artists in film and theater. This intensive 8-week course covers everything from prosthetics application to creating supernatural and fantasy characters.

You'll learn industry-standard techniques for dramatic transformations, including how to completely change your facial structure, create realistic wounds and scars, and bring the most challenging characters to life. This course is perfect for experienced cosplayers looking to push their boundaries.`,
			instructor: {
				name: 'Yuki Sato',
				bio: 'Award-winning special effects makeup artist with credits in film and television. 12+ years of experience in prosthetics, character design, and advanced makeup techniques.',
				image: '/static/instructor-yuki.jpg',
				specialties: ['Prosthetics', 'Special Effects', 'Character Design']
			},
			duration: '8 weeks',
			level: 'Advanced',
			price: 4800,
			originalPrice: 6000,
			image: '/static/course-advanced.jpg',
			rating: 4.9,
			students: 89,
			reviews: 31,
			language: 'Thai with English subtitles',
			certificate: true,
			curriculum: [
				{
					week: 1,
					title: 'Advanced Face Sculpting',
					lessons: [
						'Professional contouring and highlighting',
						'Changing facial proportions',
						'Creating age effects',
						'Gender transformation techniques'
					]
				},
				{
					week: 2,
					title: 'Introduction to Prosthetics',
					lessons: [
						'Types of prosthetics and applications',
						'Adhesive techniques and safety',
						'Blending prosthetics seamlessly',
						'Creating custom pieces'
					]
				},
				{
					week: 3,
					title: 'Special Effects Makeup',
					lessons: [
						'Creating realistic wounds and scars',
						'Blood effects and textures',
						'Burn and decay effects',
						'Fantasy creature features'
					]
				},
				{
					week: 4,
					title: 'Color Theory Advanced',
					lessons: [
						'Complex color mixing',
						'Lighting considerations',
						'Skin tone variations',
						'Fantasy and unnatural colors'
					]
				}
			],
			features: [
				'8 weeks of intensive training',
				'40+ advanced video tutorials',
				'Weekly live workshops',
				'One-on-one mentoring sessions',
				'Professional certificate',
				'Industry networking opportunities',
				'Advanced materials kit included',
				'Portfolio development guidance'
			],
			requirements: [
				'Intermediate to advanced makeup skills',
				'Professional makeup kit',
				'Previous cosplay makeup experience',
				'Commitment to intensive practice schedule'
			]
		}
		// Add more courses as needed
	};

	$: slug = $page.params.slug;
	$: course = courseData[slug];

	let selectedTab = 'overview';
	let showEnrollModal = false;

	// If course doesn't exist, show 404-like message
	$: if (!course) {
		// In a real app, you might redirect to 404 or show an error
	}
</script>

<svelte:head>
	{#if course}
		<title>{course.title} - MaCosplay Courses</title>
		<meta name="description" content={course.description} />
	{:else}
		<title>Course Not Found - MaCosplay</title>
	{/if}
</svelte:head>

{#if course}
	<div class="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
		<!-- Hero Section -->
		<section class="bg-white border-b border-gray-200">
			<div class="container mx-auto px-6 py-8">
				<div class="grid lg:grid-cols-3 gap-8">
					<!-- Course Info -->
					<div class="lg:col-span-2">
						<div class="mb-4">
							<div class="flex items-center gap-2 text-sm text-gray-600 mb-2">
								<a href="/courses" class="hover:text-purple-600">Courses</a>
								<span>›</span>
								<span class="text-purple-600">{course.title}</span>
							</div>
							<h1 class="text-4xl font-bold text-gray-900 mb-4">{course.title}</h1>
							<p class="text-xl text-gray-600 mb-6">{course.description}</p>
						</div>

						<div class="flex flex-wrap items-center gap-6 mb-6">
							<div class="flex items-center gap-2">
								<span class="text-yellow-500">⭐</span>
								<span class="font-semibold">{course.rating}</span>
								<span class="text-gray-600">({course.reviews} reviews)</span>
							</div>
							<div class="flex items-center gap-2">
								<span>👥</span>
								<span class="text-gray-600">{course.students} students enrolled</span>
							</div>
							<div class="flex items-center gap-2">
								<span>🕒</span>
								<span class="text-gray-600">{course.duration}</span>
							</div>
							<span class="badge badge-primary">{course.level}</span>
						</div>

						<div class="flex items-center gap-4 mb-6">
							<img src={course.instructor.image || '/static/default-instructor.jpg'} alt={course.instructor.name} class="w-12 h-12 rounded-full object-cover">
							<div>
								<div class="font-semibold text-gray-900">Instructor: {course.instructor.name}</div>
								<div class="text-gray-600 text-sm">{course.instructor.bio}</div>
							</div>
						</div>
					</div>

					<!-- Enrollment Card -->
					<div class="lg:col-span-1">
						<div class="card bg-white shadow-lg border border-gray-200 sticky top-4">
							<div class="card-body p-6">
								<div class="text-center mb-6">
									<div class="text-3xl font-bold text-purple-600 mb-1">
										฿{course.price.toLocaleString()}
									</div>
									{#if course.originalPrice}
										<div class="text-lg text-gray-500 line-through">
											฿{course.originalPrice.toLocaleString()}
										</div>
										<div class="badge badge-success">
											Save ฿{(course.originalPrice - course.price).toLocaleString()}
										</div>
									{/if}
								</div>

								<button 
									on:click={() => showEnrollModal = true}
									class="btn btn-primary w-full bg-gradient-to-r from-purple-600 to-pink-600 border-none text-white text-lg py-3 mb-4 hover:shadow-lg"
								>
									Enroll Now
								</button>

								<button class="btn btn-outline btn-primary w-full mb-6">
									Add to Wishlist ♡
								</button>

								<div class="space-y-3 text-sm">
									<div class="flex justify-between">
										<span class="text-gray-600">Duration:</span>
										<span class="font-semibold">{course.duration}</span>
									</div>
									<div class="flex justify-between">
										<span class="text-gray-600">Level:</span>
										<span class="font-semibold">{course.level}</span>
									</div>
									<div class="flex justify-between">
										<span class="text-gray-600">Language:</span>
										<span class="font-semibold">{course.language}</span>
									</div>
									<div class="flex justify-between">
										<span class="text-gray-600">Certificate:</span>
										<span class="font-semibold">{course.certificate ? 'Yes' : 'No'}</span>
									</div>
								</div>

								<div class="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
									<div class="flex items-center gap-2 text-green-700 font-semibold mb-2">
										<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
										</svg>
										30-Day Money Back Guarantee
									</div>
									<p class="text-green-600 text-sm">
										Not satisfied? Get a full refund within 30 days.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Course Content -->
		<section class="py-8">
			<div class="container mx-auto px-6">
				<div class="grid lg:grid-cols-3 gap-8">
					<div class="lg:col-span-2">
						<!-- Tabs -->
						<div class="tabs tabs-boxed bg-white p-1 mb-8 shadow-sm border border-gray-200">
							<button 
								class="tab {selectedTab === 'overview' ? 'tab-active' : ''}"
								on:click={() => selectedTab = 'overview'}
							>
								Overview
							</button>
							<button 
								class="tab {selectedTab === 'curriculum' ? 'tab-active' : ''}"
								on:click={() => selectedTab = 'curriculum'}
							>
								Curriculum
							</button>
							<button 
								class="tab {selectedTab === 'instructor' ? 'tab-active' : ''}"
								on:click={() => selectedTab = 'instructor'}
							>
								Instructor
							</button>
							<button 
								class="tab {selectedTab === 'reviews' ? 'tab-active' : ''}"
								on:click={() => selectedTab = 'reviews'}
							>
								Reviews
							</button>
						</div>

						<!-- Tab Content -->
						<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
							{#if selectedTab === 'overview'}
								<div class="prose max-w-none">
									<h2 class="text-2xl font-bold mb-4">About This Course</h2>
									<p class="text-gray-700 leading-relaxed mb-6">{course.fullDescription}</p>
									
									<h3 class="text-xl font-bold mb-4">What You'll Learn</h3>
									<div class="grid md:grid-cols-2 gap-4 mb-6">
										{#each course.features as feature}
											<div class="flex items-start gap-3">
												<svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
												</svg>
												<span class="text-gray-700">{feature}</span>
											</div>
										{/each}
									</div>

									<h3 class="text-xl font-bold mb-4">Requirements</h3>
									<ul class="list-disc list-inside text-gray-700 space-y-2">
										{#each course.requirements as requirement}
											<li>{requirement}</li>
										{/each}
									</ul>
								</div>
							{:else if selectedTab === 'curriculum'}
								<div>
									<h2 class="text-2xl font-bold mb-6">Course Curriculum</h2>
									<div class="space-y-6">
										{#each course.curriculum as week}
											<div class="border border-gray-200 rounded-lg overflow-hidden">
												<div class="bg-gradient-to-r from-purple-50 to-pink-50 p-4 border-b border-gray-200">
													<h3 class="text-lg font-bold text-gray-900">
														Week {week.week}: {week.title}
													</h3>
												</div>
												<div class="p-4">
													<ul class="space-y-3">
														{#each week.lessons as lesson}
															<li class="flex items-start gap-3">
																<svg class="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h1m4 0h1M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
																</svg>
																<span class="text-gray-700">{lesson}</span>
															</li>
														{/each}
													</ul>
												</div>
											</div>
										{/each}
									</div>
								</div>
							{:else if selectedTab === 'instructor'}
								<div>
									<h2 class="text-2xl font-bold mb-6">Meet Your Instructor</h2>
									<div class="flex items-start gap-6 mb-6">
										<img src={course.instructor.image || '/static/default-instructor.jpg'} alt={course.instructor.name} class="w-24 h-24 rounded-full object-cover">
										<div>
											<h3 class="text-xl font-bold text-gray-900 mb-2">{course.instructor.name}</h3>
											<p class="text-gray-700 leading-relaxed">{course.instructor.bio}</p>
										</div>
									</div>
									
									<h4 class="text-lg font-semibold mb-3">Specialties</h4>
									<div class="flex flex-wrap gap-2">
										{#each course.instructor.specialties as specialty}
											<span class="badge badge-outline badge-primary">{specialty}</span>
										{/each}
									</div>
								</div>
							{:else if selectedTab === 'reviews'}
								<div>
									<h2 class="text-2xl font-bold mb-6">Student Reviews</h2>
									
									<div class="flex items-center gap-4 mb-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
										<div class="text-center">
											<div class="text-4xl font-bold text-purple-600">{course.rating}</div>
											<div class="text-yellow-500 text-xl">★★★★★</div>
											<div class="text-gray-600 text-sm">Course Rating</div>
										</div>
										<div class="flex-1">
											<div class="text-lg font-semibold text-gray-900 mb-2">
												{course.reviews} Reviews from {course.students} Students
											</div>
											<div class="text-gray-600">
												Students love the detailed explanations and practical approach of this course.
											</div>
										</div>
									</div>

									{#if course.testimonials}
										<div class="space-y-6">
											{#each course.testimonials as testimonial}
												<div class="border border-gray-200 rounded-lg p-6">
													<div class="flex items-start gap-4">
														<img src={testimonial.image || '/static/default-avatar.jpg'} alt={testimonial.name} class="w-12 h-12 rounded-full object-cover">
														<div class="flex-1">
															<div class="flex items-center gap-2 mb-2">
																<h4 class="font-semibold text-gray-900">{testimonial.name}</h4>
																<div class="text-yellow-500">
																	{'★'.repeat(testimonial.rating)}
																</div>
															</div>
															<p class="text-gray-700">{testimonial.comment}</p>
														</div>
													</div>
												</div>
											{/each}
										</div>
									{/if}
								</div>
							{/if}
						</div>
					</div>

					<!-- Sidebar -->
					<div class="lg:col-span-1">
						<!-- Related Courses -->
						<div class="card bg-white shadow-sm border border-gray-200 mb-6">
							<div class="card-body p-6">
								<h3 class="text-lg font-bold mb-4">Related Courses</h3>
								<div class="space-y-4">
									<a href="/courses/anime-manga-makeup" class="block p-3 hover:bg-gray-50 rounded-lg transition-colors">
										<div class="font-semibold text-sm text-gray-900">Anime & Manga Makeup</div>
										<div class="text-xs text-gray-600">Intermediate • ฿3,500</div>
									</a>
									<a href="/courses/horror-gothic-makeup" class="block p-3 hover:bg-gray-50 rounded-lg transition-colors">
										<div class="font-semibold text-sm text-gray-900">Horror & Gothic Makeup</div>
										<div class="text-xs text-gray-600">Intermediate • ฿3,200</div>
									</a>
								</div>
							</div>
						</div>

						<!-- Support -->
						<div class="card bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
							<div class="card-body p-6 text-center">
								<h3 class="text-lg font-bold mb-2">Need Help?</h3>
								<p class="text-gray-600 text-sm mb-4">Have questions about this course? Our support team is here to help!</p>
								<button class="btn btn-outline btn-primary btn-sm">Contact Support</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>

	<!-- Enrollment Modal -->
	{#if showEnrollModal}
		<div class="modal modal-open">
			<div class="modal-box max-w-md">
				<h3 class="font-bold text-lg mb-4">Enroll in {course.title}</h3>
				<div class="py-4">
					<div class="text-center mb-6">
						<div class="text-2xl font-bold text-purple-600">
							฿{course.price.toLocaleString()}
						</div>
						<div class="text-gray-600">One-time payment</div>
					</div>
					
					<div class="space-y-4">
						<button class="btn btn-primary w-full bg-gradient-to-r from-purple-600 to-pink-600 border-none">
							Pay with Credit Card
						</button>
						<button class="btn btn-outline w-full">
							Pay with Bank Transfer
						</button>
					</div>
				</div>
				<div class="modal-action">
					<button class="btn" on:click={() => showEnrollModal = false}>Cancel</button>
				</div>
			</div>
		</div>
	{/if}
{:else}
	<!-- Course Not Found -->
	<div class="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
		<div class="text-center">
			<div class="text-6xl mb-4">😞</div>
			<h1 class="text-3xl font-bold text-gray-900 mb-4">Course Not Found</h1>
			<p class="text-gray-600 mb-8">The course you're looking for doesn't exist or has been removed.</p>
			<a href="/courses" class="btn btn-primary bg-gradient-to-r from-purple-600 to-pink-600 border-none">
				Browse All Courses
			</a>
		</div>
	</div>
{/if}