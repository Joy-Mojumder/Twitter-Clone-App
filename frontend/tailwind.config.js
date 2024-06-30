import daisyui from "daisyui";
import daisyuiThemes from "daisyui/src/theming/themes";
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      "light",
      {
        black: {
          ...daisyuiThemes["black"],
          primary: "rgb(72, 12, 168)",
          secondary: "rgb(3, 7, 30)",
        },
      },
    ],
  },
};
