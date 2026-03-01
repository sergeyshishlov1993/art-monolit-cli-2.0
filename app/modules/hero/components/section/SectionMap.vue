<template>
  <section class="map-section">
    <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2680.3862949696722!2d35.206000076577126!3d47.793347075062805!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40dc5e8dd2891185%3A0x8be371d3dda8ebbe!2z0JrQvtGB0LzRltGH0L3QsCDQstGD0LvQuNGG0Y8sIDYzLzEsINCX0LDQv9C-0YDRltC20LbRjywg0JfQsNC_0L7RgNGW0LfRjNC60LAg0L7QsdC70LDRgdGC0YwsIDY5MDAw!5e0!3m2!1suk!2sua!4v1772225755786!5m2!1suk!2sua"
        class="map-section__iframe"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        allowfullscreen
    />
  </section>
</template>

<style scoped>
.map-section {
  width: 100%;
  height: 400px;
  border-top: 1px solid var(--border);
}

.map-section__iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
  filter: grayscale(0.6) contrast(1.1);
}

@media (max-width: 768px) {
  .map-section {
    height: 300px;
  }
}
</style>