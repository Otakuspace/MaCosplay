<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	
	// Sample course data for enrollment
	const courses = {
		'basic-cosplay-makeup': {
			title: 'Basic Cosplay Makeup Fundamentals',
			instructor: 'Akira Tanaka',
			price: 2500,
			originalPrice: 3500,
			duration: '4 weeks',
			level: 'Beginner'
		},
		'advanced-character-transformation': {
			title: 'Advanced Character Transformation',
			instructor: 'Yuki Sato',
			price: 4800,
			originalPrice: 6000,
			duration: '8 weeks',
			level: 'Advanced'
		},
		'anime-manga-makeup': {
			title: 'Anime & Manga Makeup Mastery',
			instructor: 'Rei Nakamura',
			price: 3500,
			originalPrice: 4200,
			duration: '6 weeks',
			level: 'Intermediate'
		},
		'horror-gothic-makeup': {
			title: 'Horror & Gothic Cosplay Makeup',
			instructor: 'Kuro Yamada',
			price: 3200,
			originalPrice: 4000,
			duration: '5 weeks',
			level: 'Intermediate'
		}
	};

	let selectedCourse = '';
	let currentStep = 1;
	let paymentMethod = 'credit-card';
	let enrollmentData = {
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		experience: 'beginner',
		goals: '',
		agreeTerms: false,
		newsletter: true
	};

	let paymentData = {
		cardNumber: '',
		expiryDate: '',
		cvv: '',
		cardholderName: '',
		billingAddress: {
			address: '',
			city: '',
			postalCode: '',
			country: 'Thailand'
		}
	};

	// Get course from URL params
	$: {
		const urlParams = new URLSearchParams($page.url.search);
		const courseParam = urlParams.get('course');
		if (courseParam && courses[courseParam]) {
			selectedCourse = courseParam;
		}
	}

	$: course = courses[selectedCourse];

	function nextStep() {
		if (currentStep < 3) {
			currentStep++;
		}
	}

	function prevStep() {
		if (currentStep > 1) {
			currentStep--;
		}
	}

	function handleEnrollment() {
		// In production, this would process the payment and enrollment
		alert('Enrollment successful! You will receive a confirmation email shortly.');
	}

	function validateStep1() {
		return enrollmentData.firstName && 
			   enrollmentData.lastName && 
			   enrollmentData.email && 
			   enrollmentData.phone && 
			   enrollmentData.agreeTerms &&
			   selectedCourse;
	}

	function validateStep2() {
		if (paymentMethod === 'credit-card') {
			return paymentData.cardNumber && 
				   paymentData.expiryDate && 
				   paymentData.cvv && 
				   paymentData.cardholderName;
		}
		return true; // For bank transfer, no validation needed here
	}
</script>

