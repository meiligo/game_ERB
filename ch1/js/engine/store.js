// js/store.js
export class Store {
  constructor() {
    this.inventory = [];
    this.log = [];
    this.flags = new Map();

    this.flags.set("playerName", "PLAYER");

    this.flags.set("phase", "surface");
  }

    // ✅ [추가] prefix로 플래그 삭제
  deleteFlagsByPrefix(prefix) {
    for (const k of Array.from(this.flags.keys())) {
      if (String(k).startsWith(prefix)) this.flags.delete(k);
    }
  }

  // ✅ [추가] 특정 id 목록에 해당하는 인벤토리 아이템 제거
  removeItemsByIds(ids) {
    const set = new Set(ids);
    this.inventory = (this.inventory ?? []).filter(it => !set.has(it.id));
  }

  // ✅ [추가] 목숨(기회) 관련 공통
  setLives(key, n) { this.setFlag(key, n); }
  getLives(key, fallback = 3) { return this.getFlag(key, fallback); }
  decLives(key) {
    const v = this.getLives(key, 3) - 1;
    this.setLives(key, v);
    return v;
  }

  addLog(speaker, text) { this.log.push({ speaker, text }); }

  addItem(item) {
    if (this.inventory.some(it => it.id === item.id)) return false;
    this.inventory.push(item);
    return true;
  }

  // ✅ 추가: 인벤토리 초기화
  clearInventory() {
    this.inventory = [];
  }

  // ✅ 추가: 플래그 prefix로 삭제(조사 관련 초기화용)
  clearFlagsByPrefix(prefix) {
    for (const k of Array.from(this.flags.keys())) {
      if (typeof k === "string" && k.startsWith(prefix)) {
        this.flags.delete(k);
      }
    }
  }

  setFlag(key, val = true) { this.flags.set(key, val); }
  getFlag(key, fallback = false) { return this.flags.has(key) ? this.flags.get(key) : fallback; }

  // ✅ 특정 조건의 아이템을 인벤토리에서 제거
  removeItems(whereFn) {
    this.inventory = (this.inventory ?? []).filter(it => !whereFn(it));
    this.save?.();
  }

  // ✅ layer 값으로 제거 (L1/L2 등)
  removeItemsByLayer(layer) {
    this.removeItems(it => it?.layer === layer);
  }

}
