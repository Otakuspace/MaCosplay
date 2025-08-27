<script lang="ts">
	// Sample instructor data - in production this would come from a database
	const instructors = [
		{
			id: 1,
			name: 'Akira Tanaka',
			slug: 'akira-tanaka',
			title: 'Senior Cosplay Makeup Artist',
			bio: 'Professional makeup artist with 8+ years of experience in cosplay and theatrical makeup. Winner of multiple cosplay competitions and featured makeup artist at major conventions across Asia.',
			fullBio: `Akira began her journey in cosplay makeup during university, where she studied Fine Arts with a focus on theatrical design. Her passion for character transformation led her to specialize in cosplay makeup, and she quickly gained recognition in the community for her attention to detail and innovative techniques.

Over the years, Akira has worked with numerous cosplayers, helping them bring their favorite characters to life. She has been featured as a guest artist at major conventions including Tokyo Comic Con, Thailand Comic Con, and Singapore Anime Festival. Her work has been published in several cosplay magazines and featured on social media platforms with millions of views.

Akira's teaching philosophy centers around building confidence and creativity. She believes that makeup is not just about technique, but about understanding the character's essence and translating that into a visual transformation. Her patient and encouraging approach has helped hundreds of students discover their own artistic voice.`,
			image: '/static/instructor-akira.jpg',
			specialties: ['Character Analysis', 'Color Theory', 'Beginner-Friendly Teaching', 'Convention Makeup'],
			experience: '8+ years',
			students: 450,
			courses: ['Basic Cosplay Makeup Fundamentals'],
			achievements: [
				'Winner - Best Makeup Artist, Tokyo Comic Con 2023',
				'Featured Artist - Cosplay Weekly Magazine',
				'Guest Judge - Asian Cosplay Championship 2022',
				'Certified Professional Makeup Artist (CPMA)'
			],
			socialMedia: {
				instagram: '@akira_cosplay_makeup',
				youtube: 'AkiraMakeupTutorials',
				tiktok: '@akiracosplay'
			},
			rating: 4.9,
			reviews: 89
		},
		{
			id: 2,
			name: 'Yuki Sato',
			slug: 'yuki-sato',
			title: 'Special Effects Makeup Specialist',
			bio: 'Award-winning special effects makeup artist with credits in film and television. 12+ years of experience in prosthetics, character design, and advanced makeup techniques.',
			fullBio: `Yuki's career began in the film industry, where she worked as an assistant makeup artist on several Japanese horror films. Her talent for creating realistic special effects quickly caught the attention of directors and producers, leading to her first major film credit as lead makeup artist on the acclaimed thriller "Midnight Shadows."

Her transition into cosplay came naturally, as many cosplayers sought her expertise for creating elaborate character transformations. Yuki's background in film prosthetics and special effects gives her a unique perspective on cosplay makeup, allowing her to teach techniques that go far beyond traditional cosmetic application.

Yuki is known for her meticulous approach and her ability to break down complex techniques into manageable steps. Her advanced courses are highly sought after by serious cosplayers looking to push the boundaries of their craft. She regularly collaborates with prosthetics manufacturers to develop new products and techniques for the cosplay community.`,
			image: '/static/instructor-yuki.jpg',
			specialties: ['Prosthetics Application', 'Special Effects', 'Character Design', 'Film Techniques'],
			experience: '12+ years',
			students: 180,
			courses: ['Advanced Character Transformation'],
			achievements: [
				'Best Makeup Artist - Japan Film Awards 2021',
				'Special Effects Innovation Award - Makeup Artists Guild',
				'Guest Lecturer - Tokyo University of Arts',
				'Prosthetics Consultant - Major Film Studios'
			],
			socialMedia: {
				instagram: '@yuki_sfx_makeup',
				youtube: 'YukiSFXTutorials',
				twitter: '@yukisfx'
			},
			rating: 4.9,
			reviews: 67
		},
		{
			id: 3,
			name: 'Rei Nakamura',
			slug: 'rei-nakamura',
			title: 'Anime & Manga Makeup Expert',
			bio: 'Specialist in anime and manga character makeup with a deep understanding of Japanese pop culture. Known for creating authentic and expressive character transformations.',
			fullBio: `Rei's love for anime and manga began in childhood, and this passion naturally evolved into a career in cosplay makeup. With a background in graphic design and illustration, she brings a unique artistic perspective to character transformation, understanding not just the visual elements but the emotional essence of each character.

Her expertise in anime-style makeup has made her a go-to artist for major anime conventions and cosplay competitions throughout Asia. Rei has worked with professional cosplayers, voice actors, and even anime studios for promotional events. Her ability to capture the distinctive features of anime characters - from the iconic large eyes to the unique color palettes - has earned her recognition as one of the leading experts in this specialized field.

Rei's teaching style combines technical instruction with cultural context, helping students understand not just how to create a look, but why certain choices work better for different types of characters. Her courses are particularly popular among fans of anime and manga who want to achieve authentic character transformations.`,
			image: '/static/instructor-rei.jpg',
			specialties: ['Anime Character Makeup', 'Eye Enhancement', 'Color Theory', 'Cultural Authenticity'],
			experience: '6+ years',
			students: 320,
			courses: ['Anime & Manga Makeup Mastery'],
			achievements: [
				'Best Anime Makeup Artist - Asia Cosplay Summit 2022',
				'Official Makeup Artist - Anime Expo Japan',
				'Featured Creator - Cosplay Culture Magazine',
				'Collaboration Artist - Major Anime Studios'
			],
			socialMedia: {
				instagram: '@rei_anime_makeup',
				youtube: 'ReiAnimeMakeup',
				tiktok: '@reicosplay'
			},
			rating: 4.8,
			reviews: 94
		},
		{
			id: 4,
			name: 'Kuro Yamada',
			slug: 'kuro-yamada',
			title: 'Horror & Gothic Makeup Artist',
			bio: 'Master of dark arts in makeup, specializing in horror, gothic, and supernatural character transformations. Creates hauntingly beautiful and terrifyingly realistic looks.',
			fullBio: `Kuro discovered her calling in the darker side of makeup artistry during her studies in theatrical design. Her fascination with horror films, gothic literature, and supernatural themes led her to develop a unique style that combines traditional makeup techniques with avant-garde artistic expression.

Her work has been featured in numerous horror film productions, gothic fashion shows, and dark fantasy cosplay competitions. Kuro's ability to create both beautiful gothic looks and terrifying horror effects has made her a sought-after artist in both the entertainment industry and the cosplay community.

What sets Kuro apart is her understanding of atmosphere and mood. She doesn't just create looks - she creates experiences. Her courses go beyond technique to explore the psychology of fear, the aesthetics of darkness, and the art of creating emotional impact through makeup. Students learn not just how to apply products, but how to tell stories through their transformations.`,
			image: '/static/instructor-kuro.jpg',
			specialties: ['Horror Effects', 'Gothic Aesthetics', 'Atmospheric Makeup', 'Dark Fantasy'],
			experience: '7+ years',
			students: 210,
			courses: ['Horror & Gothic Cosplay Makeup'],
			achievements: [
				'Best Horror Makeup - International Horror Film Festival',
				'Gothic Beauty Award - Dark Arts Convention',
				'Featured Artist - Horror Makeup Magazine',
				'Certified Special Effects Makeup Artist'
			],
			socialMedia: {
				instagram: '@kuro_dark_arts',
				youtube: 'KuroDarkMakeup',
				twitter: '@kurogothic'
			},
			rating: 4.7,
			reviews: 73
		}
	];

	let selectedInstructor = null;
