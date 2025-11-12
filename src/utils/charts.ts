import config from '@src/config';

// Get gradient colors based on the metric color
// Convert hex to pastel gradient with more pronounced hover effect
export function getGradientClasses(baseColor: string): string {
  // Map colors to pastel gradients with darker, more saturated hover states
  if (baseColor === config.colors.healthkit.restingHeartRate) {
    // Hot pink - darker gradient on hover
    return 'bg-gradient-to-br from-pink-100 to-pink-200 hover:from-pink-300 hover:to-pink-200';
  } else if (baseColor === config.colors.healthkit.hrv) {
    // Coral red - darker gradient on hover
    return 'bg-gradient-to-br from-red-100 to-red-200 hover:from-red-300 hover:to-red-200';
  } else if (baseColor === config.colors.healthkit.bodySurfaceTemp) {
    // Turquoise - darker gradient on hover
    return 'bg-gradient-to-br from-cyan-100 to-teal-200 hover:from-cyan-300 hover:to-teal-200';
  } else if (baseColor === config.colors.healthkit.workouts) {
    // Purple - darker gradient on hover
    return 'bg-gradient-to-br from-purple-100 to-purple-200 hover:from-purple-300 hover:to-purple-200';
  } else if (baseColor === config.colors.healthkit.sleep) {
    // Green - darker gradient on hover
    return 'bg-gradient-to-br from-green-100 to-green-200 hover:from-green-300 hover:to-green-200';
  }
  // Default pastel gradient - darker gradient on hover
  return 'bg-gradient-to-br from-blue-100 to-purple-200 hover:from-blue-300 hover:to-purple-200';
}
