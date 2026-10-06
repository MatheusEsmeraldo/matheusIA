import type { MapService } from '../contracts';
import { ServiceError } from '../errors';
import { mockMaps } from './data/maps';
import { simulateNetwork } from './mockRuntime';

/** MOCK — implementação local do MapService. */
export const mockMapService: MapService = {
  async getMaps() {
    await simulateNetwork();
    return [...mockMaps].sort((a, b) => a.order - b.order);
  },
  async getMapById(id) {
    await simulateNetwork();
    const m = mockMaps.find((x) => x.id === id || x.slug === id);
    if (!m) throw new ServiceError('NOT_FOUND', `Mapa ${id} não encontrado.`, 404);
    return m;
  },
};
