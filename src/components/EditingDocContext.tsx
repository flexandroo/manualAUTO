import { createContext, useContext, type ReactNode } from 'react';
import type { InstructionData } from '../types/instruction';

interface Value {
  doc: InstructionData;
  setDoc: (next: InstructionData) => void;
}

const Ctx = createContext<Value | null>(null);

export function EditingDocProvider({
  value,
  children,
}: {
  value: Value;
  children: ReactNode;
}) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useEditingDoc(): Value {
  const v = useContext(Ctx);
  if (!v) {
    // Outside an EditingDocProvider — return a no-op so previews
    // (which never edit, only read) don't crash. Editors that need
    // doc editing must be wrapped.
    return { doc: {} as InstructionData, setDoc: () => {} };
  }
  return v;
}
