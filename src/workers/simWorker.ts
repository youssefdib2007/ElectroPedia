import {
  simulateLabCircuit,
  type LabPersistentSimState,
} from '../utils/labEngine';
import type { LabCircuitProject, LabSimulationResult } from '../types/electronics';

export interface SimWorkerRequest {
  requestId: number;
  project: LabCircuitProject;
  simState: LabPersistentSimState;
  dt: number;
}

export interface SimWorkerResponse {
  requestId: number;
  result: LabSimulationResult;
  nextState: LabPersistentSimState;
}

self.onmessage = (event: MessageEvent<SimWorkerRequest>) => {
  const { requestId, project, simState, dt } = event.data;
  const { result, nextState } = simulateLabCircuit(project, simState, dt);
  const payload: SimWorkerResponse = { requestId, result, nextState };
  self.postMessage(payload);
};
