import { Composition } from 'remotion';
import { BaselineAnimation } from './BaselineAnimation';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BaselineTest"
        component={BaselineAnimation}
        durationInFrames={300} // 5 seconds at 60fps
        fps={60}
        width={1920}
        height={1080}
      />
    </>
  );
};
