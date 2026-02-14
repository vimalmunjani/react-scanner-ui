import DefaultTheme from 'vitepress/theme';
import ScreenshotCarousel from './components/ScreenshotCarousel.vue';
import './custom.css';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('ScreenshotCarousel', ScreenshotCarousel);
  },
};
