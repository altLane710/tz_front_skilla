import { ReactElement, useEffect, useState } from 'react';
import dayjs from 'dayjs';

import CallTypeDropdown from './components/CallTypeDropdown';
import DatePicker, { DateRange } from './components/DatePicker';
import UiAvatar from './components/Avatar';
import { RandomRatingBadge } from './components/RatingBadge';

import IncomingIcon from './assets/incoming.svg?react';
import OutgoingIcon from './assets/outgoing.svg?react';
import CloseIcon from './assets/close.svg?react';
import ArrowDownIcon from './assets/arrow_down.svg?react';
import ExpandLessIcon from './assets/expand_less_black.svg?react';
import Avatar from './assets/avatar.svg';

import './App.css';
import IconButton from './components/IconButton';
import RecordPlayback from './components/RecordPlayback';

interface IGetListResponse {
  results: ICall[];
  total_rows: number;
}

interface ICall {
  id: number;
  partnership_id: string;
  date: string;
  time: number;
  date_notime: string;
  source: string;
  person_avatar: string;
  in_out: boolean;
  from_number: string;
  to_number: string;
  rating: number;
  status: string;
  record: string;
}

export type CallType = 0 | 1 | undefined;

export enum DateFilter {
  LastThree,
  Week,
  Month,
  Year,
  Custom,
}

enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

const dateFormat = 'YYYY-MM-DD';

function getFilterPeriod(period: DateFilter) {
  const endOfToday = dayjs().endOf('day');

  switch (period) {
    case DateFilter.LastThree:
      return {
        date_start: dayjs(endOfToday)
          .subtract(3, 'days')
          .add(1, 'second')
          .format(dateFormat),
        date_end: dayjs(endOfToday).format(dateFormat),
      };
    case DateFilter.Week:
      return {
        date_start: dayjs(endOfToday)
          .subtract(1, 'week')
          .add(1, 'seconds')
          .format(dateFormat),
        date_end: dayjs(endOfToday).format(dateFormat),
      };

    case DateFilter.Month:
      return {
        date_start: dayjs(endOfToday)
          .subtract(1, 'month')
          .add(1, 'seconds')
          .format(dateFormat),
        date_end: dayjs(endOfToday).format(dateFormat),
      };

    case DateFilter.Year:
      return {
        date_start: dayjs(endOfToday)
          .subtract(1, 'year')
          .add(1, 'seconds')
          .format(dateFormat),
        date_end: dayjs(endOfToday).format(dateFormat),
      };
  }
}

