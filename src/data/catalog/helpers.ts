import { CATEGORY_IMAGES } from '../categories';
import type {
  ComponentCategoryId,
  GalleryMediaItem,
  LocalizedText,
  Model3DSpec,
} from '../../types/electronics';

export function makeGallery(
  id: string,
  category: ComponentCategoryId,
  name: LocalizedText
): GalleryMediaItem[] {
  const primaryPhoto = CATEGORY_IMAGES[category];
  const secondaryPhoto =
    category === 'electronics' || category === 'tools'
      ? CATEGORY_IMAGES.workbench
      : category === 'residential'
        ? CATEGORY_IMAGES.industrial
        : CATEGORY_IMAGES.tools;

  return [
    {
      id: `${id}-main`,
      url: primaryPhoto,
      caption: {
        ar: `بيئة العمل الواقعية لمكونات ${name.ar}`,
        en: `Real-world studio context for ${name.en}`,
        fr: `Vue studio réelle pour ${name.fr}`,
      },
      alt: {
        ar: `${name.ar} — صورة مرجعية عالية الدقة`,
        en: `${name.en} — studio hardware reference photo`,
        fr: `${name.fr} — photo de référence en studio`,
      },
    },
    {
      id: `${id}-bench`,
      url: secondaryPhoto,
      caption: {
        ar: `تجهيز الفحص والتوصيل المخبري لـ ${name.ar}`,
        en: `Bench testing & installation setup for ${name.en}`,
        fr: `Banc de test et installation pour ${name.fr}`,
      },
      alt: {
        ar: `منصة اختبار ${name.ar}`,
        en: `${name.en} testing and bench environment`,
        fr: `Environnement de test pour ${name.fr}`,
      },
    },
  ];
}

export function makeModel3D(
  id: string,
  w: number,
  h: number,
  d: number,
  hotspot1: LocalizedText,
  hotspot2: LocalizedText
): Model3DSpec {
  return {
    status: 'planned',
    format: 'glb',
    lodLevels: ['LOD0', 'LOD1', 'LOD2'],
    boundingBoxMm: { w, h, d },
    cameraPreset: {
      fov: 40,
      position: [1.6, 1.15, 1.85],
      target: [0, 0, 0],
    },
    interactiveHotspots: [
      { id: `${id}-hs-1`, label: hotspot1, position: [0.3, 0.25, 0.2] },
      { id: `${id}-hs-2`, label: hotspot2, position: [-0.3, -0.2, 0.15] },
    ],
    assetKey: `models/components/${id}.glb`,
  };
}
