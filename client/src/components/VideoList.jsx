import { IoCheckmarkCircle, IoSearch } from 'react-icons/io5';
import { useImage } from '../context/ImageContext';
import { useEffect, useState } from 'react';
import { getVideoList } from '../utils/api';

const VideoList = () => {
  const [videoList, setVideoList] = useState([]);
  const { image, setImage } = useImage();

  const handleVideoSelect = (video) => {
    console.log(`Selected video: ${video}`);
    setImage([video]);
  };

  useEffect(() => {
    const fetchVideoList = async () => {
      const list = await getVideoList();
      setVideoList(list);
    };
    fetchVideoList();
  }, []);

  return (
    <>
      <div className='video-list-header'>
        <span>비디오 선택</span>
        <IoSearch size='24' />
      </div>
      <div className='video-list-container'>
        <div className='video-list'>
          {videoList.length === 0 ? (
            <div>비디오 없음</div>
          ) : (
            videoList.map((video, index) => (
              <div key={index} className='video-item' onClick={() => handleVideoSelect(video)}>
                <div className='video-thumbnail' />
                <div className='video-item-contents'>
                  <span>{video}</span>
                  <IoCheckmarkCircle size='24' color={image[0] === video ? '#3C8FEF' : '#ccc'} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default VideoList;
