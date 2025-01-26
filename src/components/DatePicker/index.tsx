import dayjs from 'dayjs';
import { DropdownMenu } from 'radix-ui';
import InputMask from 'react-input-mask';

import CalendarIcon from '../../assets/icon-calendar.svg?react';
import ArrowLeftIcon from '../../assets/arrow_left.svg?react';
import ArrowRightIcon from '../../assets/arrow_right.svg?react';

import { DateFilter } from '../../App';

import './styles.css';
import { useState } from 'react';

export type DateRange = {
  date_start: dayjs.Dayjs;
  date_end: dayjs.Dayjs;
};

interface DatePickerProps {
  value: DateFilter;
  onChange: (selectedValue: DateFilter) => unknown;
  onRangeChange: (selectedRange: DateRange) => unknown;
}

function getTriggerLabel(value: DateFilter, dateRange: string) {
  switch (value) {
    case DateFilter.LastThree:
      return '3 дня';
    case DateFilter.Week:
      return 'Неделя';
    case DateFilter.Month:
      return 'Месяц';
    case DateFilter.Year:
      return 'Год';
    case DateFilter.Custom:
      return dateRange;
    default:
      return 'Неизвестный фильтр';
  }
}

const DatePicker = ({ value, onChange, onRangeChange }: DatePickerProps) => {
  const [dateRange, setDateRange] = useState('');
  const [invalidRange, setInvalidRange] = useState(false);
  const [open, setOpen] = useState(false);

  const handleRangeChange = () => {
    const [startDate, endDate] = dateRange.split('-');
    const isRangeValid =
      dayjs(startDate, 'DD.MM.YY').isValid() &&
      dayjs(endDate, 'DD.MM.YY').isValid() &&
      dayjs(startDate, 'DD.MM.YY').isBefore(dayjs(endDate, 'DD.MM.YY'));

    setInvalidRange(!isRangeValid);

    if (isRangeValid && dateRange.length > 0) {
      const [startDate, endDate] = dateRange.split('-');
      onRangeChange({
        date_start: dayjs(startDate, 'DD.MM.YY'),
        date_end: dayjs(endDate, 'DD.MM.YY'),
      });
      setOpen(false);
    }
  };

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <div className="DropdownMenuArrows">
        <ArrowLeftIcon className="DropdownArrow" />
        <DropdownMenu.Trigger className="DropdownMenuTrigger">
          <div className="TriggerContent">
            <CalendarIcon className="CalendarIcon" />
            <span>{getTriggerLabel(value, dateRange)}</span>
          </div>
        </DropdownMenu.Trigger>
        <ArrowRightIcon className="DropdownArrow" />
      </div>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="DropdownMenuContent"
          align="end"
          sideOffset={8}
        >
          <DropdownMenu.Item
            className="DropdownMenuItem"
            data-active={value === DateFilter.LastThree}
            onClick={() => {
              onChange(DateFilter.LastThree);
            }}
          >
            3 дня
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="DropdownMenuItem"
            data-active={value === DateFilter.Week}
            onClick={() => {
              onChange(DateFilter.Week);
            }}
          >
            Неделя
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="DropdownMenuItem"
            data-active={value === DateFilter.Month}
            onClick={() => {
              onChange(DateFilter.Month);
            }}
          >
            Месяц
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="DropdownMenuItem"
            data-active={value === DateFilter.Year}
            onClick={() => {
              onChange(DateFilter.Year);
            }}
          >
            Год
          </DropdownMenu.Item>

          <DropdownMenu.Group asChild>
            <div className="DropdownDatesMenuItem">
              <span>Указать даты</span>
              <div className="DateRangeInputContainer">
                <InputMask
                  value={dateRange}
                  alwaysShowMask
                  className="DateRangeInput"
                  mask="99.99.99-99.99.99"
                  style={{
                    color: invalidRange ? '#ea1a4f' : 'var(--icon)',
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleRangeChange();
                    }
                  }}
                  onChange={(e) => {
                    e.preventDefault();
                    setDateRange(e.target.value);
                  }}
                />
                <CalendarIcon className="CalendarIcon" />
              </div>
            </div>
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default DatePicker;
