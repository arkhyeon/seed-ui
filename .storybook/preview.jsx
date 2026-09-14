import React from 'react';
import { ThemeProvider } from '@emotion/react';
import { theme } from '../src/assets/Theme';

export default {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['Getting Started', ['Intro', 'Icons', 'Palette', 'Typography'], 'Components'],
      },
    },
    storybookCodePanel: {
      disabled: true,
      allowedExtensions: ['js', 'jsx', 'ts', 'tsx', 'css', 'sass'],
    },
  },
  decorators: [
    Story => (
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    ),
  ],
};
