import type { Preview } from '@storybook/nextjs';
import { ThemeProvider } from '../components/ui/theme/ThemeProvider';
import '../styles/globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  // Add a toolbar to switch themes and wrap stories with ThemeProvider
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
      },
    },
  },
  decorators: [
    (Story, context) => (
      <ThemeProvider
        defaultTheme={(context.globals && context.globals.theme) || 'light'}
      >
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default preview;
