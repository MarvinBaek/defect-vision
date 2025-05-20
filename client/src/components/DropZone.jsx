import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import ic_download from '../assets/ic_download.svg';

const DropZone = ({ loading }) => {
  const [images, setImages] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    const previewFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
    );
    setImages(previewFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  return (
    <div>
      {images.length === 0 && !loading && (
        <div className={`dropzone ${isDragActive ? 'dropzone-active' : ''}`} {...getRootProps()}>
          <input {...getInputProps()} />
          <div className='dropzone-content'>
            <img src={ic_download} />
            <p>{isDragActive ? '파일을 놓으세요!' : '파일을 드래그하거나 클릭해서 업로드하세요'}</p>
          </div>
        </div>
      )}
      {images.length > 0 && !loading && (
        <div className='preview-area'>
          {images.map((file, index) => (
            <div key={index} className='image-preview'>
              <img src={file.preview} alt='preview' />
            </div>
          ))}
        </div>
      )}
      {loading && (
        <div className='loading-container'>
          <div className='skeleton-box'></div>
        </div>
      )}
    </div>
  );
};

export default DropZone;
