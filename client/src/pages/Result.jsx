import { useLocation, useNavigate } from 'react-router-dom';
import markcloud from '../assets/markcloud.png';
import Button from '../components/Button';
import { useState } from 'react';
import { useImage } from '../context/ImageContext';

const ResultScreen = () => {
  const navigate = useNavigate();
  const [detailPressed, setDetailPressed] = useState(false);
  const { setImage } = useImage();
  const location = useLocation();
  const { image, metadata } = location.state || {};

  // 데이터 없을 경우
  if (!image || !metadata) {
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
        {/* 추론 이후 사진 프리뷰 */}
        <div className='preview-area'>
          <div className='image-preview'>
            <img
              src={typeof image === 'string' ? image : URL.createObjectURL(image)}
              alt='preview'
            />
          </div>
        </div>

        {/* 추론 결과 버튼 */}
        <Button onClick={handleToggle} outline>
          <span>
            {' '}
            상태:{' '}
            <span className={metadata.status ? 'status-ok' : 'status-bad'}>
              {metadata.status ? '정상' : '불량'}
            </span>{' '}
            (Predicted: {metadata.status ? 'OK' : 'Defective'})
          </span>
        </Button>

        {/* 추론 결과 상세 */}
        {detailPressed && (
          <div className='detail'>
            <span>추론결과</span>
            <ul>
              <li>
                {' '}
                <span>
                  {' '}
                  판별 결과:{' '}
                  <span className={metadata.status ? 'status-ok' : 'status-bad'}>
                    {metadata.status ? '정상' : '불량'}
                  </span>{' '}
                  ({metadata.status ? 'OK' : 'Defective'})
                </span>
              </li>
              <li>판별 확률: {metadata.percentage}%</li>
              <li>불량 유형: {metadata.defectType}</li>
              <li>
                불량 위치: ({metadata.defectPosition.x},{metadata.defectPosition.y},
                {metadata.defectPosition.z})
              </li>
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
  );
};

export default ResultScreen;
