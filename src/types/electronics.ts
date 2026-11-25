export type Locale = 'ar' | 'en' | 'fr';

export type ThemeMode = 'light' | 'dark';

export type ComponentCategoryId =
  | 'residential'
  | 'industrial'
  | 'electronics'
  | 'motors'
  | 'automation'
  | 'renewable'
  | 'tools';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type AudienceLevelId =
  | 'beginners'
  | 'bp_bt'
  | 'ts_lt'
  | 'engineering'
  | 'professionals';

export interface LocalizedText {
  ar: string;
  en: string;
  fr: string;
}

export interface CategoryMeta {
  id: ComponentCategoryId;
  label: LocalizedText;
  summary: LocalizedText;
  imageUrl: string;
  imageAlt: LocalizedText;
}

export interface PinDefinition {
  pin: string;
  name: LocalizedText;
  role: LocalizedText;
}

export interface SpecItem {
  label: LocalizedText;
  value: string;
  unit?: string;
}

export interface ComponentVariant {
  name: LocalizedText;
  specNote: LocalizedText;
}

export interface GalleryMediaItem {
  id: string;
  url: string;
  caption: LocalizedText;
  alt: LocalizedText;
}

export interface ReferenceSource {
  title: string;
  source: string;
  standardCode?: string;
}

export interface Model3DSpec {
  status: 'ready' | 'planned';
  format: 'glb' | 'gltf';
  lodLevels: ('LOD0' | 'LOD1' | 'LOD2')[];
  boundingBoxMm: { w: number; h: number; d: number };
  cameraPreset: {
    fov: number;
    position: [number, number, number];
    target: [number, number, number];
  };
  interactiveHotspots: {
    id: string;
    label: LocalizedText;
    position: [number, number, number];
  }[];
  assetKey: string;
}

export type ComponentArtworkId =
  // Residential
  | 'light_switch'
  | 'socket_outlet'
  | 'lamp_led'
  | 'wire_conductor'
  | 'power_cable'
  | 'mcb_breaker'
  | 'fuse'
  | 'distribution_board'
  | 'junction_box'
  | 'earthing_system'
  | 'rcd_rcbo'
  // Industrial
  | 'contactor'
  | 'relay'
  | 'thermal_overload'
  | 'industrial_timer'
  | 'push_button'
  | 'selector_switch'
  | 'limit_switch'
  | 'motor_starter'
  | 'terminal_block'
  | 'industrial_sensor'
  // Electronics
  | 'resistor'
  | 'electrolytic_capacitor'
  | 'inductor'
  | 'diode'
  | 'led'
  | 'bjt_npn'
  | 'mosfet'
  | 'thyristor'
  | 'timer_555'
  | 'regulator_7805'
  | 'logic_gate'
  | 'microcontroller'
  | 'pcb_board'
  // Electric Motors
  | 'dc_motor'
  | 'ac_motor'
  | 'single_phase_motor'
  | 'three_phase_motor'
  | 'stepper_motor'
  | 'servo_motor'
  | 'induction_motor'
  | 'synchronous_motor'
  | 'vfd_drive'
  // Automation
  | 'plc_unit'
  | 'hmi_panel'
  | 'scada_topology'
  | 'sensor_module'
  | 'rotary_encoder'
  | 'actuator_linear'
  | 'fieldbus_comm'
  // Renewable Energy
  | 'solar_panel'
  | 'solar_inverter'
  | 'battery_pack'
  | 'mppt_controller'
  | 'pwm_controller'
  | 'solar_spd'
  | 'wind_turbine'
  // Electrical Tools
  | 'multimeter'
  | 'clamp_meter'
  | 'voltage_tester'
  | 'oscilloscope'
  | 'megger_tester'
  | 'screwdriver_vde'
  | 'wire_stripper'
  | 'pliers_vde'
  | 'crimping_tool'
  | 'electric_drill'
  | 'soldering_iron'
  | 'ppe_gear';

