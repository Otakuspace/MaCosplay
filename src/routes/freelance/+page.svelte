<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let { data } = $props();

	// Freelance services data
	const freelanceServices = [
		{
			id: 1,
			title: 'Makeup Artist',
			description: 'Professional makeup services for cosplay, events, and photoshoots',
			icon: '🎨',
			categories: ['Cosplay Makeup', 'Event Makeup', 'Photoshoot Makeup', 'Special Effects'],
			priceRange: '฿500 - ฿3,000',
			experience: '2+ years',
			location: 'Bangkok, Thailand'
		},
		{
			id: 2,
			title: 'Prop Maker',
			description: 'Custom prop creation for cosplay, theater, and events',
			icon: '⚔️',
			categories: ['Weapons', 'Armor', 'Accessories', 'Decorative Props'],
			priceRange: '฿1,000 - ฿10,000',
			experience: '3+ years',
			location: 'Bangkok, Thailand'
		},
		{
			id: 3,
			title: 'Costume Designer',
			description: 'Custom costume design and creation for cosplay and events',
			icon: '👗',
			categories: ['Cosplay Costumes', 'Historical Costumes', 'Fantasy Costumes', 'Event Wear'],
			priceRange: '฿2,000 - ฿15,000',
			experience: '4+ years',
			location: 'Bangkok, Thailand'
		},
		{
			id: 4,
			title: 'Photographer',
			description: 'Professional photography for cosplay, events, and portraits',
			icon: '📸',
			categories: ['Cosplay Photography', 'Event Photography', 'Portrait Photography', 'Product Photography'],
			priceRange: '฿1,500 - ฿8,000',
			experience: '3+ years',
			location: 'Bangkok, Thailand'
		},
		{
			id: 5,
			title: 'Wig Stylist',
			description: 'Custom wig styling and maintenance for cosplay',
			icon: '💇‍♀️',
			categories: ['Wig Styling', 'Wig Maintenance', 'Custom Coloring', 'Hair Extensions'],
			priceRange: '฿800 - ฿5,000',
			experience: '2+ years',
			location: 'Bangkok, Thailand'
		},
		{
			id: 6,
			title: 'Event Organizer',
			description: 'Professional event planning and coordination for cosplay events',
			icon: '🎪',
			categories: ['Cosplay Events', 'Conventions', 'Photoshoots', 'Workshops'],
			priceRange: '฿5,000 - ฿50,000',
			experience: '5+ years',
			location: 'Bangkok, Thailand'
		},
		{
			id: 7,
			title: '3D Modeler',
			description: '3D modeling and printing services for props and accessories',
			icon: '🖨️',
			categories: ['3D Modeling', '3D Printing', 'Prop Design', 'Accessories'],
			priceRange: '฿1,500 - ฿12,000',
			experience: '3+ years',
			location: 'Bangkok, Thailand'
		},
		{
			id: 8,
			title: 'Voice Actor',
			description: 'Professional voice acting for cosplay videos and content',
			icon: '🎭',
			categories: ['Character Voices', 'Narration', 'Dubbing', 'Audio Content'],
			priceRange: '฿1,000 - ฿8,000',
			experience: '2+ years',
			location: 'Bangkok, Thailand'
		}
	];

	let selectedCategory = $state('all');
	let searchQuery = $state('');

	// Filter services based on search and category
	const filteredServices = $derived(
		freelanceServices.filter((service) => {
			const matchesSearch =
				service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
				service.categories.some((cat) => cat.toLowerCase().includes(searchQuery.toLowerCase()));

			const matchesCategory =
				selectedCategory === 'all' ||
				service.categories.some((cat) => cat.toLowerCase().includes(selectedCategory.toLowerCase()));

			return matchesSearch && matchesCategory;
		})
	);

	// Get unique categories for filter
	const allCategories = $derived(['all', ...new Set(freelanceServices.flatMap((service) => service.categories))]);

	function contactFreelancer(serviceId: number) {
		// TODO: Implement contact functionality
		console.log('Contact freelancer:', serviceId);
		// You can redirect to a contact form or open a modal
	}

	function viewPortfolio(serviceId: number) {
		// TODO: Implement portfolio view functionality
		console.log('View portfolio:', serviceId);
		// You can redirect to a portfolio page or open a modal
	}
