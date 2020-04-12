export interface ColorButtonProps {
  color: string;
  onClick: (e: React.MouseEvent) => void;
}

export interface ColorButtonState {
  active: boolean;
}