export type WiringDiagramId =
  | 'lighting_switch_circuit'
  | 'socket_rcd_earthing'
  | 'distribution_mcb_rcd'
  | 'motor_dol_contactor'
  | 'relay_control_coil'
  | 'timer_on_delay'
  | 'resistor_led_divider'
  | 'capacitor_rc_filter'
  | 'diode_bridge_rectifier'
  | 'mosfet_low_side_driver'
  | 'voltage_regulator_7805'
  | 'mcu_gpio_sensor'
  | 'vfd_three_phase_motor'
  | 'stepper_driver_coil'
  | 'plc_io_wiring'
  | 'scada_fieldbus_network'
  | 'solar_mppt_inverter_battery'
  | 'solar_dc_protection'
  | 'multimeter_measurement'
  | 'clamp_meter_measurement'
  | 'oscilloscope_probe_test'
  | 'megger_insulation_test';

export interface ElectronicComponent {
  id: string;
  artworkId: ComponentArtworkId;
  popular?: boolean;
  nameAr: string;
  nameEn: string;
  nameFr: string;
  altNames: Record<Locale, string[]>;
  category: ComponentCategoryId;
  difficulty: DifficultyLevel;
  symbolCode: string;
  packageType: string;
  imageUrl: string;
  galleryImages: GalleryMediaItem[];
  shortDesc: LocalizedText;
  definition: LocalizedText;
  functionDesc: LocalizedText;
  howItWorks: LocalizedText;
  internalParts: Record<Locale, string[]>;
  externalParts: Record<Locale, string[]>;
  types: ComponentVariant[];
  pins: PinDefinition[];
  specs: SpecItem[];
  wiringDiagramId: WiringDiagramId;
  wiringCaption: LocalizedText;
  applications: Record<Locale, string[]>;
  commonFaults: Record<Locale, string[]>;
  testingMethods: Record<Locale, string[]>;
  safetyTips: Record<Locale, string[]>;
  relatedIds: string[];
  references: ReferenceSource[];
  model3d: Model3DSpec;
}

export interface QuizQuestion {
  id: string;
  componentId: string;
  mode: 'physical' | 'schematic' | 'function';
  prompt: LocalizedText;
  options: { id: string; label: LocalizedText; subLabel: string }[];
  correctId: string;
  explanation: LocalizedText;
}

export type QuizQuestionType =
  | 'mcq-photo'
  | 'mcq-symbol'
  | 'mcq-function'
  | 'true-false'
  | 'match-images'
  | 'match-trilingual'
  | 'mcq-calculation'
  | 'mcq-safety';

export type QuizTypeFilter =
  | 'all'
  | 'mcq'
  | 'true-false'
  | 'mcq-photo'
  | 'mcq-symbol'
  | 'mcq-function'
  | 'match-images'
  | 'match-trilingual'
  | 'mcq-calculation'
  | 'mcq-safety';

export interface QuizMcqOption {
  id: string;
  label: LocalizedText;
  subLabel?: string;
}

export interface QuizImageMatchPair {
  id: string;
  componentId: string;
  imageUrl: string;
  artworkId: ComponentArtworkId;
  label: LocalizedText;
  symbolCode: string;
}

export interface QuizTrilingualRow {
  id: string;
  componentId: string;
  symbolCode: string;
  ar: string;
  en: string;
  fr: string;
}

export interface QuizQuestionItem {
  id: string;
  type: QuizQuestionType;
  category: ComponentCategoryId | 'general';
  difficulty: DifficultyLevel;
  componentId?: string;
  visualMode?: 'photo' | 'schematic' | 'formula' | 'safety';
  imageUrl?: string;
  artworkId?: ComponentArtworkId;
  symbolCode?: string;
  formulaText?: string;
  prompt: LocalizedText;
  options?: QuizMcqOption[];
  correctOptionId?: string;
  correctBoolean?: boolean;
  imagePairs?: QuizImageMatchPair[];
  useUniqueArtwork?: boolean;
  shuffledImageOptions?: { id: string; label: LocalizedText; symbolCode: string }[];
  trilingualRows?: QuizTrilingualRow[];
  trilingualEnChoices?: string[];
  trilingualFrChoices?: string[];
  trilingualArChoices?: string[];
  explanation: LocalizedText;
}

