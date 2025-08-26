<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import PhotoUpload from './components/PhotoUpload.svelte';
	import PhotoGrid from './components/PhotoGrid.svelte';
	import PhotoModal from './components/PhotoModal.svelte';

	interface CosplayPhoto {
		id: string;
		title: string;
		description: string;
		imageUrl: string;
		thumbnailUrl: string;
		tags: string[];
		uploadedAt: Date;
		character?: string;
		series?: string;
		photographer?: string;
	}

	let photos = writable<CosplayPhoto[]>([]);
	let selectedPhoto = writable<CosplayPhoto | null>(null);
	let isUploadModalOpen = false;
	let isPhotoModalOpen = false;
	let isEditModalOpen = false;
	let editingPhoto: CosplayPhoto | null = null;
	let searchTerm = '';
	let selectedTag = '';
	let sortBy = 'newest';

	// Sample data for demonstration
	const samplePhotos: CosplayPhoto[] = [
		{
			id: '1',
			title: 'Nezuko Kamado Cosplay',
			description: 'Beautiful Nezuko cosplay from Demon Slayer',
			imageUrl: '/api/placeholder/800/1200',
			thumbnailUrl: '/api/placeholder/300/400',
			tags: ['demon-slayer', 'nezuko', 'anime'],
			uploadedAt: new Date('2024-01-15'),
			character: 'Nezuko Kamado',
			series: 'Demon Slayer',
			photographer: 'PhotoArtist123'
		},
		{
			id: '2',
			title: 'Sailor Moon Transformation',
			description: 'Classic Sailor Moon cosplay with magical effects',
			imageUrl: '/api/placeholder/800/1200',
			thumbnailUrl: '/api/placeholder/300/400',
			tags: ['sailor-moon', 'magical-girl', 'classic'],
			uploadedAt: new Date('2024-01-10'),
			character: 'Sailor Moon',
			series: 'Sailor Moon',
			photographer: 'MoonlightStudios'
		},
		{
			id: '3',
			title: 'Genshin Impact Ganyu',
			description: 'Elegant Ganyu cosplay with bow and arrows',
			imageUrl: '/api/placeholder/800/1200',
			thumbnailUrl: '/api/placeholder/300/400',
			tags: ['genshin-impact', 'ganyu', 'game'],
			uploadedAt: new Date('2024-01-12'),
			character: 'Ganyu',
			series: 'Genshin Impact',
			photographer: 'GamerCosplay'
		}
	];

	onMount(() => {
		// Load photos from localStorage or API
		const savedPhotos = localStorage.getItem('cosplay-photos');
		if (savedPhotos) {
			photos.set([...JSON.parse(savedPhotos), ...samplePhotos]);
		} else {
			photos.set(samplePhotos);
		}
	});

	function openUploadModal() {
		isUploadModalOpen = true;
	}

	function closeUploadModal() {
		isUploadModalOpen = false;
	}

	function openPhotoModal(photo: CosplayPhoto) {
		selectedPhoto.set(photo);
		isPhotoModalOpen = true;
	}

	function closePhotoModal() {
		selectedPhoto.set(null);
		isPhotoModalOpen = false;
	}

	function handlePhotoUploaded(event: CustomEvent<CosplayPhoto>) {
		const newPhoto = event.detail;
		photos.update(currentPhotos => {
			const updatedPhotos = [newPhoto, ...currentPhotos];
			localStorage.setItem('cosplay-photos', JSON.stringify(updatedPhotos));
			return updatedPhotos;
		});
		closeUploadModal();
	}

	function handleDeletePhoto(event: CustomEvent<CosplayPhoto>) {
		const photoToDelete = event.detail;
		photos.update(currentPhotos => {
			const updatedPhotos = currentPhotos.filter(photo => photo.id !== photoToDelete.id);
			localStorage.setItem('cosplay-photos', JSON.stringify(updatedPhotos));
			return updatedPhotos;
		});
	}

	function handleEditPhoto(event: CustomEvent<CosplayPhoto>) {
		editingPhoto = event.detail;
		isEditModalOpen = true;
	}

	function closeEditModal() {
		isEditModalOpen = false;
		editingPhoto = null;
	}

	function handlePhotoUpdated(event: CustomEvent<CosplayPhoto>) {
		const updatedPhoto = event.detail;
		photos.update(currentPhotos => {
			const updatedPhotos = currentPhotos.map(photo => 
				photo.id === updatedPhoto.id ? updatedPhoto : photo
			);
			localStorage.setItem('cosplay-photos', JSON.stringify(updatedPhotos));
			return updatedPhotos;
		});
		closeEditModal();
	}

	function downloadAllPhotos() {
		photos.subscribe(photoList => {
			photoList.forEach((photo, index) => {
				setTimeout(() => {
					const link = document.createElement('a');
					link.href = photo.imageUrl;
					link.download = `cosplay-${photo.title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
				}, index * 500); // Stagger downloads
			});
		})();
	}

	// Reactive filtered photos
	$: filteredPhotos = $photos.filter(photo => {
		const matchesSearch = searchTerm === '' || 
			photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			photo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
			photo.character?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			photo.series?.toLowerCase().includes(searchTerm.toLowerCase());
		
		const matchesTag = selectedTag === '' || photo.tags.includes(selectedTag);
		
		return matchesSearch && matchesTag;
	});

	// Reactive sorted photos
	$: sortedPhotos = filteredPhotos.sort((a, b) => {
		switch (sortBy) {
			case 'newest':
				return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
			case 'oldest':
				return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
			case 'title':
				return a.title.localeCompare(b.title);
			default:
				return 0;
		}
	});

	// Get all unique tags
	$: allTags = [...new Set($photos.flatMap(photo => photo.tags))].sort();
</script>

<svelte:head>
	<title>Cosplay Gallery - Beautiful Cosplay Photography</title>
	<meta name="description" content="Discover and share amazing cosplay photography. Create your own gallery, browse stunning cosplay photos, and download your favorites." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
	<!-- Header Section -->
	<div class="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white">
		<div class="absolute inset-0 bg-black/20"></div>
		<div class="relative container mx-auto px-4 py-16">
			<div class="text-center">
				<h1 class="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
					Cosplay Gallery
				</h1>
				<p class="text-xl mb-8 max-w-2xl mx-auto text-purple-100">
					Discover amazing cosplay photography, create your own gallery, and share your passion with the community
				</p>
				<div class="flex flex-col sm:flex-row gap-4 justify-center">
					<button 
						on:click={openUploadModal}
						class="btn bg-white text-purple-600 hover:bg-purple-50 border-none px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
					>
						<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
						</svg>
						Upload Photos
					</button>
					<button 
						on:click={downloadAllPhotos}
						class="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300"
					>
						<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
						</svg>
						Download All
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Search and Filter Section -->
	<div class="container mx-auto px-4 py-8">
		<div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
			<div class="flex flex-col lg:flex-row gap-4 items-center">
				<!-- Search Input -->
				<div class="flex-1 relative">
					<svg class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
					</svg>
					<input 
						type="text" 
						placeholder="Search cosplay photos..." 
						bind:value={searchTerm}
						class="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
					/>
				</div>

				<!-- Tag Filter -->
				<div class="relative">
					<select 
						bind:value={selectedTag}
						class="appearance-none bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 pr-8 focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-white"
					>
						<option value="">All Tags</option>
						{#each allTags as tag}
							<option value={tag}>{tag}</option>
						{/each}
					</select>
					<svg class="w-5 h-5 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
					</svg>
				</div>

				<!-- Sort Options -->
				<div class="relative">
					<select 
						bind:value={sortBy}
						class="appearance-none bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 pr-8 focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-white"
					>
						<option value="newest">Newest First</option>
						<option value="oldest">Oldest First</option>
						<option value="title">By Title</option>
					</select>
					<svg class="w-5 h-5 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
					</svg>
				</div>

				<!-- Results Count -->
				<div class="text-gray-600 dark:text-gray-300 font-medium whitespace-nowrap">
					{sortedPhotos.length} photo{sortedPhotos.length !== 1 ? 's' : ''}
				</div>
			</div>
		</div>

		<!-- Photo Grid -->
		<PhotoGrid 
			photos={sortedPhotos} 
			on:photoClick={(e) => openPhotoModal(e.detail)}
		/>

		<!-- Empty State -->
		{#if sortedPhotos.length === 0}
			<div class="text-center py-16">
				<div class="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-800 dark:to-pink-800 rounded-full flex items-center justify-center">
					<svg class="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
					</svg>
				</div>
				<h3 class="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">No photos found</h3>
				<p class="text-gray-500 dark:text-gray-400 mb-6">Try adjusting your search or filter criteria, or upload some photos to get started!</p>
				<button 
					on:click={openUploadModal}
					class="btn bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
				>
					Upload Your First Photo
				</button>
			</div>
		{/if}
	</div>
</div>

<!-- Upload Modal -->
{#if isUploadModalOpen}
	<PhotoUpload 
		on:close={closeUploadModal}
		on:photoUploaded={handlePhotoUploaded}
	/>
{/if}

<!-- Photo Modal -->
{#if isPhotoModalOpen && $selectedPhoto}
	<PhotoModal 
		photo={$selectedPhoto}
		on:close={closePhotoModal}
		on:deletePhoto={handleDeletePhoto}
		on:editPhoto={handleEditPhoto}
	/>
{/if}

<!-- Edit Modal -->
{#if isEditModalOpen && editingPhoto}
	<PhotoUpload 
		photo={editingPhoto}
		isEditing={true}
		on:close={closeEditModal}
		on:photoUploaded={handlePhotoUpdated}
	/>
{/if}