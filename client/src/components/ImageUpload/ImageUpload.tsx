import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { ImageUploadProps, WorkerConversionReturn } from './types';

const ImageUpload: React.FunctionComponent<ImageUploadProps> = (props) => {
  const { endpoint } = props;

  const [uploadImg, setUploadImg] = useState<string>('');
  const imgRef = useRef<HTMLImageElement | null>(null);
  const prevCanvasRef = useRef<HTMLCanvasElement>(null);
  const [crop, setCrop] = useState<Crop>({ unit: '%', aspect: 16 / 9 });
  const [completedCrop, setCompletedCrop] = useState<Crop>();
  const [working, setWorking] = useState<boolean>(false);
  const worker = new Worker(`${process.env.PUBLIC_URL}/CanvasExport.js`);

  useEffect(() => {
    worker.addEventListener('message', handleFinishedGet);

    return () => {
      worker.removeEventListener('message', handleFinishedGet);
    };
  }, []);

  useEffect(() => {
    const image = imgRef.current;
    const canvas = prevCanvasRef.current;
    const lastCrop = completedCrop;
    const pixelRatio = props.pixelRatio || 4;

    // Typescript is stupid sometimes. Apparently checking the current ref is not good enough
    if (!lastCrop || !canvas || !image || lastCrop.width === 0) {
      return;
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Error creating context');
    }

    // @ts-ignore: This is checked after allocation
    canvas.width = lastCrop.width * pixelRatio;
    // @ts-ignore
    canvas.height = lastCrop.height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingEnabled = false;

    console.log(lastCrop, scaleX, scaleY);
    ctx.drawImage(
      image,
      // @ts-ignore
      lastCrop.x * scaleX,
      // @ts-ignore
      lastCrop.y * scaleY,
      // @ts-ignore
      lastCrop.width * scaleX,
      // @ts-ignore
      lastCrop.height * scaleY,
      0,
      0,
      // @ts-ignore
      lastCrop.width,
      // @ts-ignore
      lastCrop.height
    );
  }, [completedCrop]);

  const handleFinishedGet = (event: MessageEvent) => {
    if (props.onCroppingFinished) {
      props.onCroppingFinished(event.data.result);
    }
  };

  const onSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        setUploadImg(reader.result as string)
      );
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const onLoad = useCallback((img) => {
    console.log(img);
    imgRef.current = img;
  }, []);

  return (
    <div>
      <div>
        <input type="file" accept="image/*" onChange={onSelectFile} />
      </div>
      <ReactCrop
        src={uploadImg}
        onImageLoaded={onLoad}
        crop={crop}
        onChange={(c) => setCrop(c)}
        onComplete={(c) => setCompletedCrop(c)}
      />
      <div>
        <canvas
          ref={prevCanvasRef}
          style={{
            width: completedCrop ? completedCrop.width : 0, // Not sure about chain operator support
            height: completedCrop ? completedCrop.height : 0,
          }}
        />
      </div>
    </div>
  );
};

export default ImageUpload;