export interface QuizConfig {
  category: ComponentCategoryId | 'all';
  difficulty: DifficultyLevel | 'all';
  questionCount: number;
  questionType: QuizTypeFilter;
}

export type QuizUserAnswer =
  | { kind: 'mcq'; selectedId: string }
  | { kind: 'true-false'; selectedBool: boolean }
  | { kind: 'match-images'; mapping: Record<string, string> }
  | {
      kind: 'match-trilingual';
      mapping: Record<string, { first: string; second: string }>;
    };

export interface QuizAnswerRecord {
  questionId: string;
  question: QuizQuestionItem;
  userAnswer: QuizUserAnswer;
  isCorrect: boolean;
  userSummary: LocalizedText;
  correctSummary: LocalizedText;
}

export interface QuizResultSummary {
  id: string;
  completedAt: string;
  score: number;
  total: number;
  percentage: number;
  category: ComponentCategoryId | 'all';
  difficulty: DifficultyLevel | 'all';
  questionType: QuizTypeFilter;
}

export type FlashcardFrontMode = 'photo' | 'schematic' | 'mixed';

export type FlashcardDeckFilter = 'all' | 'due' | 'difficult' | 'saved';

export type FlashcardRating = 'again' | 'hard' | 'good' | 'easy';

export interface FlashcardCardState {
  componentId: string;
  repetitions: number;
  intervalDays: number;
  easeFactor: number;
  nextReviewAt: number;
  lastReviewedAt: number | null;
  isDifficult: boolean;
  isSaved: boolean;
  lastRating?: FlashcardRating;
}

export type FlashcardProgressMap = Record<string, FlashcardCardState>;

export type CalculatorId =
  | 'ohms-law'
  | 'electrical-power'
  | 'energy-consumption'
  | 'electricity-cost'
  | 'resistor-color'
  | 'series-resistance'
  | 'parallel-resistance'
  | 'capacitor'
  | 'voltage-divider'
  | 'voltage-drop'
  | 'cable-size'
  | 'transformer'
  | 'motor-power'
  | 'three-phase-power'
  | 'power-factor'
  | 'solar-panel'
  | 'battery-capacity'
  | 'unit-converter';

export type CalculatorCategoryGroup =
  | 'fundamentals'
  | 'circuits'
  | 'installations'
  | 'machines'
  | 'solar'
  | 'tools';

export interface CalculatorResultMetric {
  label: LocalizedText;
  value: string;
  unit?: string;
  tone?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
}

export interface CalculatorOutput {
  valid: boolean;
  error?: LocalizedText;
  formula: string;
  metrics: CalculatorResultMetric[];
  steps: LocalizedText[];
  explanation: LocalizedText;
  assumptions: LocalizedText[];
  engineeringDisclaimer?: LocalizedText;
  diagramData?: Record<string, number | string | boolean | number[] | string[]>;
}

export type SymbolDomainId =
  | 'residential'
  | 'industrial'
  | 'electronics'
  | 'motors'
  | 'measurement'
  | 'protection'
  | 'automation'
  | 'earthing'
  | 'power-sources';

export type SymbolStandard = 'iec' | 'ansi';

export interface ElectricalSymbolItem {
  id: string;
  domain: SymbolDomainId;
  name: LocalizedText;
  functionDesc: LocalizedText;
  iecCode: string;
  ansiCode?: string;
  supportsAnsi: boolean;
  standardNote: LocalizedText;
  linkedComponentId?: string;
  svgKey: string;
}

