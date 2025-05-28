import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { useImage } from '../context/ImageContext';
import Header from '../components/Header';
import { useEffect, useState } from 'react';
import { getAnalyzedVideoFile, getAnalyzeStatus } from '../utils/api';

const VideoResultScreen = () => {
  const navigate = useNavigate();
  const { image, setImage } = useImage();
  const [detailPressed, setDetailPressed] = useState(false);
  const [done, setDone] = useState(false);
  const [statusLog, setStatusLog] = useState([]);
  const [analyzedVideo, setAnalyzedVideo] = useState(null);

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

  useEffect(() => {
    let timeout;
    let attempts = 0; // ✅ polling 시도 횟수 카운터

    const pollStatus = async () => {
      if (attempts >= 50) {
        console.warn('⛔ 최대 polling 횟수 초과: 분석 중단');
        return;
      }

      attempts++;

      try {
        const data = await getAnalyzeStatus();

        console.log(`[${attempts}회] 분석 상태:`, data.done);

        if (data.done === true) {
          const videoFile = await getAnalyzedVideoFile();
          setAnalyzedVideo(videoFile);
          setStatusLog(data.logs);
          setDone(true);
          console.log('✅ 분석 완료!');
        } else {
          timeout = setTimeout(pollStatus, 2000); // 2초 후 재시도
        }
      } catch (err) {
        console.error('분석 상태 확인 중 오류:', err);
        timeout = setTimeout(pollStatus, 5000); // 에러 시 5초 후 재시도
      }
    };

    pollStatus();

    return () => clearTimeout(timeout); // 컴포넌트 언마운트 시 polling 정리
  }, []);

  return (
    <div className='container'>
      <Header />
      <div className='body-full'>
        {/* 추론 이후 사진 프리뷰 */}
        <div className='preview-area'>
          <div className='image-preview'>
            {!done ? (
              <img
                src={`http://localhost:8000/stream/cctv_video?filename=${image[0]}`}
                alt='video stream'
                width='100%'
              />
            ) : (
              <video
                src={analyzedVideo}
                controls
                width='100%'
                style={{ maxHeight: '400px', borderRadius: '10px' }}
              />
            )}
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
                <li>{statusLog.length}</li>
                <li>{statusLog[0]}</li>
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
