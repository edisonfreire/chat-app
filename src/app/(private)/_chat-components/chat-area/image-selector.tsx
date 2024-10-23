import { Modal, Upload } from 'antd';
import React from 'react'

function ImageSelector({
  showImageSelector,
  setShowImageSelector,
  selectedImageFile,
  setSelectedImageFile,
  onSend,
  loading,
}: {
  showImageSelector: boolean;
  setShowImageSelector: React.Dispatch<React.SetStateAction<boolean>>;
  selectedImageFile: File | null;
  setSelectedImageFile: React.Dispatch<React.SetStateAction<File | null>>;
  onSend: () => void;
  loading: boolean;
}) {
  return (
    <Modal
      open={showImageSelector}
      onCancel={() => setShowImageSelector(false)}
      title={
        <span className='text-xl font-semibold text-center text-primary'>
          Select an image
        </span>
      }
      centered
      okText='Send'
      okButtonProps={{ disabled: !selectedImageFile, loading }}
      onOk={onSend}
    >
      <Upload
        beforeUpload={(file) => {
          setSelectedImageFile(file);
          return false;
        }}
        className='cursor-pointer'
        listType={'picture-card'}
        maxCount={1}
        accept='image/*'
      >
        Click here to select an image
      </Upload>
    </Modal>
  )
}

export default ImageSelector