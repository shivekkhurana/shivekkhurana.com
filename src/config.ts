export default {
  stateOfBeingBase:
    'https://raw.githubusercontent.com/krimlabs/state-of-being/master/',
  stateOfBeingPagesBase: 'https://shivekkhurana.github.io/state-of-being',
  vault: {
    workouts: '/vault/workouts.json',
    meditations: '/vault/meditations.json',
    sleep: '/vault/ultrahuman/sleep.json',
    sleepIndex: '/vault/ultrahuman/index.json',
    location:
      'https://shivekkhurana.github.io/state-of-being/vault/location.json',
    healthkit: {
      restingHeartRate: '/vault/healthkit/restingHeartRate.json',
      hrv: '/vault/healthkit/hrv.json',
      bodySurfaceTemp: '/vault/healthkit/bodySurfaceTemp.json',
    },
  },
  content: {
    source: './content',
    sink: './content/index.json',
  },
};
