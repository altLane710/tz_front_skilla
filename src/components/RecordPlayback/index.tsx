import dayjs from 'dayjs';

import DownloadIcon from '../../assets/download.svg?react';
import CloseIcon from '../../assets/close.svg?react';
import PlayIcon from '../../assets/play.svg?react';
import PauseIcon from '../../assets/pause.svg?react';

import './styles.css';
import { useEffect, useState } from 'react';

const RecordPlayback = ({
  record,
  partnership_id,
  duration,
}: {
  record: string;
  partnership_id: string;
  duration: number;
}) => {
  const [playing, setPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | undefined>();
  const [progress, setProgress] = useState<number>(0);

  async function handlePlay() {
    if (!playing) {
      const response = await fetch(
        `https://api.skilla.ru/mango/getRecord?record=${record}&partnership_id=${partnership_id}`,
        {
          method: 'POST',
          headers: {
            Authorization: 'Bearer testtoken',
            'Content-type':
              'audio/mpeg, audio/x-mpeg, audio/x-mpeg-3, audio/mpeg3',
            'Content-Transfer-Encoding': 'binary',
            'Content-Disposition': 'filename="record.mp3"',
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const objectURL = URL.createObjectURL(blob);

        const audioObject = new Audio(objectURL);
        audioObject.play();

        audioObject.onended = () => {
          setPlaying(false);
          setProgress(0);
        };

        setPlaying(true);
        setAudio(audioObject);
      }
    } else {
      audio?.pause();
      setPlaying(false);
    }
  }

  useEffect(() => {
    let timer: number;

    if (playing) {
      timer = setInterval(() => {
        if (audio?.currentTime) {
          console.log(audio.currentTime);
          console.log(duration);
          setProgress(Math.floor((audio.currentTime * 100) / duration));
        }
      }, 1000);
    }

    return () => {
      setProgress(0);
      clearInterval(timer);
    };
  }, [playing]);

  return (
    <div className="RecordPlaybackRoot">
      <span>{dayjs.duration(duration, 'seconds').format('mm:ss')}</span>

      <button className="PlayButton" onClick={handlePlay}>
        {playing ? <PauseIcon /> : <PlayIcon />}
      </button>

      <div
        className="RecordPlaybackProgress"
        style={{
          background: `linear-gradient(to right, #00f, ${
            progress > 0 ? progress : 0
          }%, var(--icon) ${progress > 0 ? progress : 100}% `,
        }}
      ></div>

      <DownloadIcon />

      <CloseIcon />
    </div>
  );
};

export default RecordPlayback;