<svelte:head>
	<title>Enroll in Course - MaCosplay</title>
	<meta name="description" content="Enroll in our professional cosplay makeup courses and start your transformation journey today." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
	<!-- Header -->
	<section class="bg-white border-b border-gray-200">
		<div class="container mx-auto px-6 py-8">
			<div class="flex items-center gap-2 text-sm text-gray-600 mb-4">
				<a href="/courses" class="hover:text-purple-600">Courses</a>
				<span>›</span>
				<span class="text-purple-600">Enrollment</span>
			</div>
			<h1 class="text-4xl font-bold text-gray-900 mb-2">Course Enrollment</h1>
			<p class="text-xl text-gray-600">Complete your enrollment in just a few simple steps</p>
		</div>
	</section>

	<!-- Progress Steps -->
	<section class="bg-white border-b border-gray-200">
		<div class="container mx-auto px-6 py-6">
			<div class="flex items-center justify-center">
				<div class="flex items-center space-x-8">
					<div class="flex items-center">
						<div class="w-8 h-8 rounded-full {currentStep >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'} flex items-center justify-center font-semibold">
							{currentStep > 1 ? '✓' : '1'}
						</div>
						<span class="ml-2 {currentStep >= 1 ? 'text-purple-600' : 'text-gray-600'} font-medium">Course & Details</span>
					</div>
					<div class="w-16 h-0.5 {currentStep >= 2 ? 'bg-purple-600' : 'bg-gray-200'}"></div>
					<div class="flex items-center">
						<div class="w-8 h-8 rounded-full {currentStep >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'} flex items-center justify-center font-semibold">
							{currentStep > 2 ? '✓' : '2'}
						</div>
						<span class="ml-2 {currentStep >= 2 ? 'text-purple-600' : 'text-gray-600'} font-medium">Payment</span>
					</div>
					<div class="w-16 h-0.5 {currentStep >= 3 ? 'bg-purple-600' : 'bg-gray-200'}"></div>
					<div class="flex items-center">
						<div class="w-8 h-8 rounded-full {currentStep >= 3 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'} flex items-center justify-center font-semibold">
							{currentStep > 3 ? '✓' : '3'}
						</div>
						<span class="ml-2 {currentStep >= 3 ? 'text-purple-600' : 'text-gray-600'} font-medium">Confirmation</span>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Main Content -->
	<section class="py-8">
		<div class="container mx-auto px-6">
			<div class="grid lg:grid-cols-3 gap-8">
				<!-- Main Form -->
				<div class="lg:col-span-2">
					<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
						{#if currentStep === 1}
							<!-- Step 1: Course Selection and Personal Details -->
							<h2 class="text-2xl font-bold mb-6">Select Course & Personal Information</h2>
							
							<!-- Course Selection -->
							<div class="mb-8">
								<label class="label">
									<span class="label-text text-lg font-semibold">Choose Your Course</span>
								</label>
								<select bind:value={selectedCourse} class="select select-bordered w-full bg-white">
									<option value="">Select a course</option>
									{#each Object.entries(courses) as [slug, courseInfo]}
										<option value={slug}>{courseInfo.title} - ฿{courseInfo.price.toLocaleString()}</option>
									{/each}
								</select>
							</div>

							<!-- Personal Information -->
							<div class="grid md:grid-cols-2 gap-6 mb-6">
								<div class="form-control">
									<label class="label">
										<span class="label-text font-semibold">First Name *</span>
									</label>
									<input type="text" bind:value={enrollmentData.firstName} class="input input-bordered bg-white" required />
								</div>
								<div class="form-control">
									<label class="label">
										<span class="label-text font-semibold">Last Name *</span>
									</label>
									<input type="text" bind:value={enrollmentData.lastName} class="input input-bordered bg-white" required />
								</div>
							</div>

							<div class="grid md:grid-cols-2 gap-6 mb-6">
								<div class="form-control">
									<label class="label">
										<span class="label-text font-semibold">Email Address *</span>
									</label>
									<input type="email" bind:value={enrollmentData.email} class="input input-bordered bg-white" required />
								</div>
								<div class="form-control">
									<label class="label">
										<span class="label-text font-semibold">Phone Number *</span>
									</label>
									<input type="tel" bind:value={enrollmentData.phone} class="input input-bordered bg-white" required />
								</div>
							</div>

							<div class="form-control mb-6">
								<label class="label">
									<span class="label-text font-semibold">Experience Level</span>
								</label>
								<select bind:value={enrollmentData.experience} class="select select-bordered bg-white">
									<option value="beginner">Complete Beginner</option>
									<option value="some-experience">Some Experience</option>
									<option value="intermediate">Intermediate</option>
									<option value="advanced">Advanced</option>
								</select>
							</div>

							<div class="form-control mb-6">
								<label class="label">
									<span class="label-text font-semibold">What are your goals for this course?</span>
								</label>
								<textarea bind:value={enrollmentData.goals} class="textarea textarea-bordered bg-white h-24" placeholder="Tell us what you hope to achieve..."></textarea>
							</div>

							<!-- Terms and Newsletter -->
							<div class="space-y-4 mb-8">
								<div class="form-control">
									<label class="cursor-pointer flex items-start gap-3">
										<input type="checkbox" bind:checked={enrollmentData.agreeTerms} class="checkbox checkbox-primary mt-1" required />
										<span class="label-text">
											I agree to the <a href="/terms" class="text-purple-600 hover:underline">Terms of Service</a> and <a href="/privacy-policy" class="text-purple-600 hover:underline">Privacy Policy</a> *
										</span>
									</label>
								</div>
								<div class="form-control">
									<label class="cursor-pointer flex items-start gap-3">
										<input type="checkbox" bind:checked={enrollmentData.newsletter} class="checkbox checkbox-primary mt-1" />
										<span class="label-text">
											Subscribe to our newsletter for updates and special offers
										</span>
									</label>
								</div>
							</div>

							<div class="flex justify-end">
								<button 
									class="btn btn-primary bg-gradient-to-r from-purple-600 to-pink-600 border-none px-8"
									disabled={!validateStep1()}
									on:click={nextStep}
								>
									Continue to Payment
								</button>
							</div>

						{:else if currentStep === 2}
							<!-- Step 2: Payment Information -->
							<h2 class="text-2xl font-bold mb-6">Payment Information</h2>
							
							<!-- Payment Method Selection -->
							<div class="mb-8">
								<label class="label">
									<span class="label-text text-lg font-semibold">Payment Method</span>
								</label>
								<div class="grid md:grid-cols-2 gap-4">
									<label class="cursor-pointer">
										<input type="radio" bind:group={paymentMethod} value="credit-card" class="radio radio-primary mr-3" />
										<span class="text-lg">Credit/Debit Card</span>
									</label>
									<label class="cursor-pointer">
										<input type="radio" bind:group={paymentMethod} value="bank-transfer" class="radio radio-primary mr-3" />
										<span class="text-lg">Bank Transfer</span>
									</label>
								</div>
							</div>

							{#if paymentMethod === 'credit-card'}
								<!-- Credit Card Form -->
								<div class="space-y-6">
									<div class="form-control">
										<label class="label">
											<span class="label-text font-semibold">Cardholder Name *</span>
										</label>
										<input type="text" bind:value={paymentData.cardholderName} class="input input-bordered bg-white" required />
									</div>

									<div class="form-control">
										<label class="label">
											<span class="label-text font-semibold">Card Number *</span>
										</label>
										<input type="text" bind:value={paymentData.cardNumber} class="input input-bordered bg-white" placeholder="1234 5678 9012 3456" required />
									</div>

									<div class="grid md:grid-cols-2 gap-6">
										<div class="form-control">
											<label class="label">
												<span class="label-text font-semibold">Expiry Date *</span>
											</label>
											<input type="text" bind:value={paymentData.expiryDate} class="input input-bordered bg-white" placeholder="MM/YY" required />
										</div>
										<div class="form-control">
											<label class="label">
												<span class="label-text font-semibold">CVV *</span>
											</label>
											<input type="text" bind:value={paymentData.cvv} class="input input-bordered bg-white" placeholder="123" required />
										</div>
									</div>

									<h3 class="text-lg font-semibold mt-8 mb-4">Billing Address</h3>
									<div class="form-control mb-4">
										<label class="label">
											<span class="label-text font-semibold">Address</span>
										</label>
										<input type="text" bind:value={paymentData.billingAddress.address} class="input input-bordered bg-white" />
									</div>

									<div class="grid md:grid-cols-3 gap-4">
										<div class="form-control">
											<label class="label">
												<span class="label-text font-semibold">City</span>
											</label>
											<input type="text" bind:value={paymentData.billingAddress.city} class="input input-bordered bg-white" />
										</div>
										<div class="form-control">
											<label class="label">
												<span class="label-text font-semibold">Postal Code</span>
											</label>
											<input type="text" bind:value={paymentData.billingAddress.postalCode} class="input input-bordered bg-white" />
										</div>
										<div class="form-control">
											<label class="label">
												<span class="label-text font-semibold">Country</span>
											</label>
											<select bind:value={paymentData.billingAddress.country} class="select select-bordered bg-white">
												<option value="Thailand">Thailand</option>
												<option value="Singapore">Singapore</option>
												<option value="Malaysia">Malaysia</option>
												<option value="Philippines">Philippines</option>
												<option value="Other">Other</option>
											</select>
										</div>
									</div>
								</div>

							{:else if paymentMethod === 'bank-transfer'}
								<!-- Bank Transfer Instructions -->
								<div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
									<h3 class="text-lg font-semibold text-blue-900 mb-4">Bank Transfer Instructions</h3>
									<div class="space-y-3 text-blue-800">
										<div><strong>Bank:</strong> Kasikorn Bank</div>
										<div><strong>Account Name:</strong> MaCosplay Education Co., Ltd.</div>
										<div><strong>Account Number:</strong> 123-4-56789-0</div>
										<div><strong>Branch:</strong> Central World</div>
									</div>
									<div class="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
										<p class="text-sm text-yellow-800">
											<strong>Important:</strong> Please include your name and email address in the transfer reference. 
											Your enrollment will be confirmed within 24 hours after payment verification.
										</p>
									</div>
								</div>
							{/if}

							<div class="flex justify-between mt-8">
								<button class="btn btn-outline" on:click={prevStep}>
									Back
								</button>
								<button 
									class="btn btn-primary bg-gradient-to-r from-purple-600 to-pink-600 border-none px-8"
									disabled={!validateStep2()}
									on:click={nextStep}
								>
									Review Order
								</button>
							</div>

						{:else if currentStep === 3}
							<!-- Step 3: Confirmation -->
							<h2 class="text-2xl font-bold mb-6">Order Confirmation</h2>
							
							<div class="space-y-6">
								<div class="bg-gray-50 rounded-lg p-6">
									<h3 class="text-lg font-semibold mb-4">Enrollment Summary</h3>
									<div class="space-y-3">
										<div class="flex justify-between">
											<span>Name:</span>
											<span class="font-semibold">{enrollmentData.firstName} {enrollmentData.lastName}</span>
										</div>
										<div class="flex justify-between">
											<span>Email:</span>
											<span class="font-semibold">{enrollmentData.email}</span>
										</div>
										<div class="flex justify-between">
											<span>Phone:</span>
											<span class="font-semibold">{enrollmentData.phone}</span>
										</div>
										<div class="flex justify-between">
											<span>Experience Level:</span>
											<span class="font-semibold capitalize">{enrollmentData.experience.replace('-', ' ')}</span>
										</div>
									</div>
								</div>

								<div class="bg-gray-50 rounded-lg p-6">
									<h3 class="text-lg font-semibold mb-4">Payment Summary</h3>
									<div class="space-y-2">
										<div class="flex justify-between">
											<span>Payment Method:</span>
											<span class="font-semibold capitalize">{paymentMethod.replace('-', ' ')}</span>
										</div>
										{#if paymentMethod === 'credit-card'}
											<div class="flex justify-between">
												<span>Card:</span>
												<span class="font-semibold">**** **** **** {paymentData.cardNumber.slice(-4)}</span>
											</div>
										{/if}
									</div>
								</div>
							</div>

							<div class="flex justify-between mt-8">
								<button class="btn btn-outline" on:click={prevStep}>
									Back
								</button>
								<button 
									class="btn btn-primary bg-gradient-to-r from-purple-600 to-pink-600 border-none px-8"
									on:click={handleEnrollment}
								>
									Complete Enrollment
								</button>
							</div>
						{/if}
					</div>
				</div>

				<!-- Order Summary -->
				<div class="lg:col-span-1">
					{#if course}
						<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
							<h3 class="text-lg font-bold mb-4">Order Summary</h3>
							
							<div class="space-y-4 mb-6">
								<div>
									<h4 class="font-semibold text-gray-900">{course.title}</h4>
									<p class="text-sm text-gray-600">Instructor: {course.instructor}</p>
									<p class="text-sm text-gray-600">Duration: {course.duration}</p>
									<p class="text-sm text-gray-600">Level: {course.level}</p>
								</div>
							</div>

							<div class="space-y-3 border-t border-gray-200 pt-4">
								<div class="flex justify-between">
									<span>Course Price:</span>
									{#if course.originalPrice}
										<div class="text-right">
											<span class="line-through text-gray-500">฿{course.originalPrice.toLocaleString()}</span>
											<div class="text-purple-600 font-semibold">฿{course.price.toLocaleString()}</div>
										</div>
									{:else}
										<span class="font-semibold">฿{course.price.toLocaleString()}</span>
									{/if}
								</div>
								
								{#if course.originalPrice}
									<div class="flex justify-between text-green-600">
										<span>Discount:</span>
										<span>-฿{(course.originalPrice - course.price).toLocaleString()}</span>
									</div>
								{/if}

								<div class="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
									<span>Total:</span>
									<span class="text-purple-600">฿{course.price.toLocaleString()}</span>
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

							<div class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
								<h4 class="font-semibold text-blue-900 mb-2">What's Included:</h4>
								<ul class="text-sm text-blue-800 space-y-1">
									<li>• Lifetime access to course materials</li>
									<li>• Certificate of completion</li>
									<li>• Community access</li>
									<li>• Mobile app access</li>
									<li>• Personal feedback from instructor</li>
								</ul>
							</div>
						</div>
					{:else}
						<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
							<div class="text-center text-gray-500">
								<p>Please select a course to see the order summary</p>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</section>
</div>