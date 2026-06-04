import { EffectComposer, Bloom, Vignette, SSAO } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

/**
 * Pipeline de post-processing (photoréalisme / ambiance).
 *  - Bloom : halos des torches / émissifs (le tone mapping ACES est déjà le
 *    défaut du renderer R3F) ;
 *  - Vignette : assombrit les bords pour l'ambiance crypte ;
 *  - SSAO : occlusion de contact — désactivé par défaut (`ao`) car je ne peux
 *    pas le valider visuellement ici ; activable d'un prop.
 *
 * PERF : un seul EffectComposer ; mipmapBlur pour un Bloom performant.
 */
export default function PostFX({ ao = false }) {
  return (
    <EffectComposer disableNormalPass={!ao} multisampling={4}>
      {ao ? (
        <SSAO
          blendFunction={BlendFunction.MULTIPLY}
          samples={16}
          radius={0.25}
          intensity={18}
          luminanceInfluence={0.6}
          color="black"
        />
      ) : null}
      <Bloom intensity={0.9} luminanceThreshold={0.2} luminanceSmoothing={0.3} mipmapBlur />
      <Vignette offset={0.25} darkness={0.85} eskil={false} />
    </EffectComposer>
  )
}
