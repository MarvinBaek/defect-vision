import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import ic_download from '../assets/ic_download.svg';
import { useImage } from '../context/ImageContext';

const DropZone = ({ loading, pressed }) => {
  const { image, setImage } = useImage();

  const onDrop = useCallback((acceptedFiles) => {
    const previewFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
    );
    setImage(previewFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
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
      {/* 업로드된 이미지 파일 미리보기 */}
      {image.length > 0 && !loading && (
        <div className='preview-area'>
          {image.map((file, index) => (
            <div key={index} className='image-preview'>
              <img src={file.preview} alt='preview' />
            </div>
          ))}
        </div>
      )}
      {/* 로딩시 스켈레톤 로딩 페이지 */}
      {loading && (
        <div className='loading-container'>
          <div className='skeleton-box'></div>
        </div>
      )}
    </div>
  );
};

export default DropZone;
