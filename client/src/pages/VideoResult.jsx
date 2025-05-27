import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { useImage } from '../context/ImageContext';
import Header from '../components/Header';
import { useState } from 'react';

const VideoResultScreen = () => {
  const navigate = useNavigate();
  const { image, setImage } = useImage();
  const [detailPressed, setDetailPressed] = useState(false);

  // 데이터 없을 경우
  if (image[0] === undefined) {
    return (
      <div className='body'>
        <p>데이터가 없습니다. 메인 페이지로 돌아가세요.</p>
        <Button
          onClick={() => {
            setImage([]);
            navigate('/');
          }}
        >
          메인으로
        </Button>
      </div>
    );
  }

  // 추론 상세 토글 핸들러
  const handleToggle = () => {
    setDetailPressed((prev) => !prev);
  };

  return (
    <div className='container'>
      <Header />
      <div className='body-full'>
        {/* 추론 이후 사진 프리뷰 */}
        <div className='preview-area'>
          <div className='image-preview'>
            <img
              src='http://localhost:8000/predict/stream'
              alt='video stream'
              width='100%'
              style={{ maxHeight: '400px', borderRadius: '10px' }}
            />
          </div>
        </div>
        {/* 추론 결과 필드 */}
        <div className='video-result-field'>
          {/* 추론 결과 버튼 */}
          <Button onClick={handleToggle} outline detailPressed={detailPressed}>
            <span>
              {' '}
              상태: <span className={'status-ok'}>정상</span> (시간: 3분 31초)
            </span>
          </Button>

          {/* 추론 상세 정보 토글 */}
          {detailPressed && (
            <div className='detail'>
              <span>추론결과</span>
              <ul>
                <li>불량 감지 개수: 4개</li>
                <li>정상 판정 확률: 99.7%</li>
                <li>영상 다운로드</li>
              </ul>
            </div>
          )}
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
    </div>
  );
};

export default VideoResultScreen;
