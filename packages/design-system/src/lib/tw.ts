import { create, TwConfig, useAppColorScheme, useDeviceContext } from 'twrnc';

// Create customized tw instance with design system theme
export const tw = create(require('../../tailwind.config.js') as TwConfig);

export const useDeviceContextTw = useDeviceContext;
export const useAppColorSchemeTw = useAppColorScheme;

export default tw;
