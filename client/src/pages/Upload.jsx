import { useState } from 'react';
import markcloud from '../assets/markcloud.png';
import DropZone from '../components/DropZone';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

const UploadScreen = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 예측 처리 흉내: 2초 대기
  const handlePredict = async () => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 2000));
    setLoading(false);
    navigate('/result');
  };

  return (
    <div className='container'>
      <header>
        <img
          src={markcloud}
          width={'130px'}
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        />
      </header>
      <div className='body'>
        <DropZone loading={loading} />
        <Button onClick={handlePredict}>불량 확인</Button>
      </div>
    </div>
  );
};

export default UploadScreen;
