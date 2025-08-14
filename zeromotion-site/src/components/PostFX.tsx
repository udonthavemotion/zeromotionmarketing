// @ts-nocheck
import * as React from "react";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

type Props = { intensity: number };

const PostFX: React.FC<Props> = ({ intensity }) => {
  return (
    <EffectComposer enableNormalPass={false} multisampling={0}>
      <Bloom
        intensity={0.55 * intensity}
        luminanceThreshold={0.24}
        luminanceSmoothing={0.14}
      />
      <Vignette eskil={false} offset={0.18} darkness={0.48} />
    </EffectComposer>
  );
};

export default PostFX;
