import React, { useRef, useState } from 'react';

const VideoContainer = () => {
  const videoRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // 예시: 불량 구간 (초 단위)
  const defectTimestamps = [3, 6, 9];

  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  return (
    <div className='video-container'>
      <video
        ref={videoRef}
        src='/sample.mp4'
        controls
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        width='640'
      />

      {/* 오버레이 마커 */}
      {duration > 0 &&
        defectTimestamps.map((time, idx) => (
          <div
            key={idx}
            className='marker-overlay'
            style={{ left: `${(time / duration) * 100}%` }}
            onClick={() => {
              videoRef.current.currentTime = time;
            }}
            title={`불량 감지: ${time}s`}
          >
            ⚠️
          </div>
        ))}
    </div>
  );
};

export default VideoContainer;
