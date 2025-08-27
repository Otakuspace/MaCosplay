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

	<div class="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
		<!-- Animated Background Elements -->
		<div class="fixed inset-0 overflow-hidden pointer-events-none">
			<div class="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
			<div class="absolute top-1/3 right-1/4 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
			<div class="absolute bottom-1/4 left-1/3 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
		</div>

		<!-- Header Section -->
		<div class="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white">
			<div class="absolute inset-0 bg-black/20"></div>
			<!-- Floating Elements -->
			<div class="absolute inset-0 overflow-hidden">
				<div class="absolute top-10 left-10 w-20 h-20 border border-white/20 rounded-full animate-pulse"></div>
				<div class="absolute top-20 right-20 w-16 h-16 border border-white/30 rounded-lg rotate-45 animate-spin-slow"></div>
				<div class="absolute bottom-20 left-20 w-12 h-12 bg-white/10 rounded-full animate-bounce"></div>
			</div>
			<div class="relative container mx-auto px-4 py-20">
				<div class="text-center">
					<div class="mb-6">
						<div class="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full mb-4 animate-pulse">
							<svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
							</svg>
						</div>
					</div>
					<h1 class="text-6xl font-bold mb-4 bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent animate-gradient">
						Cosplay Photo Studio
					</h1>
					<p class="text-xl mb-8 max-w-3xl mx-auto text-purple-100 leading-relaxed">
						Your personal cosplay photo gallery with professional editing tools, custom frames, and AI-powered enhancements. 
						<span class="block mt-2 text-lg font-medium text-white">Create stunning cosplay masterpieces with ease!</span>
					</p>
				<div class="flex items-center justify-center gap-2 mb-6">
					<svg class="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
					</svg>
					<span class="text-green-300 font-medium">100% Private & Local</span>
				</div>
				<div class="flex flex-col sm:flex-row gap-4 justify-center">
					<button 
						on:click={openUploadModal}
						class="btn bg-white text-purple-600 hover:bg-purple-50 border-none px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
					>
						<svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
						</svg>
						Upload & Edit
					</button>
					<button 
						on:click={downloadAllPhotos}
						class="btn bg-gradient-to-r from-pink-500 to-purple-600 text-white border-none px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
					>
						<svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
						</svg>
						Download All
					</button>
				</div>

				<!-- Feature Highlights -->
				<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
					<div class="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center hover:bg-white/20 transition-all duration-300">
						<div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
							<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
							</svg>
						</div>
						<h3 class="font-semibold text-white mb-1">Smart Upload</h3>
						<p class="text-xs text-purple-100">AI-powered tagging</p>
					</div>
					<div class="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center hover:bg-white/20 transition-all duration-300">
						<div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
							<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
							</svg>
						</div>
						<h3 class="font-semibold text-white mb-1">Pro Editing</h3>
						<p class="text-xs text-purple-100">Advanced filters & effects</p>
					</div>
					<div class="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center hover:bg-white/20 transition-all duration-300">
						<div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
							<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
							</svg>
						</div>
						<h3 class="font-semibold text-white mb-1">Custom Frames</h3>
						<p class="text-xs text-purple-100">Cosplay-themed borders</p>
					</div>
					<div class="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center hover:bg-white/20 transition-all duration-300">
						<div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
							<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
							</svg>
						</div>
						<h3 class="font-semibold text-white mb-1">100% Private</h3>
						<p class="text-xs text-purple-100">Local storage only</p>
					</div>
				</div>

				<!-- Privacy & Data Management -->
				<div class="flex flex-wrap gap-3 justify-center mt-6 pt-6 border-t border-white/20">
					<button 
						on:click={exportGalleryData}
						class="btn bg-white/10 border border-white/30 text-white hover:bg-white/20 px-6 py-2 rounded-full font-medium text-sm transition-all duration-300"
					>
						<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
						</svg>
						Export Backup
					</button>
					<button 
						on:click={importGalleryData}
						class="btn bg-white/10 border border-white/30 text-white hover:bg-white/20 px-6 py-2 rounded-full font-medium text-sm transition-all duration-300"
					>
						<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
						</svg>
						Import Backup
					</button>
					<button 
						on:click={clearAllData}
						class="btn bg-red-500/20 border border-red-400/30 text-red-100 hover:bg-red-500/30 px-6 py-2 rounded-full font-medium text-sm transition-all duration-300"
					>
						<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
						</svg>
						Clear All Data
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Search and Filter Section -->
	<div class="container mx-auto px-4 py-8 relative z-10">
		<div class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
			<div class="mb-6">
				<h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
					<svg class="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
					</svg>
					Discover Your Collection
				</h2>
				<p class="text-gray-600 dark:text-gray-300">Find the perfect cosplay photo with advanced search and filtering</p>
			</div>
			
			<div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
				<!-- Search Input -->
				<div class="lg:col-span-5 relative">
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search Photos</label>
					<div class="relative">
						<svg class="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
						</svg>
						<input 
							type="text" 
							placeholder="Search by title, character, series, or description..." 
							bind:value={searchTerm}
							class="w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-300"
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
				</div>

				<!-- Tag Filter -->
				<div class="lg:col-span-3 relative">
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter by Tag</label>
					<div class="relative">
						<select 
							bind:value={selectedTag}
							class="appearance-none w-full bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-2xl px-4 py-4 pr-10 focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-white transition-all duration-300"
						>
							<option value="">All Tags</option>
							{#each allTags as tag}
								<option value={tag}>#{tag}</option>
							{/each}
						</select>
						<svg class="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
						</svg>
					</div>
				</div>

				<!-- Sort Options -->
				<div class="lg:col-span-3 relative">
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort Order</label>
					<div class="relative">
						<select 
							bind:value={sortBy}
							class="appearance-none w-full bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-2xl px-4 py-4 pr-10 focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-white transition-all duration-300"
						>
							<option value="newest">Newest First</option>
							<option value="oldest">Oldest First</option>
							<option value="title">By Title</option>
						</select>
						<svg class="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
						</svg>
					</div>
				</div>

				<!-- Results Count / Batch Toggle -->
				<div class="lg:col-span-1 text-center space-y-2">
					<div class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-4 rounded-2xl font-bold text-lg shadow-lg">
						{sortedPhotos.length}
					</div>
					<div class="text-xs text-gray-500 dark:text-gray-400">
						photo{sortedPhotos.length !== 1 ? 's' : ''}
					</div>
					<button
						on:click={toggleBatchMode}
						class="w-full px-3 py-2 text-xs font-medium rounded-xl transition-all duration-300"
						class:bg-purple-600={batchMode}
						class:text-white={batchMode}
						class:bg-gray-100={!batchMode}
						class:dark:bg-gray-700={!batchMode}
						class:text-gray-700={!batchMode}
						class:dark:text-gray-300={!batchMode}
					>
						{batchMode ? 'Exit Batch' : 'Batch Mode'}
					</button>
				</div>
			</div>

			<!-- Quick Tag Filters -->
			{#if allTags.length > 0}
				<div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
					<h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Quick Filters</h3>
					<div class="flex flex-wrap gap-2">
						<button
							on:click={() => selectedTag = ''}
							class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
							class:bg-purple-600={selectedTag === ''}
							class:text-white={selectedTag === ''}
							class:bg-gray-100={selectedTag !== ''}
							class:dark:bg-gray-700={selectedTag !== ''}
							class:text-gray-700={selectedTag !== ''}
							class:dark:text-gray-300={selectedTag !== ''}
							class:hover:bg-purple-100={selectedTag !== ''}
							class:dark:hover:bg-gray-600={selectedTag !== ''}
						>
							All ({$photos.length})
						</button>
						{#each allTags.slice(0, 8) as tag}
							<button
								on:click={() => selectedTag = tag}
								class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
								class:bg-purple-600={selectedTag === tag}
								class:text-white={selectedTag === tag}
								class:bg-gray-100={selectedTag !== tag}
								class:dark:bg-gray-700={selectedTag !== tag}
								class:text-gray-700={selectedTag !== tag}
								class:dark:text-gray-300={selectedTag !== tag}
								class:hover:bg-purple-100={selectedTag !== tag}
								class:dark:hover:bg-gray-600={selectedTag !== tag}
							>
								#{tag} ({$photos.filter(p => p.tags.includes(tag)).length})
							</button>
						{/each}
						{#if allTags.length > 8}
							<span class="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
								+{allTags.length - 8} more tags
							</span>
						{/if}
					</div>
				</div>
			{/if}

			<!-- Batch Operations Toolbar -->
			{#if batchMode}
				<div class="mt-6 p-6 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-2xl border border-purple-200 dark:border-purple-700">
					<div class="flex flex-col sm:flex-row items-center justify-between gap-4">
						<div class="flex items-center space-x-4">
							<div class="flex items-center space-x-2">
								<svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
								</svg>
								<span class="font-semibold text-purple-800 dark:text-purple-200">
									{selectedPhotos.size} photo{selectedPhotos.size !== 1 ? 's' : ''} selected
								</span>
							</div>
							<div class="flex space-x-2">
								<button
									on:click={selectAllPhotos}
									class="px-3 py-1 text-sm bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded-lg hover:bg-purple-300 dark:hover:bg-purple-700 transition-colors"
								>
									Select All ({sortedPhotos.length})
								</button>
								<button
									on:click={clearSelection}
									class="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
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
									class="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
								>
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
									</svg>
									<span>Download</span>
								</button>
								<button
									on:click={addTagsToSelected}
									class="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
								>
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
									</svg>
									<span>Add Tags</span>
								</button>
								<button
									on:click={deleteSelectedPhotos}
									class="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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

		<!-- Photo Grid -->
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
	@keyframes blob {
		0% { transform: translate(0px, 0px) scale(1); }
		33% { transform: translate(30px, -50px) scale(1.1); }
		66% { transform: translate(-20px, 20px) scale(0.9); }
		100% { transform: translate(0px, 0px) scale(1); }
	}

	@keyframes gradient {
		0%, 100% { background-position: 0% 50%; }
		50% { background-position: 100% 50%; }
	}

	@keyframes spin-slow {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}

	:global(.animate-blob) {
		animation: blob 7s infinite;
	}

	:global(.animation-delay-2000) {
		animation-delay: 2s;
	}

	:global(.animation-delay-4000) {
		animation-delay: 4s;
	}

	:global(.animate-gradient) {
		background-size: 400% 400%;
		animation: gradient 6s ease infinite;
	}

	:global(.animate-spin-slow) {
		animation: spin-slow 20s linear infinite;
	}

	/* Glassmorphism effect */
	:global(.backdrop-blur-xl) {
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
	}

	/* Enhanced hover effects */
	:global(.hover-lift) {
		transition: transform 0.3s ease, box-shadow 0.3s ease;
	}

	:global(.hover-lift:hover) {
		transform: translateY(-5px);
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
	}

	/* Smooth scrollbar */
	:global(::-webkit-scrollbar) {
		width: 8px;
	}

	:global(::-webkit-scrollbar-track) {
		background: rgba(0, 0, 0, 0.1);
		border-radius: 10px;
	}

	:global(::-webkit-scrollbar-thumb) {
		background: linear-gradient(45deg, #8b5cf6, #ec4899);
		border-radius: 10px;
	}

	:global(::-webkit-scrollbar-thumb:hover) {
		background: linear-gradient(45deg, #7c3aed, #db2777);
	}
</style>