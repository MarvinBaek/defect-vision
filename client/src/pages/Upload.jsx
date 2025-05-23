import { useState } from 'react';
import markcloud from '../assets/markcloud.png';
import DropZone from '../components/DropZone';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { useImage } from '../context/ImageContext';
import { analyzeImage } from '../utils/api';

const UploadScreen = () => {
  const [loading, setLoading] = useState(false);
  const [pressed, setPressed] = useState(false);
  const navigate = useNavigate();

  const { image, setImage } = useImage();

  // 예측 api 호출 핸들러
  const handlePredict = async () => {
    try {
      setLoading(true);
      const { resultImage, metadata } = await analyzeImage(image[0]);
      await new Promise((res) => setTimeout(res, 2000));

      // 변수 변경 필요
      navigate('/result', {
        state: {
          image: resultImage,
          metadata: metadata
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container'>
      <header>
        <img
          src={markcloud}
          width={'130px'}
          onClick={() => {
            setImage([]);
            navigate('/');
          }}
          style={{ cursor: 'pointer' }}
        />
      </header>
      <div className='body'>
        <DropZone loading={loading} pressed={pressed} />
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
