<script lang="ts">
  import { categories } from '../data/site';
</script>

<div>
  <!-- Mobile Carousel -->
  <div class="mt-6 sm:mt-8 md:mt-10 gap-3 sm:gap-4 flex carousel xl:hidden overflow-x-auto pb-4 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
    {#each categories.filter(category => category.featured) as category, index (index)}
      <div class="relative carousel-item flex-shrink-0">
        <figure class="w-64 sm:w-72 md:w-80">
          <img
            src={category.image}
            alt={category.name}
            width="300"
            height="200"
            class="w-full h-40 sm:h-44 md:h-48 object-cover rounded-2xl sm:rounded-3xl"
            loading="lazy"
          />
        </figure>
        <div class="absolute w-full bottom-6 sm:bottom-8 md:bottom-10 text-base-100 flex flex-col items-center justify-center px-4">
          <a
            href={`/shop`}
            aria-label={`Go to ${category.name}`}
            class="w-full"
          >
            <button
              class="btn btn-sm sm:btn-md rounded-full flex items-center justify-center w-full max-w-48 text-sm sm:text-base"
              aria-label={category.name}
            >
              {category.name}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="currentColor"
                class="ml-2 sm:w-5 sm:h-5"
              >
                <path d="M7 7h8.586L5.293 17.293l1.414 1.414L17 8.414V17h2V5H7v2z" />
              </svg>
            </button>
          </a>
        </div>
      </div>
    {/each}
  </div>

  <!-- Desktop Grid -->
  <div class="mt-10 hidden xl:grid xl:grid-cols-3 2xl:grid-cols-4 gap-5 max-w-[120rem] mx-auto">
    {#each categories.filter(category => category.featured) as category, index (index)}
      <div class="relative">
        <figure>
          <img
            src={category.image}
            alt={category.name}
            width="500"
            height="200"
            class="w-full h-48 xl:h-52 2xl:h-56 object-cover rounded-3xl"
            loading="lazy"
          />
        </figure>
        <div class="absolute w-full bottom-10 text-base-100 flex flex-col items-center justify-center px-4">
          <a
            href={`/shop`}
            aria-label={`Go to ${category.name}`}
            class="w-full"
          >
            <button
              class="btn btn-md rounded-full flex items-center justify-center w-full max-w-56"
              aria-label={category.name}
            >
              {category.name}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                class="ml-2"
              >
                <path d="M7 7h8.586L5.293 17.293l1.414 1.414L17 8.414V17h2V5H7v2z" />
              </svg>
            </button>
          </a>
        </div>
      </div>
    {/each}
  </div>
</div>
