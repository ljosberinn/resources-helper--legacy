import React, { MouseEvent } from 'react';
import { Dropdown } from 'rbx';

interface QualityDropdownProps {
  handleOnClick: (e: MouseEvent<Element>, quality: number) => void;
}

const QUALITY_THRESHOLDS = [100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50, 45, 40, 35, 30, 25, 20, 15, 10, 5];

export const QualityDropdown = ({ handleOnClick }: QualityDropdownProps) => (
  <Dropdown active>
    <Dropdown.Menu>
      <Dropdown.Content>
        {QUALITY_THRESHOLDS.map((quality, index) => (
          <Dropdown.Item key={index} onClick={(e: MouseEvent<Element>) => handleOnClick(e, quality / 100)}>
            {quality}%
          </Dropdown.Item>
        ))}
      </Dropdown.Content>
    </Dropdown.Menu>
  </Dropdown>
);
