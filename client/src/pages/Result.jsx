import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { useState } from 'react';
import { useImage } from '../context/ImageContext';
import Header from '../components/Header';

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

  // base64 이미지 다운로드 핸들러
  const handleDownload = (base64Data, filename = 'image.jpg') => {
    const link = document.createElement('a');
    link.href = `data:image/jpeg;base64,${base64Data}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className='container'>
      <Header />
      <div className='body'>
        {/* 추론 이후 사진 프리뷰 */}
        <div className='preview-area'>
          <div className='image-preview'>
            <img
              src={`data:image/jpeg;base64,${image}`}
              alt='preview'
              style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* 추론 결과 버튼 */}
        <Button onClick={handleToggle} outline detailPressed={detailPressed}>
          <span>
            {' '}
            상태:{' '}
            <span className={metadata.status ? 'status-bad' : 'status-ok'}>
              {metadata.status ? '불량' : '정상'}
            </span>{' '}
            (Predicted: {metadata.status ? 'Defective' : 'OK'})
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
                  <span className={metadata.status ? 'status-bad' : 'status-ok'}>
                    {metadata.status ? '불량' : '정상'}
                  </span>{' '}
                  ({metadata.status ? 'Defective' : 'OK'})
                </span>
              </li>
              <li>판별 확률: {metadata.percentage}%</li>
              <li style={{ cursor: 'pointer' }}>
                <span
                  onClick={() => handleDownload(image)}
                  style={{ color: 'blue', textDecoration: 'underline' }}
                >
                  파일 다운로드
                </span>
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
