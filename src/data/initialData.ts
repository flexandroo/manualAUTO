import type { InstructionData } from '../types/instruction';
import { BLOCK_REGISTRY } from '../blocks/registry';
import { newId } from '../utils/id';

// Default new instruction: Cover + Safety + Text(Призначення) + Installation + Warranty.
// This matches the canonical TERMOJET spine identified in the analysis.
export function makeInitialData(): InstructionData {
  const cover = BLOCK_REGISTRY.cover.createNew();
  const safety = BLOCK_REGISTRY.safety.createNew();
  const purpose = BLOCK_REGISTRY.text.createNew();
  purpose.heading = 'Призначення';

  const install = BLOCK_REGISTRY.installationSteps.createNew();
  const warranty = BLOCK_REGISTRY.warranty.createNew();

  return {
    productName: cover.productName,
    blocks: [cover, safety, purpose, install, warranty].map((b) => ({
      ...b,
      id: b.id || newId(),
    })),
  };
}

export const initialData: InstructionData = makeInitialData();
