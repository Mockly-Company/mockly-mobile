import { create, TwConfig } from 'twrnc';

// Create customized tw instance with design system theme
export const tw = create(require('../../tailwind.config.js') as TwConfig);

export default tw;
