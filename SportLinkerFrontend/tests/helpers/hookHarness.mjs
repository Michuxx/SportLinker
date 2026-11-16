const equal = (a, b) => a && b && a.length === b.length && a.every((value, i) => Object.is(value, b[i]));

export const createHookHarness = () => {
  const slots = [];
  let index = 0;
  let effects = [];
  let dirty = true;
  const harness = {
    result: null,
    render: null,
    react: {
      useRef(value) {
        const i = index++;
        return slots[i] ??= { current: value };
      },
      useReducer(reducer, value, init) {
        const i = index++;
        const slot = slots[i] ??= { value: init ? init(value) : value };
        slot.dispatch ??= (action) => { slot.value = reducer(slot.value, action); dirty = true; };
        return [slot.value, slot.dispatch];
      },
      useCallback(callback, deps) {
        const i = index++;
        if (!equal(slots[i]?.deps, deps)) slots[i] = { value: callback, deps };
        return slots[i].value;
      },
      useEffect(effect, deps) {
        const i = index++;
        if (!equal(slots[i]?.deps, deps)) {
          const old = slots[i];
          slots[i] = { deps, cleanup: old?.cleanup };
          effects.push(() => { old?.cleanup?.(); slots[i].cleanup = effect(); });
        }
      },
    },
    async flush() {
      for (let i = 0; i < 30; i++) {
        if (dirty) {
          dirty = false; index = 0; effects = [];
          harness.result = harness.render();
          effects.forEach((effect) => effect());
        }
        await Promise.resolve();
      }
      if (dirty) throw new Error("Hook did not settle");
    },
    invalidate() { dirty = true; },
    dispose() { slots.forEach((slot) => slot?.cleanup?.()); },
  };
  return harness;
};