</script>

<svelte:head>
	<title>Meet Our Instructors - MaCosplay Courses</title>
	<meta name="description" content="Learn from the best cosplay makeup artists in the industry. Meet our expert instructors who will guide you through your transformation journey." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
	<!-- Hero Section -->
	<section class="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white">
		<div class="absolute inset-0 bg-black/20"></div>
		<div class="relative container mx-auto px-6 py-16">
			<div class="text-center max-w-4xl mx-auto">
				<h1 class="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
					Meet Our Expert Instructors
				</h1>
				<p class="text-xl md:text-2xl mb-8 text-purple-100">
					Learn from industry professionals who are passionate about sharing their expertise
				</p>
			</div>
		</div>
	</section>

	<!-- Instructors Grid -->
	<section class="py-16">
		<div class="container mx-auto px-6">
			<div class="grid md:grid-cols-2 xl:grid-cols-2 gap-8 max-w-6xl mx-auto">
				{#each instructors as instructor}
					<div class="card bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
						<div class="card-body p-8">
							<div class="flex items-start gap-6 mb-6">
								<div class="avatar">
									<div class="w-20 h-20 rounded-full ring ring-purple-200 ring-offset-2">
										<img src={instructor.image || '/static/default-instructor.jpg'} alt={instructor.name} class="rounded-full object-cover" />
									</div>
								</div>
								<div class="flex-1">
									<h3 class="text-2xl font-bold text-gray-900 mb-1">{instructor.name}</h3>
									<p class="text-purple-600 font-semibold mb-2">{instructor.title}</p>
									<div class="flex items-center gap-4 text-sm text-gray-600">
										<span class="flex items-center gap-1">
											⭐ {instructor.rating}
										</span>
										<span class="flex items-center gap-1">
											👥 {instructor.students} students
										</span>
										<span class="flex items-center gap-1">
											🎓 {instructor.experience}
										</span>
									</div>
								</div>
							</div>

							<p class="text-gray-700 mb-6 leading-relaxed">{instructor.bio}</p>

							<div class="mb-6">
								<h4 class="font-semibold text-gray-900 mb-3">Specialties</h4>
								<div class="flex flex-wrap gap-2">
									{#each instructor.specialties as specialty}
										<span class="badge badge-outline badge-primary text-xs">
											{specialty}
										</span>
									{/each}
								</div>
							</div>

							<div class="mb-6">
								<h4 class="font-semibold text-gray-900 mb-3">Teaching Courses</h4>
								<div class="space-y-2">
									{#each instructor.courses as course}
										<div class="text-sm text-purple-600 hover:text-purple-800 cursor-pointer">
											📚 {course}
										</div>
									{/each}
								</div>
							</div>

							<div class="card-actions justify-between items-center pt-4 border-t border-gray-100">
								<button 
									on:click={() => selectedInstructor = instructor}
									class="btn btn-primary bg-gradient-to-r from-purple-600 to-pink-600 border-none text-white"
								>
									View Profile
								</button>
								<div class="flex gap-2">
									{#if instructor.socialMedia.instagram}
										<a href="https://instagram.com/{instructor.socialMedia.instagram.replace('@', '')}" target="_blank" class="btn btn-ghost btn-sm btn-circle">
											<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
												<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
											</svg>
										</a>
									{/if}
									{#if instructor.socialMedia.youtube}
										<a href="https://youtube.com/@{instructor.socialMedia.youtube}" target="_blank" class="btn btn-ghost btn-sm btn-circle">
											<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
												<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
											</svg>
										</a>
									{/if}
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Why Learn From Our Instructors -->
	<section class="py-16 bg-white">
		<div class="container mx-auto px-6">
			<div class="text-center mb-12">
				<h2 class="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
					Why Learn From Our Instructors?
				</h2>
				<p class="text-xl text-gray-600 max-w-2xl mx-auto">
					Our instructors bring real-world experience and passion to every lesson
				</p>
			</div>

			<div class="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
				<div class="text-center p-6">
					<div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
						</svg>
					</div>
					<h3 class="text-xl font-bold mb-2">Industry Experience</h3>
					<p class="text-gray-600">Learn from professionals with years of real-world experience in film, theater, and cosplay</p>
				</div>
				
				<div class="text-center p-6">
					<div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
						</svg>
					</div>
					<h3 class="text-xl font-bold mb-2">Passionate Teaching</h3>
					<p class="text-gray-600">Our instructors are genuinely passionate about sharing their knowledge and helping students succeed</p>
				</div>
				
				<div class="text-center p-6">
					<div class="w-16 h-16 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
						</svg>
					</div>
					<h3 class="text-xl font-bold mb-2">Cutting-Edge Techniques</h3>
					<p class="text-gray-600">Stay ahead with the latest techniques, trends, and innovations in cosplay makeup artistry</p>
				</div>
			</div>
		</div>
	</section>
</div>

<!-- Instructor Detail Modal -->
{#if selectedInstructor}
	<div class="modal modal-open">
		<div class="modal-box w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
			<form method="dialog">
				<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" on:click={() => selectedInstructor = null}>✕</button>
			</form>
			
			<div class="flex items-start gap-6 mb-6">
				<div class="avatar">
					<div class="w-24 h-24 rounded-full ring ring-purple-200 ring-offset-2">
						<img src={selectedInstructor.image || '/static/default-instructor.jpg'} alt={selectedInstructor.name} class="rounded-full object-cover" />
					</div>
				</div>
				<div class="flex-1">
					<h3 class="text-3xl font-bold text-gray-900 mb-2">{selectedInstructor.name}</h3>
					<p class="text-purple-600 font-semibold text-lg mb-3">{selectedInstructor.title}</p>
					<div class="flex items-center gap-6 text-sm text-gray-600">
						<span class="flex items-center gap-1">
							⭐ {selectedInstructor.rating} ({selectedInstructor.reviews} reviews)
						</span>
						<span class="flex items-center gap-1">
							👥 {selectedInstructor.students} students taught
						</span>
						<span class="flex items-center gap-1">
							🎓 {selectedInstructor.experience} experience
						</span>
					</div>
				</div>
			</div>

			<div class="prose max-w-none mb-8">
				<h4 class="text-xl font-bold mb-4">About {selectedInstructor.name}</h4>
				<div class="text-gray-700 leading-relaxed whitespace-pre-line">
					{selectedInstructor.fullBio}
				</div>
			</div>

			<div class="grid md:grid-cols-2 gap-8 mb-8">
				<div>
					<h4 class="text-lg font-bold mb-4">Specialties</h4>
					<div class="flex flex-wrap gap-2">
						{#each selectedInstructor.specialties as specialty}
							<span class="badge badge-outline badge-primary">
								{specialty}
							</span>
						{/each}
					</div>
				</div>

				<div>
					<h4 class="text-lg font-bold mb-4">Achievements</h4>
					<ul class="space-y-2">
						{#each selectedInstructor.achievements as achievement}
							<li class="flex items-start gap-2">
								<span class="text-yellow-500 mt-0.5">🏆</span>
								<span class="text-gray-700 text-sm">{achievement}</span>
							</li>
						{/each}
					</ul>
				</div>
			</div>

			<div class="mb-8">
				<h4 class="text-lg font-bold mb-4">Teaching Courses</h4>
				<div class="space-y-3">
					{#each selectedInstructor.courses as course}
						<div class="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
							<div class="font-semibold text-gray-900">{course}</div>
							<div class="text-sm text-gray-600 mt-1">Click to view course details</div>
						</div>
					{/each}
				</div>
			</div>

			<div class="flex items-center justify-between pt-6 border-t border-gray-200">
				<div>
					<h4 class="font-semibold mb-2">Follow {selectedInstructor.name}</h4>
					<div class="flex gap-3">
						{#if selectedInstructor.socialMedia.instagram}
							<a href="https://instagram.com/{selectedInstructor.socialMedia.instagram.replace('@', '')}" target="_blank" class="btn btn-ghost btn-sm">
								<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
									<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
								</svg>
								Instagram
							</a>
						{/if}
						{#if selectedInstructor.socialMedia.youtube}
							<a href="https://youtube.com/@{selectedInstructor.socialMedia.youtube}" target="_blank" class="btn btn-ghost btn-sm">
								<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
									<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
								</svg>
								YouTube
							</a>
						{/if}
					</div>
				</div>
				<div class="text-right">
					<button class="btn btn-primary bg-gradient-to-r from-purple-600 to-pink-600 border-none">
						View Courses
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}