import { Composition } from 'remotion';
import { BaselineAnimation } from './BaselineAnimation';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BaselineTest"
        component={BaselineAnimation}
        durationInFrames={360} // Extended to 6 seconds
        fps={60}
        width={1920}
        height={1080}
      />
    </>
  );
};
