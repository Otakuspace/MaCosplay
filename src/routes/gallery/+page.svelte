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
	let batchMode = false;
	let selectedPhotos = new Set<string>();

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

	function exportGalleryData() {
		photos.subscribe(photoList => {
			const galleryData = {
				version: '1.0',
				exportDate: new Date().toISOString(),
				photos: photoList,
				totalPhotos: photoList.length
			};
			
			const dataStr = JSON.stringify(galleryData, null, 2);
			const dataBlob = new Blob([dataStr], { type: 'application/json' });
			
			const link = document.createElement('a');
			link.href = URL.createObjectURL(dataBlob);
			link.download = `cosplay-gallery-backup-${new Date().toISOString().split('T')[0]}.json`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		})();
	}

	function importGalleryData() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.json';
		
		input.onchange = (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (!file) return;
			
			const reader = new FileReader();
			reader.onload = (event) => {
				try {
					const data = JSON.parse(event.target?.result as string);
					if (data.photos && Array.isArray(data.photos)) {
						const confirmImport = confirm(
							`This will import ${data.photos.length} photos. Current photos will be merged with imported ones. Continue?`
						);
						
						if (confirmImport) {
							photos.update(currentPhotos => {
								const mergedPhotos = [...currentPhotos, ...data.photos];
								localStorage.setItem('cosplay-photos', JSON.stringify(mergedPhotos));
								return mergedPhotos;
							});
							alert(`Successfully imported ${data.photos.length} photos!`);
						}
					} else {
						alert('Invalid gallery backup file format.');
					}
				} catch (error) {
					console.error('Import error:', error);
					alert('Failed to import gallery data. Please check the file format.');
				}
			};
			reader.readAsText(file);
		};
		
		input.click();
	}

	function clearAllData() {
		const confirm = window.confirm(
			'Are you sure you want to clear all photos? This action cannot be undone.\n\nConsider exporting your gallery first as a backup.'
		);
		
		if (confirm) {
			const doubleConfirm = window.confirm(
				'This will permanently delete all your photos and data. Are you absolutely sure?'
			);
			
			if (doubleConfirm) {
				localStorage.removeItem('cosplay-photos');
				photos.set([]);
				alert('All gallery data has been cleared.');
			}
		}
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

	// Batch operations
	function toggleBatchMode() {
		batchMode = !batchMode;
		if (!batchMode) {
			selectedPhotos.clear();
			selectedPhotos = new Set(selectedPhotos);
		}
	}

	function selectAllPhotos() {
		selectedPhotos = new Set(sortedPhotos.map(photo => photo.id));
	}

	function clearSelection() {
		selectedPhotos.clear();
		selectedPhotos = new Set(selectedPhotos);
	}

	function handleSelectionChanged(event: CustomEvent<Set<string>>) {
		selectedPhotos = event.detail;
	}

	function downloadSelectedPhotos() {
		const selectedPhotosList = $photos.filter(photo => selectedPhotos.has(photo.id));
		selectedPhotosList.forEach((photo, index) => {
			setTimeout(() => {
				const link = document.createElement('a');
				link.href = photo.imageUrl;
				link.download = `cosplay-${photo.title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			}, index * 500);
		});
	}

	function deleteSelectedPhotos() {
		const selectedCount = selectedPhotos.size;
		const confirmDelete = confirm(
			`Are you sure you want to delete ${selectedCount} selected photo${selectedCount !== 1 ? 's' : ''}? This action cannot be undone.`
		);
		
		if (confirmDelete) {
			photos.update(currentPhotos => {
				const updatedPhotos = currentPhotos.filter(photo => !selectedPhotos.has(photo.id));
				localStorage.setItem('cosplay-photos', JSON.stringify(updatedPhotos));
				return updatedPhotos;
			});
			clearSelection();
			alert(`${selectedCount} photo${selectedCount !== 1 ? 's' : ''} deleted successfully.`);
		}
	}

	function addTagsToSelected() {
		const newTags = prompt('Enter tags to add (separated by commas):');
		if (!newTags) return;
		
		const tagsToAdd = newTags.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag);
		
		photos.update(currentPhotos => {
			const updatedPhotos = currentPhotos.map(photo => {
				if (selectedPhotos.has(photo.id)) {
					return {
						...photo,
						tags: [...new Set([...photo.tags, ...tagsToAdd])]
					};
				}
				return photo;
			});
			localStorage.setItem('cosplay-photos', JSON.stringify(updatedPhotos));
			return updatedPhotos;
		});
		
		alert(`Tags added to ${selectedPhotos.size} photo${selectedPhotos.size !== 1 ? 's' : ''}.`);
	}
</script>

<svelte:head>
	<title>Cosplay Photo Studio - Professional Photo Editor & Gallery</title>
	<meta name="description" content="Professional cosplay photo editing studio with advanced filters, custom frames, batch operations, and AI-powered tools. Create stunning cosplay masterpieces with complete privacy - all data stays local on your device." />
	<meta name="keywords" content="cosplay, photo editor, gallery, filters, frames, batch editing, anime, photography, private, local storage" />
</svelte:head>

<!-- Hero Section -->
<section class="hero-gradient min-h-[50vh] md:min-h-[70vh] flex items-center justify-center relative overflow-hidden">
	<div class="absolute inset-0 bg-black opacity-20"></div>
	<!-- Floating elements for visual interest -->
	<div class="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
	<div class="absolute bottom-20 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
	<div class="absolute top-1/2 left-1/4 w-16 h-16 bg-white/15 rounded-full blur-lg animate-pulse delay-500"></div>
	
	<div class="container mx-auto px-4 md:px-6 relative z-10 text-center text-white">
		<div class="mb-6">
			<div class="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full mb-4 animate-pulse">
				<svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
				</svg>
			</div>
		</div>
		<h1 class="text-3xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 animate-fade-in">
			🎭 Cosplay Gallery
		</h1>
		<p class="text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 opacity-90 animate-slide-up max-w-3xl mx-auto px-4">
			Your personal cosplay photo gallery with professional editing tools and AI-powered enhancements
		</p>
		<div class="flex items-center justify-center gap-2 mb-6">
			<svg class="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
			</svg>
			<span class="text-green-300 font-medium">100% Private & Local</span>
		</div>
		
		<div class="flex flex-col sm:flex-row gap-4 justify-center mb-8">
			<button 
				on:click={openUploadModal}
				class="btn-primary-modern"
			>
				<svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
				</svg>
				Upload & Edit
			</button>
			<button 
				on:click={downloadAllPhotos}
				class="btn-secondary-modern"
			>
				<svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
				</svg>
				Download All
			</button>
		</div>
	</div>
</section>

<!-- Feature Highlights Section -->
<section class="bg-white shadow-soft border-b border-gray-100">
	<div class="container mx-auto px-4 md:px-6 py-6 md:py-8">
		<div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto">
			<div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 md:p-6 text-center hover:shadow-medium transition-all duration-300 card-hover">
				<div class="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
					<svg class="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
					</svg>
				</div>
				<h3 class="font-semibold text-sm md:text-base text-gray-800 mb-1">Smart Upload</h3>
				<p class="text-xs md:text-sm text-gray-600">AI-powered tagging</p>
			</div>
			<div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 md:p-6 text-center hover:shadow-medium transition-all duration-300 card-hover">
				<div class="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
					<svg class="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
					</svg>
				</div>
				<h3 class="font-semibold text-sm md:text-base text-gray-800 mb-1">Pro Editing</h3>
				<p class="text-xs md:text-sm text-gray-600">Advanced filters & effects</p>
			</div>
			<div class="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-4 md:p-6 text-center hover:shadow-medium transition-all duration-300 card-hover">
				<div class="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
					<svg class="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
					</svg>
				</div>
				<h3 class="font-semibold text-sm md:text-base text-gray-800 mb-1">Custom Frames</h3>
				<p class="text-xs md:text-sm text-gray-600">Cosplay-themed borders</p>
			</div>
			<div class="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 md:p-6 text-center hover:shadow-medium transition-all duration-300 card-hover">
				<div class="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
					<svg class="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
					</svg>
				</div>
				<h3 class="font-semibold text-sm md:text-base text-gray-800 mb-1">100% Private</h3>
				<p class="text-xs md:text-sm text-gray-600">Local storage only</p>
			</div>
		</div>
		
		<!-- Privacy & Data Management -->
		<div class="flex flex-wrap gap-3 justify-center mt-6 pt-6 border-t border-gray-200">
			<button 
				on:click={exportGalleryData}
				class="btn-secondary-modern text-sm"
			>
				<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
				</svg>
				Export Backup
			</button>
			<button 
				on:click={importGalleryData}
				class="btn-secondary-modern text-sm"
			>
				<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
				</svg>
				Import Backup
			</button>
			<button 
				on:click={clearAllData}
				class="bg-red-100 text-red-600 hover:bg-red-200 font-medium px-6 py-3 rounded-xl transition-all duration-300 border border-red-200 hover:border-red-300 shadow-sm hover:shadow-md text-sm"
			>
				<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
				</svg>
				Clear All Data
			</button>
		</div>
	</div>
</section>

<!-- Search and Filter Section -->
<section class="bg-white shadow-soft border-b border-gray-100 sticky top-16 z-40">
	<div class="container mx-auto px-4 md:px-6 py-6 md:py-8">
		<div class="mb-4 md:mb-6">
			<h2 class="text-xl md:text-2xl font-bold text-gray-900 mb-2 flex items-center">
				<svg class="w-5 h-5 md:w-6 md:h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
				</svg>
				Discover Your Collection
			</h2>
			<p class="text-sm md:text-base text-gray-600">Find the perfect cosplay photo with advanced search and filtering</p>
		</div>
			
		<div class="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
			<div class="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 flex-1 w-full">
				<!-- Search Input -->
				<div class="relative flex-1 w-full sm:min-w-[250px] md:min-w-[300px]">
					<svg class="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
					</svg>
					<input 
						type="text" 
						placeholder="Search by title, character, series, or description..." 
						bind:value={searchTerm}
						class="input-modern w-full pl-12 pr-4 py-4"
					/>
					{#if searchTerm}
						<button 
							on:click={() => searchTerm = ''}
							class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
						>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
							</svg>
						</button>
					{/if}
				</div>

				<!-- Tag Filter -->
				<div class="relative min-w-[200px]">
					<select 
						bind:value={selectedTag}
						class="select-modern"
					>
						<option value="">All Tags</option>
						{#each allTags as tag}
							<option value={tag}>#{tag}</option>
						{/each}
					</select>
				</div>

				<!-- Sort Options -->
				<div class="relative min-w-[180px]">
					<select 
						bind:value={sortBy}
						class="select-modern"
					>
						<option value="newest">Newest First</option>
						<option value="oldest">Oldest First</option>
						<option value="title">By Title</option>
					</select>
				</div>
			</div>

			<!-- Results Count / Batch Toggle -->
			<div class="text-center space-y-2">
				<div class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg">
					{sortedPhotos.length}
				</div>
				<div class="text-xs text-gray-500">
					photo{sortedPhotos.length !== 1 ? 's' : ''}
				</div>
				<button
					on:click={toggleBatchMode}
					class="px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300"
					class:btn-primary-modern={batchMode}
					class:btn-secondary-modern={!batchMode}
				>
					{batchMode ? 'Exit Batch' : 'Batch Mode'}
				</button>
			</div>
		</div>

		<!-- Quick Tag Filters -->
		{#if allTags.length > 0}
			<div class="mt-6 pt-6 border-t border-gray-200">
				<h3 class="text-sm font-medium text-gray-700 mb-3">Quick Filters</h3>
				<div class="flex flex-wrap gap-2">
					<button
						on:click={() => selectedTag = ''}
						class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
						class:btn-primary-modern={selectedTag === ''}
						class:btn-secondary-modern={selectedTag !== ''}
					>
						All ({$photos.length})
					</button>
					{#each allTags.slice(0, 8) as tag}
						<button
							on:click={() => selectedTag = tag}
							class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
							class:btn-primary-modern={selectedTag === tag}
							class:btn-secondary-modern={selectedTag !== tag}
						>
							#{tag} ({$photos.filter(p => p.tags.includes(tag)).length})
						</button>
					{/each}
					{#if allTags.length > 8}
						<span class="px-4 py-2 text-sm text-gray-500">
							+{allTags.length - 8} more tags
						</span>
					{/if}
				</div>
			</div>
		{/if}

		<!-- Batch Operations Toolbar -->
		{#if batchMode}
			<div class="mt-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200 shadow-soft">
				<div class="flex flex-col sm:flex-row items-center justify-between gap-4">
					<div class="flex items-center space-x-4">
						<div class="flex items-center space-x-2">
							<svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
							</svg>
							<span class="font-semibold text-purple-800">
								{selectedPhotos.size} photo{selectedPhotos.size !== 1 ? 's' : ''} selected
							</span>
						</div>
						<div class="flex space-x-2">
							<button
								on:click={selectAllPhotos}
								class="btn-secondary-modern text-sm py-2"
							>
								Select All ({sortedPhotos.length})
							</button>
							<button
								on:click={clearSelection}
								class="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
								disabled={selectedPhotos.size === 0}
							>
								Clear
							</button>
						</div>
					</div>

					{#if selectedPhotos.size > 0}
						<div class="flex flex-wrap gap-2">
							<button
								on:click={downloadSelectedPhotos}
								class="btn-primary-modern text-sm py-2"
							>
								<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
								</svg>
								Download
							</button>
							<button
								on:click={addTagsToSelected}
								class="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-300 font-medium shadow-sm hover:shadow-md text-sm"
							>
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
								</svg>
								<span>Add Tags</span>
							</button>
							<button
								on:click={deleteSelectedPhotos}
								class="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 font-medium shadow-sm hover:shadow-md text-sm"
							>
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
								</svg>
								<span>Delete</span>
							</button>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</section>

<!-- Photo Grid -->
<div class="container mx-auto px-6 py-8">
	<PhotoGrid 
		photos={sortedPhotos}
		{batchMode}
		{selectedPhotos}
		on:photoClick={(e) => openPhotoModal(e.detail)}
		on:selectionChanged={handleSelectionChanged}
	/>

	<!-- Empty State -->
	{#if sortedPhotos.length === 0}
		<div class="text-center py-16">
			<div class="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center shadow-soft">
				<svg class="w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
				</svg>
			</div>
			<h3 class="text-2xl font-bold text-gray-800 mb-2">No photos found</h3>
			<p class="text-gray-600 mb-6 max-w-md mx-auto">Try adjusting your search or filter criteria, or upload some photos to get started!</p>
			<button 
				on:click={openUploadModal}
				class="btn-primary-modern"
			>
				Upload Your First Photo
			</button>
		</div>
	{/if}
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
		on:photoUploaded={handlePhotoUploaded}
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

<style>
	/* Custom animations for the gallery */
	@keyframes fade-in {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}

	@keyframes slide-up {
		from { opacity: 0; transform: translateY(30px); }
		to { opacity: 1; transform: translateY(0); }
	}

	:global(.animate-fade-in) {
		animation: fade-in 0.6s ease-out;
	}

	:global(.animate-slide-up) {
		animation: slide-up 0.8s ease-out 0.2s both;
	}

	/* Enhanced shadow utilities */
	:global(.shadow-soft) {
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
	}

	:global(.shadow-medium) {
		box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
	}

	:global(.shadow-large) {
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
	}
</style>