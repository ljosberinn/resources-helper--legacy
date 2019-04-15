import { Dropdown } from 'rbx';
import React, { MouseEvent } from 'react';
import { IMineState } from '../../types/mines';

interface MineTypeDropdownProps {
  mines: IMineState[];
  handleOnClick: (e: MouseEvent<Element>, resourceID: number) => void;
}

export const MineTypeDropdown = ({ mines, handleOnClick }: MineTypeDropdownProps) => (
  <Dropdown active>
    <Dropdown.Menu>
      <Dropdown.Content>
        {mines.map((mine, index) => (
          <Dropdown.Item key={index} onClick={(e:MouseEvent<Element>) => handleOnClick(e, mine.resourceID)}>
            {mine.resourceID}
          </Dropdown.Item>
        ))}
      </Dropdown.Content>
    </Dropdown.Menu>
  </Dropdown>
);