export type WiringLibraryCategory =
  | 'lighting'
  | 'series-parallel'
  | 'dc-circuits'
  | 'control'
  | 'relays'
  | 'contactors'
  | 'motors'
  | 'electronics';

export interface WiringLibraryComponentRef {
  name: LocalizedText;
  symbolCode: string;
  componentId?: string;
}

export interface WiringLibraryItem {
  id: string;
  category: WiringLibraryCategory;
  title: LocalizedText;
  summary: LocalizedText;
  explanation: LocalizedText;
  voltageRating: string;
  standardRef: string;
  componentsUsed: WiringLibraryComponentRef[];
  symbolsUsed: string[];
  safetyPrecautions: LocalizedText[];
  svgId: string;
}

export interface GlossaryEntry {
  id: string;
  abbreviation?: string;
  term: LocalizedText;
  definition: LocalizedText;
  category: ComponentCategoryId | 'general';
  relatedComponentIds: string[];
}

export interface LearningActivityEntry {
  id: string;
  type: 'component' | 'quiz' | 'flashcard' | 'import';
  label: LocalizedText;
  detail?: string;
  timestamp: number;
}

export interface ExportedStudyData {
  version: 1;
  exportedAt: string;
  theme: ThemeMode;
  locale: Locale;
  bookmarks: string[];
  quizHistory: QuizResultSummary[];
  bestQuizScore: number;
  flashcardProgress: FlashcardProgressMap;
  studiedComponentIds: string[];
  learningLog: LearningActivityEntry[];
}

export type SortOption =
  | 'relevance'
  | 'name-asc'
  | 'name-desc'
  | 'difficulty-asc'
  | 'difficulty-desc';

export type AppPageId =
  | 'home'
  | 'components'
  | 'categories'
  | 'component-detail'
  | 'electrical-tools'
  | 'electronics'
  | 'quizzes'
  | 'flashcards'
  | 'calculators'
  | 'symbols'
  | 'wiring-diagrams'
  | 'glossary'
  | 'favorites'
  | 'progress'
  | 'virtual-lab'
  | 'safety'
  | 'about'
  | 'contact';

export interface AppRoute {
  page: AppPageId;
  componentId?: string;
  categoryId?: ComponentCategoryId;
  sectionAnchor?: string;
}

export interface SearchSuggestion {
  component: ElectronicComponent;
  score: number;
  matchedFuzzy: boolean;
}

export type LabComponentCategory =
  | 'sources'
  | 'electrical'
  | 'industrial'
  | 'electronics'
  | 'instruments';

export type LabComponentType =
  | 'battery'
  | 'dc-source'
  | 'ac-source'
  | 'current-source'
  | 'ground'
  | 'switch'
  | 'push-button'
  | 'lamp'
  | 'fuse'
  | 'circuit-breaker'
  | 'relay'
  | 'contactor'
  | 'transformer'
  | 'thermal-overload'
  | 'timer'
  | 'motor'
  | 'resistor'
  | 'potentiometer'
  | 'capacitor'
  | 'inductor'
  | 'diode'
  | 'led'
  | 'zener'
  | 'transistor'
  | 'mosfet'
  | 'logic-gate'
  | 'op-amp'
  | 'plc-unit'
  | 'voltmeter'
  | 'ammeter'
  | 'ohmmeter'
  | 'multimeter'
  | 'power-meter'
  | 'oscilloscope';

export interface LabPinSpec {
  id: string;
  label: string;
  dx: number;
  dy: number;
}

export type LabGateVariant = 'AND' | 'OR' | 'NOT' | 'NAND' | 'XOR';
export type LabLedColor = 'red' | 'green' | 'blue' | 'yellow' | 'white';
export type LabMultimeterMode = 'V_DC' | 'V_AC' | 'I_DC' | 'R_OHM';

