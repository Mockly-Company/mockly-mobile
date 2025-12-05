const React = require('react');
const RN = require('react-native');

const theme = {
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    accent: '#FF9500',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    background: '#FFFFFF',
    surface: '#F2F2F7',
    text: '#000000',
    textSecondary: '#8E8E93',
    border: '#C6C6C8',
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, '2xl': 48 },
  typography: {
    fontSize: { xs: 12, sm: 14, md: 16, lg: 18, xl: 24, '2xl': 32 },
    fontWeight: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  borderRadius: { sm: 4, md: 8, lg: 12, xl: 16, full: 9999 },
};

const mockTw = jest.fn((...args) => args.flat());
mockTw.style = jest.fn((...args) => args.flat());
mockTw.color = jest.fn(color => color);

const Text = ({ children, ...props }) =>
  React.createElement(RN.Text, props, children);

const Spacer = ({ size }) =>
  React.createElement(RN.View, {
    style: { height: theme.spacing[size] || 16 },
  });

const Card = ({ children, _variant, style, ...props }) =>
  React.createElement(RN.View, { style, ...props }, children);

const Badge = ({ children, _variant, _color, _size, style, ...props }) =>
  React.createElement(
    RN.View,
    { style, ...props },
    React.createElement(RN.Text, {}, children),
  );

module.exports = {
  tw: mockTw,
  theme,
  Text,
  Spacer,
  Card,
  Badge,
  default: theme,
};