</script>

<svelte:head>
	<title>Freelance Services - MaCosplay</title>
	<meta name="description" content="Find professional freelance services for cosplay including makeup artists, prop makers, costume designers, and more." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
	<!-- Hero Section -->
	<div class="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
			<div class="text-center">
				<h1 class="text-4xl md:text-6xl font-bold mb-6">
					Freelance Services
				</h1>
				<p class="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
					Discover talented professionals for your cosplay needs. From makeup artists to prop makers, find the perfect freelancer for your project.
				</p>
				<div class="flex flex-col sm:flex-row gap-4 justify-center">
					<button class="btn btn-primary btn-lg">
						Hire a Freelancer
					</button>
					<button class="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-purple-600">
						Become a Freelancer
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Search and Filter Section -->
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<!-- Search -->
				<div class="relative">
					<input
						type="text"
						placeholder="Search services..."
						bind:value={searchQuery}
						class="input input-bordered w-full pl-10"
					/>
					<svg class="absolute left-3 top-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
				</div>

				<!-- Category Filter -->
				<div class="relative">
					<select bind:value={selectedCategory} class="select select-bordered w-full">
						{#each allCategories as category}
							<option value={category}>
								{category === 'all' ? 'All Categories' : category}
							</option>
						{/each}
					</select>
				</div>
			</div>
		</div>

		<!-- Services Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			{#each filteredServices as service}
				<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
					<!-- Service Header -->
					<div class="p-6">
						<div class="flex items-center mb-4">
							<span class="text-3xl mr-3">{service.icon}</span>
							<h3 class="text-xl font-bold text-gray-900 dark:text-white">{service.title}</h3>
						</div>
						
						<p class="text-gray-600 dark:text-gray-300 mb-4">{service.description}</p>
						
						<!-- Categories -->
						<div class="flex flex-wrap gap-2 mb-4">
							{#each service.categories.slice(0, 3) as category}
								<span class="badge badge-primary badge-sm">{category}</span>
							{/each}
							{#if service.categories.length > 3}
								<span class="badge badge-outline badge-sm">+{service.categories.length - 3} more</span>
							{/if}
						</div>

						<!-- Service Details -->
						<div class="space-y-2 mb-6">
							<div class="flex justify-between text-sm">
								<span class="text-gray-500 dark:text-gray-400">Price Range:</span>
								<span class="font-medium text-green-600 dark:text-green-400">{service.priceRange}</span>
							</div>
							<div class="flex justify-between text-sm">
								<span class="text-gray-500 dark:text-gray-400">Experience:</span>
								<span class="font-medium">{service.experience}</span>
							</div>
							<div class="flex justify-between text-sm">
								<span class="text-gray-500 dark:text-gray-400">Location:</span>
								<span class="font-medium">{service.location}</span>
							</div>
						</div>

						<!-- Action Buttons -->
						<div class="flex gap-2">
							<button 
								on:click={() => contactFreelancer(service.id)}
								class="btn btn-primary btn-sm flex-1"
							>
								Contact
							</button>
							<button 
								on:click={() => viewPortfolio(service.id)}
								class="btn btn-outline btn-sm"
							>
								Portfolio
							</button>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- No Results Message -->
		{#if filteredServices.length === 0}
			<div class="text-center py-12">
				<div class="text-6xl mb-4">🔍</div>
				<h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">No services found</h3>
				<p class="text-gray-600 dark:text-gray-300">Try adjusting your search terms or category filter.</p>
			</div>
		{/if}

		<!-- Call to Action -->
		<div class="text-center py-12">
			<div class="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-8 text-white">
				<h2 class="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
				<p class="text-xl mb-6">Join our community of talented freelancers and clients.</p>
				<div class="flex flex-col sm:flex-row gap-4 justify-center">
					<button class="btn btn-primary btn-lg bg-white text-purple-600 hover:bg-gray-100">
						Post a Project
					</button>
					<button class="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-purple-600">
						Join as Freelancer
					</button>
				</div>
			</div>
		</div>
	</div>
</div>