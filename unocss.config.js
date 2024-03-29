import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetWind,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import presetWebFonts from '@unocss/preset-web-fonts'
export default defineConfig({
  shortcuts: [
    {
      'flex-c': 'flex items-center justify-center',
      'flex-y-c': 'flex items-center',
      'grid-c': 'grid place-items-center',
      'icon-btn':
        'text-[0.9em] inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600 !outline-none',
    },
    [/^horizontal-place-(.*)$/, ([, c]) => `flex items-center space-x-${c}`],
  ],
  presets: [
    presetWind(),
    presetAttributify(),
    presetWebFonts({
      fonts: {
        provider: 'bunny',
        Inter: [{ name: 'Inter' }],
      },
    }),
    presetIcons({
      warn: true,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
        'margin-top': '-1px',
      },
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  variants: [
    // 因为.scss文件里面,uno不能写"!xxx"去表示 !importannt ,会报错
    // 这里为important写一种变体，让以"I_"开头的class也是important，兼容scss文件
    matcher => {
      if (!matcher.startsWith('I_')) {
        return matcher
      }
      return {
        matcher: matcher.slice(2),
        body: body => {
          body.forEach(v => {
            if (v[1]) {
              v[1] += ' !important'
            }
          })
          return body
        },
      }
    },
  ],
})
