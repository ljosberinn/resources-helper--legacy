import React, { memo } from 'react';

export const Footer = memo(() => (
  <footer>
    <a href="https://github.com/ljosberinn/resources-helper" target="_blank">
      Github
    </a>
  </footer>
));

Footer.displayName = 'Footer';
//@ts-ignore
Footer.whyDidYouRender = {
  customName: 'Footer',
};