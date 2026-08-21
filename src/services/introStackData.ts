export interface IntroStackItem {
  id: string;
  delayMs: number;
  initialX: number;
  initialY: number;
  targetX: number;
  targetY: number;
  rotation: number;
  width: string;
  height: string;
  zIndex: number;
  photo: {
    src: string;
    fallbackSrc: string;
    title: string;
  };
}

export const INTRO_STACK_ITEMS: IntroStackItem[] = [];
