<template>
  <div class="carousel-container">
    <div class="carousel-main">
      <button class="carousel-btn prev" @click="prev" aria-label="Previous">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <div class="carousel-image-wrapper" @click="openFullscreen">
        <img
          :src="currentImage.src"
          :alt="currentImage.alt"
          class="carousel-image"
        />
        <div class="carousel-caption">
          <span>{{ currentImage.alt }}</span>
          <span class="fullscreen-hint">Click to enlarge</span>
        </div>
      </div>

      <button class="carousel-btn next" @click="next" aria-label="Next">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>

    <div class="carousel-dots">
      <button
        v-for="(image, index) in images"
        :key="index"
        :class="['dot', { active: index === currentIndex }]"
        @click="goTo(index)"
        :aria-label="`Go to slide ${index + 1}`"
      ></button>
    </div>

    <div class="carousel-thumbnails">
      <button
        v-for="(image, index) in images"
        :key="index"
        :class="['thumbnail', { active: index === currentIndex }]"
        @click="goTo(index)"
      >
        <img :src="image.src" :alt="image.alt" />
      </button>
    </div>

    <!-- Fullscreen Lightbox -->
    <Teleport to="body">
      <Transition name="lightbox">
        <div
          v-if="isFullscreen"
          class="lightbox-overlay"
          @click="closeFullscreen"
        >
          <div class="lightbox-content" @click.stop>
            <button
              class="lightbox-close"
              @click="closeFullscreen"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <button
              class="lightbox-nav prev"
              @click="prev"
              aria-label="Previous"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            <div class="lightbox-image-container">
              <img
                :src="currentImage.src"
                :alt="currentImage.alt"
                class="lightbox-image"
              />
              <div class="lightbox-caption">{{ currentImage.alt }}</div>
              <div class="lightbox-counter">
                {{ currentIndex + 1 }} / {{ images.length }}
              </div>
            </div>

            <button class="lightbox-nav next" @click="next" aria-label="Next">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>

          <div class="lightbox-thumbnails">
            <button
              v-for="(image, index) in images"
              :key="index"
              :class="['lightbox-thumb', { active: index === currentIndex }]"
              @click.stop="goTo(index)"
            >
              <img :src="image.src" :alt="image.alt" />
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  images: {
    type: Array,
    required: true,
  },
  autoplay: {
    type: Boolean,
    default: false,
  },
  interval: {
    type: Number,
    default: 5000,
  },
});

const currentIndex = ref(0);
const isFullscreen = ref(false);

const currentImage = computed(() => props.images[currentIndex.value]);

const next = () => {
  currentIndex.value = (currentIndex.value + 1) % props.images.length;
};

const prev = () => {
  currentIndex.value =
    (currentIndex.value - 1 + props.images.length) % props.images.length;
};

const goTo = index => {
  currentIndex.value = index;
};

const openFullscreen = () => {
  isFullscreen.value = true;
  document.body.style.overflow = 'hidden';
};

const closeFullscreen = () => {
  isFullscreen.value = false;
  document.body.style.overflow = '';
};

const handleKeydown = e => {
  if (!isFullscreen.value) return;

  if (e.key === 'Escape') {
    closeFullscreen();
  } else if (e.key === 'ArrowRight') {
    next();
  } else if (e.key === 'ArrowLeft') {
    prev();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  document.body.style.overflow = '';
});

// Autoplay functionality
let autoplayInterval = null;

if (props.autoplay) {
  autoplayInterval = setInterval(next, props.interval);
}
</script>

<style scoped>
.carousel-container {
  width: 100%;
  margin: 24px 0;
}

.carousel-main {
  display: flex;
  align-items: center;
  gap: 16px;
}

.carousel-btn {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.carousel-btn:hover {
  background: var(--vp-c-brand);
  color: white;
  border-color: var(--vp-c-brand);
}

.carousel-image-wrapper {
  flex: 1;
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  cursor: zoom-in;
  transition: all 0.2s ease;
}

.carousel-image-wrapper:hover {
  border-color: var(--vp-c-brand);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.carousel-image {
  width: 100%;
  height: auto;
  display: block;
}

.carousel-caption {
  padding: 12px 16px;
  text-align: center;
  font-size: 14px;
  color: var(--vp-c-text-2);
  border-top: 1px solid var(--vp-c-divider);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fullscreen-hint {
  font-size: 12px;
  color: var(--vp-c-text-3);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.carousel-image-wrapper:hover .fullscreen-hint {
  opacity: 1;
}

.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: var(--vp-c-divider);
  cursor: pointer;
  transition: all 0.2s ease;
}

.dot:hover {
  background: var(--vp-c-text-3);
}

.dot.active {
  background: var(--vp-c-brand);
  transform: scale(1.2);
}

.carousel-thumbnails {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.thumbnail {
  width: 80px;
  height: 50px;
  border-radius: 6px;
  border: 2px solid var(--vp-c-divider);
  overflow: hidden;
  cursor: pointer;
  padding: 0;
  background: none;
  transition: all 0.2s ease;
}

.thumbnail:hover {
  border-color: var(--vp-c-text-3);
}

.thumbnail.active {
  border-color: var(--vp-c-brand);
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Lightbox Styles */
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.lightbox-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1400px;
  flex: 1;
  position: relative;
}

.lightbox-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10;
}

.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.lightbox-nav {
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.lightbox-nav:hover {
  background: rgba(255, 255, 255, 0.2);
}

.lightbox-nav.prev {
  margin-right: 20px;
}

.lightbox-nav.next {
  margin-left: 20px;
}

.lightbox-image-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: calc(100vh - 200px);
}

.lightbox-image {
  max-width: 100%;
  max-height: calc(100vh - 250px);
  object-fit: contain;
  border-radius: 8px;
}

.lightbox-caption {
  margin-top: 16px;
  color: white;
  font-size: 16px;
  text-align: center;
}

.lightbox-counter {
  margin-top: 8px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

.lightbox-thumbnails {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  flex-wrap: wrap;
  max-width: 100%;
  overflow-x: auto;
  padding: 10px 0;
}

.lightbox-thumb {
  width: 80px;
  height: 50px;
  border-radius: 6px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  cursor: pointer;
  padding: 0;
  background: none;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.lightbox-thumb:hover {
  border-color: rgba(255, 255, 255, 0.5);
}

.lightbox-thumb.active {
  border-color: var(--vp-c-brand);
}

.lightbox-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Transitions */
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.3s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .carousel-btn {
    width: 36px;
    height: 36px;
  }

  .carousel-btn svg {
    width: 18px;
    height: 18px;
  }

  .thumbnail {
    width: 60px;
    height: 38px;
  }

  .lightbox-nav {
    width: 40px;
    height: 40px;
  }

  .lightbox-nav svg {
    width: 24px;
    height: 24px;
  }

  .lightbox-nav.prev {
    margin-right: 10px;
  }

  .lightbox-nav.next {
    margin-left: 10px;
  }

  .lightbox-thumb {
    width: 60px;
    height: 38px;
  }
}
</style>
