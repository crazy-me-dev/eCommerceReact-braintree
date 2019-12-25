import { css } from "styled-components";
import { sizes, sizesUI } from "./variables";

// iterate through the sizes and create a media template
export const media = Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media only screen and (min-width: ${sizes[label] / 14}em) {
      ${css(...args)}
    }
  `;
  return acc;
}, {});

// iterate through the sizes and create a media template
export const mediaUI = Object.keys(sizesUI).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media only screen and (min-width: ${sizesUI[label]}px) {
      ${css(...args)}
    }
  `;
  return acc;
}, {});
