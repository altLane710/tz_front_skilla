import { DropdownMenu } from 'radix-ui';

import { CallType } from '../../App';
import ArrowDownIcon from '../../assets/arrow_down.svg?react';
import ExpandLessIcon from '../../assets/expand_less_black.svg?react';

import IconButton from '../IconButton';

import './styles.css';
import { useState } from 'react';

interface UiPopoverProps {
  value: CallType;
  onChange: (selectedValue: CallType) => unknown;
}

function getTriggerLabel(value: CallType) {
  switch (value) {
    case 1:
      return 'Входящие';
    case 0:
      return 'Исходящие';
    case undefined:
      return 'Все типы';
    default:
      return 'Неизвестный тип звонка';
  }
}

const CallTypeDropdown = ({ value, onChange }: UiPopoverProps) => {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu.Root onOpenChange={(v) => setOpen(v)}>
      <DropdownMenu.Trigger asChild>
        <IconButton
          label={getTriggerLabel(value)}
          icon={
            open ? (
              <ExpandLessIcon width={18} height={21} />
            ) : (
              <ArrowDownIcon width={18} height={21} />
            )
          }
          style={{
            color:
              value !== undefined ? 'var(--accent)' : 'var(--text-secondary)',
          }}
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="DropdownMenuContent" align="start">
          <DropdownMenu.Item
            className="DropdownMenuItem"
            data-active={value === undefined}
            onClick={() => {
              onChange(undefined);
            }}
          >
            Все типы
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className="DropdownMenuItem"
            data-active={value === 1}
            onClick={() => {
              onChange(1);
            }}
          >
            Входящие
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className="DropdownMenuItem"
            data-active={value === 0}
            onClick={() => {
              onChange(0);
            }}
          >
            Исходящие
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default CallTypeDropdown;
