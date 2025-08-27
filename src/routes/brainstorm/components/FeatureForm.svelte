<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { CreateFeatureRequestData } from '../../../types/brainstorm';

	const dispatch = createEventDispatcher();

	let formData: CreateFeatureRequestData = $state({
		title: '',
		description: '',
		category: 'feature',
		priority: 'medium',
		author: '',
		tags: []
	});

	let tagInput = $state('');
	let errors = $state<Record<string, string>>({});

	function addTag() {
		if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
			formData.tags = [...formData.tags, tagInput.trim()];
			tagInput = '';
		}
	}

	function removeTag(tagToRemove: string) {
		formData.tags = formData.tags.filter(tag => tag !== tagToRemove);
	}

	function handleTagKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault();
			addTag();
		}
	}

	function validateForm(): boolean {
		errors = {};
		
		if (!formData.title.trim()) {
			errors.title = 'Title is required';
		}
		
		if (!formData.description.trim()) {
			errors.description = 'Description is required';
		}
		
		if (!formData.author.trim()) {
			errors.author = 'Author name is required';
		}

		return Object.keys(errors).length === 0;
	}

	function handleSubmit() {
		if (validateForm()) {
			dispatch('submit', formData);
			// Reset form
			formData = {
				title: '',
				description: '',
				category: 'feature',
				priority: 'medium',
				author: '',
				tags: []
			};
		}
	}

	function handleCancel() {
		dispatch('cancel');
	}
</script>

<form onsubmit={(e) => { e.preventDefault(); handleSubmit(e); }} class="space-y-4">
	<!-- Title -->
	<div class="form-control">
		<label class="label" for="title">
			<span class="label-text font-semibold">Title *</span>
		</label>
		<input 
			id="title"
			type="text" 
			placeholder="Brief, descriptive title for your feature request"
			class="input input-bordered w-full {errors.title ? 'input-error' : ''}"
			bind:value={formData.title}
			maxlength="100"
		/>
		{#if errors.title}
			<label class="label">
				<span class="label-text-alt text-error">{errors.title}</span>
			</label>
		{/if}
	</div>

	<!-- Description -->
	<div class="form-control">
		<label class="label" for="description">
			<span class="label-text font-semibold">Description *</span>
		</label>
		<textarea 
			id="description"
			class="textarea textarea-bordered h-24 {errors.description ? 'textarea-error' : ''}"
			placeholder="Provide detailed information about your feature request..."
			bind:value={formData.description}
			maxlength="1000"
		></textarea>
		{#if errors.description}
			<label class="label">
				<span class="label-text-alt text-error">{errors.description}</span>
			</label>
		{/if}
		<label class="label">
			<span class="label-text-alt">{formData.description.length}/1000 characters</span>
		</label>
	</div>

	<!-- Category and Priority Row -->
	<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
		<!-- Category -->
		<div class="form-control">
			<label class="label" for="category">
				<span class="label-text font-semibold">Category</span>
			</label>
			<select 
				id="category"
				class="select select-bordered w-full"
				bind:value={formData.category}
			>
				<option value="ui">🎨 UI/Design</option>
				<option value="feature">✨ New Feature</option>
				<option value="improvement">📈 Improvement</option>
				<option value="bug">🐛 Bug Fix</option>
				<option value="other">💡 Other</option>
			</select>
		</div>

		<!-- Priority -->
		<div class="form-control">
			<label class="label" for="priority">
				<span class="label-text font-semibold">Priority</span>
			</label>
			<select 
				id="priority"
				class="select select-bordered w-full"
				bind:value={formData.priority}
			>
				<option value="low">🟢 Low</option>
				<option value="medium">🟡 Medium</option>
				<option value="high">🟠 High</option>
				<option value="critical">🔴 Critical</option>
			</select>
		</div>
	</div>

	<!-- Author -->
	<div class="form-control">
		<label class="label" for="author">
			<span class="label-text font-semibold">Your Name *</span>
		</label>
		<input 
			id="author"
			type="text" 
			placeholder="Enter your name or username"
			class="input input-bordered w-full {errors.author ? 'input-error' : ''}"
			bind:value={formData.author}
			maxlength="50"
		/>
		{#if errors.author}
			<label class="label">
				<span class="label-text-alt text-error">{errors.author}</span>
			</label>
		{/if}
	</div>

	<!-- Tags -->
	<div class="form-control">
		<label class="label" for="tag-input">
			<span class="label-text font-semibold">Tags</span>
		</label>
		<div class="flex gap-2">
			<input 
				id="tag-input"
				type="text" 
				placeholder="Add tags (press Enter)"
				class="input input-bordered flex-1"
				bind:value={tagInput}
				onkeydown={handleTagKeydown}
				maxlength="20"
			/>
			<button 
				type="button" 
				class="btn btn-outline"
				onclick={addTag}
				disabled={!tagInput.trim()}
			>
				Add
			</button>
		</div>
		{#if formData.tags.length > 0}
			<div class="flex flex-wrap gap-2 mt-2">
				{#each formData.tags as tag}
					<div class="badge badge-outline gap-2">
						{tag}
						<button 
							type="button" 
							class="btn btn-ghost btn-xs p-0 h-auto min-h-0"
							onclick={() => removeTag(tag)}
						>
							✕
						</button>
					</div>
				{/each}
			</div>
		{/if}
		<label class="label">
			<span class="label-text-alt">Tags help categorize and filter feature requests</span>
		</label>
	</div>

	<!-- Action Buttons -->
	<div class="modal-action">
		<button type="button" class="btn btn-ghost" onclick={handleCancel}>
			Cancel
		</button>
		<button type="submit" class="btn btn-primary">
			Submit Feature Request
		</button>
	</div>
</form>