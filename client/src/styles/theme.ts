import { extendTheme, theme as base, withDefaultVariant } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const theme = extendTheme({
      config: {
        initialColorMode: 'system',
        useSystemColorMode: 'true',
      },
      colors: {
        palette: {
            100: '#FF8383',
            200: '#FFCF55',
            300: '#83B4FF',
            400: '#D9D9D9',
            500: '#9A92FF',
            600: '#5F56E6',
            700: '#2A2A2A',
        },
      },
      fonts: {
        heading: `Inter, ${base.fonts?.heading}`,
        body: `Inter, ${base.fonts?.body}`,
      },
      components: {
        Input: {
          variants: {
            filled: (props: any) => ({
              field: {
                _focus: {
                  borderColor: mode('palette.200','palette.500')(props),
                },
              }
            }),
          },
        },
      },
    },
    withDefaultVariant({
        variant: 'filled',
        components: ['Input'],
    }),
);

export default theme;