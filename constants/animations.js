import { Easing, LayoutAnimation } from "react-native";

export const animationTimings = {
  instant: 120,
  quick: 180,
  standard: 240,
  slow: 360,
  splash: 600,
  shimmer: 1400,
};

export const animationEasing = {
  standard: Easing.out(Easing.cubic),
  emphasized: Easing.bezier(0.2, 0, 0, 1),
  exit: Easing.inOut(Easing.quad),
};

export const springPresets = {
  button: {
    damping: 14,
    stiffness: 190,
    mass: 0.9,
  },
  gentle: {
    damping: 16,
    stiffness: 150,
    mass: 1,
  },
};

export const layoutAnimationPresets = {
  standard: {
    duration: animationTimings.standard,
    create: {
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity,
    },
    update: {
      type: LayoutAnimation.Types.easeInEaseOut,
    },
    delete: {
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity,
    },
  },
};
