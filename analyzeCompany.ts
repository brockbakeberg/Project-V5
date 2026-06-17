@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  body {
    @apply font-sans bg-gray-50 text-gray-900;
  }
}

@layer components {
  .step-active {
    @apply bg-taylor-700 text-white shadow-lg shadow-taylor-700/30;
  }
  .step-done {
    @apply bg-taylor-100 text-taylor-700;
  }
  .step-pending {
    @apply bg-white border-2 border-gray-200 text-gray-400;
  }
  .card-hover {
    @apply transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5;
  }
}

@layer utilities {
  .delay-100 { animation-delay: 100ms; }
  .delay-200 { animation-delay: 200ms; }
  .delay-300 { animation-delay: 300ms; }
  .delay-400 { animation-delay: 400ms; }
  .delay-500 { animation-delay: 500ms; }
  .delay-600 { animation-delay: 600ms; }
  .delay-700 { animation-delay: 700ms; }
  .delay-800 { animation-delay: 800ms; }
}

.mockup-shadow {
  filter: drop-shadow(0 20px 40px rgba(0,0,0,0.2));
}

.prose-mockup {
  font-family: 'Inter', sans-serif;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
