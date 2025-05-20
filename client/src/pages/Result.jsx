import { useNavigate } from 'react-router-dom';
import markcloud from '../assets/markcloud.png';
import Button from '../components/Button';
import { useState } from 'react';

const ResultScreen = () => {
  const navigate = useNavigate();
  const [detailPressed, setDetailPressed] = useState(false);

  const [result, setResult] = useState({
    status: false,
    percentage: 76,
    defectType: 'Scratch',
    defectPosition: {
      x: 226,
      y: 223,
      z: 227
    }
  });

  // 추론 상세 토글 핸들러
  const handleToggle = () => {
    setDetailPressed((prev) => !prev);
  };

  // @TODO : 예측 결과 불러오는 API 필요 (상태 변경 필요)

  return (
    <div className='container'>
      <header>
        <img
          src={markcloud}
          width={'145px'}
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        />
      </header>
      <div className='body'>
        {/* 추론 이후 사진 프리뷰 */}
        <div className='preview-area'>
          <div className='image-preview'>
            <img />
          </div>
        </div>

        {/* 추론 결과 버튼 */}
        <Button onClick={handleToggle} outline>
          <span>
            {' '}
            상태:{' '}
            <span className={result.status ? 'status-ok' : 'status-bad'}>
              {result.status ? '정상' : '불량'}
            </span>{' '}
            (Predicted: {result.status ? 'OK' : 'Defective'})
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
                  <span className={result.status ? 'status-ok' : 'status-bad'}>
                    {result.status ? '정상' : '불량'}
                  </span>{' '}
                  ({result.status ? 'OK' : 'Defective'})
                </span>
              </li>
              <li>판별 확률: {result.percentage}%</li>
              <li>불량 유형: {result.defectType}</li>
              <li>
                불량 위치: ({result.defectPosition.x},{result.defectPosition.y},
                {result.defectPosition.z})
              </li>
            </ul>
          </div>
        )}
        <Button onClick={() => navigate('/')}>다시하기</Button>
      </div>
    </div>
  );
};

export default ResultScreen;
