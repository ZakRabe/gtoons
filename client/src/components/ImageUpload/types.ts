export interface ImageUploadProps {
  endpoint: string;
  maxWidth?: number;
  maxHeight?: number;
  pixelRatio?: number;
  onCroppingFinished?: Function;
}

export interface WorkerConversionReturn {
  result: string;
}
