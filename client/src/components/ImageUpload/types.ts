export interface ImageUploadProps {
  endpoint: string;
  pixelRatio?: number;
  onCroppingFinished?: Function;
}

export interface WorkerConversionReturn {
  result: string;
}
