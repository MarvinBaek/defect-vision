import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import ic_download from '../assets/ic_download.svg';
import { useImage } from '../context/ImageContext';
import LoadingSkeleton from './LoadingSkeleton';

const DropZone = ({ loading, pressed, activeTab }) => {
  const { image, setImage } = useImage();
  const acceptTypes = activeTab === 'image' ? { 'image/*': [] } : { 'video/*': [] };

  // 이미지 파일 드롭 시 미리보기 URL 생성 후 상태에 저장
  const onDrop = useCallback((acceptedFiles) => {
    const previewFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file) // 브라우저 전용 미리보기용 blob URL 생성
      })
    );
    setImage(previewFiles); // Context에 이미지 배열 저장 (단일 파일도 배열 형태)
  }, []);

  // react-dropzone 설정: 이미지 파일만 허용, 단일 파일만 드래그 가능
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptTypes,
    multiple: false // 단일 파일만 허용
  });

  return (
    <div>
      {/* 파일 업로드, 드래그앤드랍 박스 */}
      {image.length === 0 && !loading && (
        <div
          className={`dropzone ${isDragActive ? 'dropzone-active' : ''} ${
            pressed ? 'dropzone-block' : ''
          }`}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <div className='dropzone-content'>
            <img src={ic_download} />
            <p>{isDragActive ? '파일을 놓으세요!' : '파일을 드래그하거나 클릭해서 업로드하세요'}</p>
          </div>
        </div>
      )}
      {/* 업로드 후 이미지 또는 영상 미리보기 */}
      {image.length > 0 && !loading && (
        <div className='preview-area'>
          {image.map((file, index) => (
            <div key={index} className='image-preview'>
              {file.type.startsWith('image/') ? (
                <img src={file.preview} alt='preview' />
              ) : file.type.startsWith('video/') ? (
                <video
                  src={file.preview}
                  controls
                  width='100%'
                  style={{ maxHeight: '400px', borderRadius: '10px' }}
                />
              ) : (
                <p>지원하지 않는 파일 형식입니다</p>
              )}
            </div>
          ))}
        </div>
      )}
      {/* 로딩시 스켈레톤 로딩 페이지 */}
      {loading && <LoadingSkeleton />}
    </div>
  );
};

export default DropZone;