export interface LabComponentProps {
  voltage?: number;
  frequency?: number;
  internalResistance?: number;
  current?: number;
  resistance?: number;
  wiperPercent?: number;
  capacitanceUf?: number;
  inductanceMh?: number;
  ratedVoltage?: number;
  ratedPower?: number;
  ratedCurrent?: number;
  closed?: boolean;
  momentaryNC?: boolean;
  coilVoltage?: number;
  coilResistance?: number;
  turnsRatio?: number;
  delaySeconds?: number;
  ledColor?: LabLedColor;
  forwardVoltage?: number;
  zenerVoltage?: number;
  beta?: number;
  vth?: number;
  gateType?: LabGateVariant;
  gain?: number;
  multimeterMode?: LabMultimeterMode;
  meterSeriesLoadR?: number;
}

export interface LabComponentInstance {
  id: string;
  type: LabComponentType;
  label: string;
  x: number;
  y: number;
  rotation: 0 | 90 | 180 | 270;
  props: LabComponentProps;
}

export interface LabWire {
  id: string;
  fromCompId: string;
  fromPinId: string;
  toCompId: string;
  toPinId: string;
  color?: string;
}

export interface LabLadderRung {
  id: string;
  comment: string;
  input1: string; // e.g. 'I1', 'Q1', '!I2'
  input2?: string; // optional series contact
  latchInput?: string; // optional parallel seal-in OR branch around input1
  coil: 'Q1' | 'Q2';
  timerDelaySec?: number;
}

export interface LabCircuitProject {
  id: string;
  name: string;
  description?: string;
  updatedAt: number;
  components: LabComponentInstance[];
  wires: LabWire[];
  ladderRungs: LabLadderRung[];
}

export interface LabDiagnosticMessage {
  id: string;
  severity: 'error' | 'warning' | 'info';
  code:
    | 'SHORT_CIRCUIT'
    | 'OPEN_CIRCUIT'
    | 'NO_GROUND'
    | 'UNSOLVABLE'
    | 'OVERLOAD'
    | 'OVER_CURRENT'
    | 'LIVE_OHMMETER'
    | 'FUSE_BLOWN'
    | 'BREAKER_TRIPPED'
    | 'THERMAL_TRIP'
    | 'DC_TRANSFORMER';
  componentId?: string;
  message: LocalizedText;
}

export interface LabComponentSimState {
  componentId: string;
  voltageDrop: number;
  current: number;
  power: number;
  nodeVoltages: Record<string, number>;
  energized: boolean;
  brightness: number; // 0..1 for lamp/led
  blown?: boolean;
  tripped?: boolean;
  coilActive?: boolean;
  timerRemaining?: number;
  motorRpm?: number;
  motorDir?: 'fwd' | 'rev' | 'stopped';
  overloaded?: boolean;
  meterDisplay?: string;
  meterUnit?: string;
  logicOut?: 0 | 1;
}

export interface LabWaveformSample {
  t: number;
  ch1: number;
  ch2: number;
}

export interface LabSimulationResult {
  valid: boolean;
  simTime: number;
  hasAcSource: boolean;
  hasGround: boolean;
  frequency: number;
  nodeVoltages: Record<string, number>;
  pinToNode: Record<string, string>;
  componentStates: Record<string, LabComponentSimState>;
  wireCurrents: Record<string, number>;
  diagnostics: LabDiagnosticMessage[];
  waveform: LabWaveformSample[];
  plcInputs: Record<string, boolean>;
  plcOutputs: Record<string, boolean>;
}

export interface LabTemplateQuestion {
  id: string;
  prompt: LocalizedText;
  options: LocalizedText[];
  correctIndex: number;
  explanation: LocalizedText;
}

export interface LabCircuitTemplate {
  id: string;
  category: 'dc' | 'electronics' | 'industrial' | 'digital';
  title: LocalizedText;
  objective: LocalizedText;
  theory: LocalizedText;
  expectedValues: LocalizedText[];
  requiredParts: LocalizedText[];
  components: LabComponentInstance[];
  wires: LabWire[];
  ladderRungs?: LabLadderRung[];
  questions: LabTemplateQuestion[];
}





