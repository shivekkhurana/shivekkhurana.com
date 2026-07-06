export default {
  stateOfBeingPagesBase: 'https://shivekkhurana.github.io/state-of-being',
  vault: {
    workouts: '/vault/workouts.json',
    macros: '/vault/macros.json',
    meditations: '/vault/meditations.json',
    sleep: '/vault/ultrahuman/sleep.json',
    sleepIndex: '/vault/ultrahuman/index.json',
    location: '/vault/location.json',
    healthkit: {
      restingHeartRate: '/vault/healthkit/restingHeartRate.json',
      hrv: '/vault/healthkit/hrv.json',
      bodySurfaceTemp: '/vault/healthkit/bodySurfaceTemp.json',
      sleep: '/vault/healthkit/sleep.json',
    },
  },
  content: {
    source: './content',
    sink: './content/index.json',
  },
  blog: {
    recentPostsLimit: 8,
  },
  colors: {
    healthkit: {
      restingHeartRate: '#FF69B4', // Hot pink
      hrv: '#FF6B6B', // Coral red
      bodySurfaceTemp: '#4ECDC4', // Turquoise
      bodySurfaceTempText: '#0D9488', // Darker teal for text readability
      workouts: '#A855F7', // Purple
      sleep: '#10B981', // Green
      calories: '#2563EB', // Blue
      protein: '#F59E0B', // Amber
    },
  },
};
