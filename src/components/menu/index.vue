<template>
  <div
    class="fixed inset-x-0 top-0 z-30 mx-auto w-full max-w-screen-md border bg-gray-300 opacity-80 py-3 shadow backdrop-blur-lg md:top-6 md:rounded-3xl lg:max-w-screen-lg">
    <div class="px-4">
      <div class="flex items-center justify-between">
        <div class="flex shrink-0">
          <a aria-current="page" class="flex items-center uppercase" href="/">
            <img src="@/assets/img/black-logo.svg" class="w-auto h-6" width="116" height="24" alt="Logo vagner zezo" />
          </a>
        </div>
        <div class="hidden md:flex md:items-center md:justify-center md:gap-5">
          <button @click="scrollTo('about')" class="inline-block rounded-lg px-2 py-1 text-sm font-medium text-gray-900 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900">
            Bio
          </button>
          <button @click="scrollTo('project')" class="inline-block rounded-lg px-2 py-1 text-sm font-medium text-gray-900 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900">
            Projetos
          </button>
          <button @click="scrollTo('testimonial')" class="inline-block rounded-lg px-2 py-1 text-sm font-medium text-gray-900 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900">
            Depoimento
          </button>
          <button @click="scrollTo('skills')" class="inline-block rounded-lg px-2 py-1 text-sm font-medium text-gray-900 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900">
            Skills
          </button>
          <button @click="scrollTo('experience')" class="inline-block rounded-lg px-2 py-1 text-sm font-medium text-gray-900 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900">
            Experiência
          </button>
          <button @click="scrollTo('education')" class="inline-block rounded-lg px-2 py-1 text-sm font-medium text-gray-900 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900">
            Formação
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    scrollTo(sectionId) {
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 50; 
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: elementPosition - offset,
          behavior: "smooth",
        });
      }
    },
  },
};
</script>