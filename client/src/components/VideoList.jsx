import { IoCheckmarkCircle, IoSearch } from 'react-icons/io5';
import { useImage } from '../context/ImageContext';
import { useState } from 'react';

const VideoList = () => {
  const videoList = [
    { filename: 'video1.mp4' },
    { filename: 'video2.mp4' },
    { filename: 'video3.mp4' },
    { filename: 'video4.mp4' },
    { filename: 'video5.mp4' },
    { filename: 'video6.mp4' }
  ];
  const [videoSelected, setVideoSelected] = useState(null);

  const handleVideoSelect = (video) => {
    console.log(`Selected video: ${video.filename}`);
    setVideoSelected(video.filename);
  };

  return (
    <>
      <div className='video-list-header'>
        <span>비디오 선택</span>
        <IoSearch size='24' />
      </div>
      <div className='video-list-container'>
        <div className='video-list'>
          {videoList.map((video, index) => (
            <div key={index} className='video-item' onClick={() => handleVideoSelect(video)}>
              <div className='video-thumbnail' />
              <div className='video-item-contents'>
                <span>{video.filename}</span>
                <IoCheckmarkCircle
                  size='24'
                  color={videoSelected === video.filename ? '#3C8FEF' : '#ccc'}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default VideoList;
