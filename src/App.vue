,<template>
  <div class=" pt-8 ">
    <Menu />
    <About id="about" />
    <Projects id="project" />
    <Testimonials id="testimonial" />
    <Skills id="skills" />
    <Experience id="experience" />
    <Education id="education" />
    <Copy />
  </div>
</template>
<script>
import Menu from '@/components/menu/index.vue'
import About from '@/components/about/index.vue';
import Projects from '@/components/project/index.vue';
import Testimonials from '@/components/testimonials/index.vue';
import Skills from '@/components/skills/index.vue';
import Experience from '@/components/experience/index.vue'
import Education from '@/components/education/index.vue'
import Copy from '@/components/copy/index.vue'

export default {
  name: "home",
  components: {
    Menu,
    About,
    Projects,
    Testimonials,
    Skills,
    Experience,
    Education,
    Copy
  }
}
</script>
<style>
html {
  scroll-behavior: smooth;
}
</style>