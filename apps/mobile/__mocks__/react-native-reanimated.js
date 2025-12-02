/* eslint-env jest */
// Minimal mock for react-native-reanimated that avoids importing React Native internals
const React = require('react');

const identity = v => v;

// Chainable animation builder (supports .delay().springify() patterns)
const createChainableAnimation = () => {
  const chain = () => chain;
  chain.delay = () => chain;
  chain.springify = () => chain;
  chain.duration = () => chain;
  chain.damping = () => chain;
  chain.stiffness = () => chain;
  chain.withInitialValues = () => chain;
  return chain;
};

// Create a mock React component for Animated components
const createMockAnimatedComponent = displayName => {
  const Component = React.forwardRef((props, ref) => {
    const {
      entering: _entering,
      exiting: _exiting,
      layout: _layout,
      style,
      ...restProps
    } = props;
    // Strip reanimated-specific props and render as regular component
    return React.createElement(displayName, { ...restProps, style, ref });
  });
  Component.displayName = `Animated.${displayName}`;
  return Component;
};

// Animated components that work as React components
// (Exported via AnimatedAPI proxy, so these are not directly exported)

// Proxy for Animated.* pattern (Animated.View, Animated.ScrollView, etc.)
const AnimatedAPI = new Proxy(
  {
    View: createMockAnimatedComponent('View'),
    Text: createMockAnimatedComponent('Text'),
    ScrollView: createMockAnimatedComponent('ScrollView'),
    FlatList: createMockAnimatedComponent('FlatList'),
    Image: createMockAnimatedComponent('Image'),
  },
  {
    get: (target, prop) => target[prop] || createMockAnimatedComponent(prop),
  },
);

module.exports = {
  __esModule: true,
  default: AnimatedAPI,

  // Entering/Exiting animations used in HomeScreen
  FadeInDown: createChainableAnimation(),
  FadeInUp: createChainableAnimation(),
  FadeIn: createChainableAnimation(),
  FadeOut: createChainableAnimation(),
  SlideInLeft: createChainableAnimation(),
  SlideInRight: createChainableAnimation(),
  SlideOutLeft: createChainableAnimation(),
  SlideOutRight: createChainableAnimation(),

  // Common hooks
  useSharedValue: v => ({ value: v }),
  useAnimatedStyle: fn => (typeof fn === 'function' ? fn() : {}),
  useAnimatedProps: fn => (typeof fn === 'function' ? fn() : {}),
  useDerivedValue: fn => ({ value: typeof fn === 'function' ? fn() : fn }),
  useAnimatedScrollHandler: () => ({}),
  useAnimatedGestureHandler: () => ({}),
  useAnimatedReaction: () => {},

  // Animation functions
  withTiming: identity,
  withSpring: identity,
  withDecay: identity,
  withRepeat: identity,
  withSequence: identity,
  withDelay: identity,

  // Utilities
  runOnJS: fn => fn,
  runOnUI: fn => fn,
  cancelAnimation: () => {},
  Easing: {
    linear: identity,
    ease: identity,
    quad: identity,
    cubic: identity,
    bezier: () => identity,
    in: fn => fn,
    out: fn => fn,
    inOut: fn => fn,
  },

  // Layout animations
  Layout: {
    duration: () => ({}),
    springify: () => ({}),
  },

  // createAnimatedComponent for custom components
  createAnimatedComponent: Component => Component,

  // Mock setUpTests as no-op (some test setups may call it)
  setUpTests: () => {},
};
