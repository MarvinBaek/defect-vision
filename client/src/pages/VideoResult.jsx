import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { useImage } from '../context/ImageContext';
import Header from '../components/Header';

const VideoResultScreen = () => {
  const navigate = useNavigate();
  const { setImage } = useImage();

  return (
    <div className='container'>
      <Header />
      <div className='body'>
        {/* 추론 이후 사진 프리뷰 */}
        <div className='preview-area'>
          <div className='image-preview'>
            <img
              src='http://localhost:8000/predict/stream'
              alt='video stream'
              width='100%'
              style={{ maxHeight: '300px', borderRadius: '10px' }}
            />
          </div>
        </div>

        <Button
          onClick={() => {
            setImage([]);
            navigate('/');
          }}
        >
          다시하기
        </Button>
      </div>
    </div>
  );
};

export default VideoResultScreen;
