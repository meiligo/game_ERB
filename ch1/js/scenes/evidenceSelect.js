export async function selectEvidence(ui, store, expectedId, ownerName = "소장") {
  const playerName = store.getFlag("playerName", "PLAYER");

  while (true) {
    await ui.say("SYSTEM (AI 에코)", "(인벤토리에서 증거를 선택하시오)", { wait: false });

    // ✅ 인벤 카드 클릭 대기
    const picked = await ui.waitInventoryPick();

    if (!picked) {
      await ui.say(playerName, "…인벤토리에 증거가 없어.", { noLog: true });
      continue;
    }

    if (picked === expectedId) return picked;

    await ui.say(ownerName, "너 지금 무슨 소리 하는 거냐?", { noLog: true });
    await ui.say(playerName, "…이게 아닌가…", { noLog: true });
  }
}

export async function selectTwoEvidenceAnyOrder(ui, store, requiredIds, ownerName = "소장") {
  const need = new Set(requiredIds);
  const picked = new Set();
  const playerName = store.getFlag("playerName", "PLAYER");

  while (picked.size < requiredIds.length) {
    await ui.say("SYSTEM (AI 에코)", "(인벤토리에서 증거를 선택하시오)", { wait: false });

    const id = await ui.waitInventoryPick(); // ✅ 인벤 클릭 대기

    if (!id) {
      await ui.say(playerName, "…인벤토리에 증거가 없어.", { noLog: true, wait: false });
      continue;
    }

    if (picked.has(id)) {
      await ui.say("SYSTEM (AI 에코)", "이미 제시한 증거입니다. 다른 증거를 선택하십시오.", { wait: false });
      continue;
    }

    if (!need.has(id)) {
      await ui.say(ownerName, "너 지금 무슨 소리 하는 거냐?", { noLog: true, wait: false });
      await ui.say(playerName, "…이게 아닌가…", { noLog: true, wait: false });
      continue;
    }

    picked.add(id);

    const it = (store.inventory ?? []).find(x => x.id === id);
    const shownName = it?.title ?? id;
    await ui.say("SYSTEM (AI 에코)", `(${shownName}을(를) 보여주었다)`, { wait: false });
  }

  return true;
}

