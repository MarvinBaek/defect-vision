import { useState } from 'react';
import DropZone from '../components/DropZone';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { useImage } from '../context/ImageContext';
import { analyzeImage, analyzeVideo } from '../utils/api';
import Header from '../components/Header';
import TypeButton from '../components/TypeButton';

const UploadScreen = () => {
  const [loading, setLoading] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [activeTab, setActiveTab] = useState('image');
  const navigate = useNavigate();

  const { image } = useImage();

  // 예측 api 호출 핸들러
  const handlePredict = async () => {
    try {
      setLoading(true);
      if (activeTab === 'video') {
        await analyzeVideo(image[0]);
        navigate('/videoresult');
      } else {
        const { resultImage, metadata } = await analyzeImage(image[0]);
        await new Promise((res) => setTimeout(res, 2000));
        navigate('/result', {
          state: {
            image: resultImage,
            metadata: metadata
          }
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container'>
      <Header />
      <div className='body'>
        <div className='type-select-zone'>
          <TypeButton type='image' activeTab={activeTab} setActiveTab={setActiveTab} />
          <TypeButton type='video' activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <DropZone loading={loading} pressed={pressed} activeTab={activeTab} />
        <Button
          onClick={() => {
            if (image.length > 0) {
              handlePredict();
            } else {
              setPressed(true);
            }
          }}
        >
          불량 확인
        </Button>
      </div>
    </div>
  );
};

export default UploadScreen;