const App = () => {
  const [calls, setCalls] = useState<Record<string, ICall[]>>({});
  const [callType, setCallType] = useState<CallType>();
  const [timeSort, setTimeSort] = useState<SortDirection | undefined>();
  const [durationSort, setDurationSort] = useState<SortDirection | undefined>();

  const [dateFilter, setDateFilter] = useState<DateFilter>(
    DateFilter.LastThree
  );

  const [dateRange, setDateRange] = useState<DateRange>({
    date_start: dayjs(),
    date_end: dayjs(),
  });

  const fetchData = async () => {
    try {
      const url = 'https://api.skilla.ru/mango/getList';
      const params = [];

      if (callType !== undefined) {
        params.push(`in_out=${callType}`);
      }

      if (dateFilter === DateFilter.Custom) {
        params.push(`date_start=${dateRange.date_start.format(dateFormat)}`);
        params.push(`date_end=${dateRange.date_end.format(dateFormat)}`);
      } else {
        const period = getFilterPeriod(dateFilter);
        params.push(`date_start=${period?.date_start}`);
        params.push(`date_end=${period?.date_end}`);
      }

      if (timeSort) {
        params.push(`sort_by=date`);
        params.push(`order=${timeSort}`);
      }

      if (durationSort) {
        params.push(`sort_by=duration`);
        params.push(`order=${durationSort}`);
      }

      const response = await fetch(
        params.length > 0 ? `${url}?${params.join('&')}` : url,
        {
          method: 'POST',
          headers: {
            Authorization: 'Bearer testtoken',
          },
        }
      );

      if (response.ok) {
        const data: IGetListResponse = await response.json();

        const groupedСalls = data.results.reduce((acc: any, item: ICall) => {
          const key = item.date_notime;
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(item);
          return acc;
        }, {});

        setCalls(groupedСalls);
      }
    } catch (error: unknown) {
      console.log(error);
    }
  };

  function renderCalls() {
    const rows: ReactElement[] = [];
    let currentGroup = 0;
    for (const date in calls) {
      currentGroup += 1;

      const groupRow = (
        <tr className="GroupRow">
          <td></td>
          <td colSpan={7}>
            <span>
              {dayjs(date).format('DD/MM/YYYY')}{' '}
              <sup style={{ fontWeight: '12px', color: '#899CB1' }}>
                {calls[date].length}
              </sup>
            </span>
          </td>
        </tr>
      );

      if (currentGroup > 1) {
        rows.push(groupRow);
      }

      for (const call of calls[date]) {
        const callRow = (
          <tr key={call.id} className="CallRow">
            <td></td>

            <td>{call.in_out ? <IncomingIcon /> : <OutgoingIcon />}</td>

            <td>{dayjs(call.date).format('HH:MM')}</td>

            <td>
              <UiAvatar
                src={
                  call.person_avatar.includes('noavatar.jpg')
                    ? Avatar
                    : call.person_avatar
                }
              />
            </td>

            <td>
              {call.in_out ? `+${call.from_number}` : `+${call.to_number}`}
            </td>

            <td className="Source">{call.source || 'Rabota.ru'}</td>

            <td>
              <RandomRatingBadge />
            </td>

            <td>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  paddingRight: '40px',
                }}
              >
                {call.record ? (
                  <RecordPlayback
                    record={call.record}
                    partnership_id={call.partnership_id}
                    duration={call.time}
                  />
                ) : (
                  `${call.time} сек`
                )}
              </div>
            </td>
          </tr>
        );

        rows.push(callRow);
      }
    }

    return rows;
  }

  useEffect(() => {
    fetchData();
  }, [callType, dateFilter, dateRange, timeSort, durationSort]);

  return (
    <div className="container">
      <div className="filters">
        <div style={{ display: 'flex', gap: '16px' }}>
          <CallTypeDropdown value={callType} onChange={(v) => setCallType(v)} />
          {callType != undefined && (
            <IconButton
              label="Сбросить фильтры"
              icon={<CloseIcon width={15} height={15} />}
              onClick={() => {
                setCallType(undefined);
              }}
            />
          )}
        </div>
        <DatePicker
          value={dateFilter}
          onChange={(v) => setDateFilter(v)}
          onRangeChange={(range) => {
            setDateFilter(DateFilter.Custom);
            setDateRange(range);
          }}
        />
      </div>

      <table className="calls">
        <thead className="calls-header">
          <tr>
            <th style={{ width: '40px' }}></th>
            <th style={{ width: '54px' }}>Тип</th>
            <th style={{ width: '88px' }}>
              <IconButton
                label="Время"
                icon={
                  timeSort === SortDirection.ASC ? (
                    <ExpandLessIcon width={18} height={21} />
                  ) : timeSort === SortDirection.DESC ? (
                    <ArrowDownIcon width={18} height={21} />
                  ) : undefined
                }
                onClick={() => {
                  if (timeSort === SortDirection.DESC) {
                    setTimeSort(SortDirection.ASC);
                  } else {
                    setTimeSort(SortDirection.DESC);
                  }
                  setDurationSort(undefined);
                }}
              />
            </th>
            <th style={{ width: '129px' }}>Сотрудник</th>
            <th style={{ width: '325px' }}>Звонок</th>
            <th style={{ width: '214px' }}>Источник</th>
            <th style={{ width: '140px' }}>Оценка</th>
            <th
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                paddingRight: '20px',
              }}
            >
              <IconButton
                label="Длительность"
                icon={
                  durationSort === SortDirection.ASC ? (
                    <ExpandLessIcon width={18} height={21} />
                  ) : durationSort === SortDirection.DESC ? (
                    <ArrowDownIcon width={18} height={21} />
                  ) : undefined
                }
                onClick={() => {
                  if (durationSort === SortDirection.DESC) {
                    setDurationSort(SortDirection.ASC);
                  } else {
                    setDurationSort(SortDirection.DESC);
                  }
                  setTimeSort(undefined);
                }}
              />
            </th>
          </tr>
        </thead>
        <tbody>{renderCalls()}</tbody>
      </table>
    </div>
  );
};

export default App;
