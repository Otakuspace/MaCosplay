<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { CreateFeatureRequestData } from '../../../types/brainstorm';
	import { t, getNestedTranslation } from '../../../lib/i18n';

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
			errors.title = t('titleRequired');
		}
		
		if (!formData.description.trim()) {
			errors.description = t('descriptionRequired');
		}
		
		if (!formData.author.trim()) {
			errors.author = t('authorRequired');
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
			<span class="label-text font-semibold">{t('title')} {t('required')}</span>
		</label>
		<input 
			id="title"
			type="text" 
			placeholder={t('titlePlaceholder')}
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
			<span class="label-text font-semibold">{t('description')} {t('required')}</span>
		</label>
		<textarea 
			id="description"
			class="textarea textarea-bordered h-24 {errors.description ? 'textarea-error' : ''}"
			placeholder={t('descriptionPlaceholder')}
			bind:value={formData.description}
			maxlength="1000"
		></textarea>
		{#if errors.description}
			<label class="label">
				<span class="label-text-alt text-error">{errors.description}</span>
			</label>
		{/if}
		<label class="label">
			<span class="label-text-alt">{formData.description.length}/1000 {t('charactersCount')}</span>
		</label>
	</div>

	<!-- Category and Priority Row -->
	<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
		<!-- Category -->
		<div class="form-control">
			<label class="label" for="category">
				<span class="label-text font-semibold">{t('category')}</span>
			</label>
			<select 
				id="category"
				class="select select-bordered w-full"
				bind:value={formData.category}
			>
				<option value="ui">{getNestedTranslation('categoryIcons', 'ui')} {t('ui')}</option>
				<option value="feature">{getNestedTranslation('categoryIcons', 'feature')} {t('feature')}</option>
				<option value="improvement">{getNestedTranslation('categoryIcons', 'improvement')} {t('improvement')}</option>
				<option value="bug">{getNestedTranslation('categoryIcons', 'bug')} {t('bug')}</option>
				<option value="other">{getNestedTranslation('categoryIcons', 'other')} {t('other')}</option>
			</select>
		</div>

		<!-- Priority -->
		<div class="form-control">
			<label class="label" for="priority">
				<span class="label-text font-semibold">{t('priority')}</span>
			</label>
			<select 
				id="priority"
				class="select select-bordered w-full"
				bind:value={formData.priority}
			>
				<option value="low">{getNestedTranslation('priorityIcons', 'low')} {t('low')}</option>
				<option value="medium">{getNestedTranslation('priorityIcons', 'medium')} {t('medium')}</option>
				<option value="high">{getNestedTranslation('priorityIcons', 'high')} {t('high')}</option>
				<option value="critical">{getNestedTranslation('priorityIcons', 'critical')} {t('critical')}</option>
			</select>
		</div>
	</div>

	<!-- Author -->
	<div class="form-control">
		<label class="label" for="author">
			<span class="label-text font-semibold">{t('author')} {t('required')}</span>
		</label>
		<input 
			id="author"
			type="text" 
			placeholder={t('authorPlaceholder')}
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
			<span class="label-text font-semibold">{t('tags')}</span>
		</label>
		<div class="flex gap-2">
			<input 
				id="tag-input"
				type="text" 
				placeholder={t('tagsPlaceholder')}
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
				{t('add')}
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
			<span class="label-text-alt">{t('tagsHelp')}</span>
		</label>
	</div>

	<!-- Action Buttons -->
	<div class="modal-action">
		<button type="button" class="btn btn-ghost" onclick={handleCancel}>
			{t('cancel')}
		</button>
		<button type="submit" class="btn btn-primary">
			{t('submitFeatureRequest')}
		</button>
	</div>
</form>