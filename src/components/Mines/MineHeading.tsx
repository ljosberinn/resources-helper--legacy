import React, { memo } from 'react';
import { Table } from 'rbx';

export const MineHeading = memo(() => (
  <Table.Head>
    <Table.Row>
      {[
        'Mine type',
        'Your rate per hour',
        'Your amount of mines',
        'Worth @ 100% condition',
        'Mine price',
        '100% quality income',
        'ROI 100%',
        '505%',
        '505% in your HQ',
      ].map((text, index) => (
        <Table.Heading key={index}>
          <abbr title={text}>{text}</abbr>
        </Table.Heading>
      ))}
    </Table.Row>
  </Table.Head>
));
