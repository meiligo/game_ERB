import { SceneManager } from "./engine/sceneManager.js";
import { UI } from "./engine/ui.js";
import { Store } from "./engine/store.js";
import { fitAppToViewport } from "./engine/fit.js";

import { S00_Title } from "./scenes/S00_title.js";
import { S01_Intro } from "./scenes/S01_intro.js";
import { S02_InvestigationLayer1 } from "./scenes/S02_investigation_layer1.js";
import { S03_Checkpoint } from "./scenes/S03_checkpoint.js";

import { S04_GateHub } from "./scenes/S04_GateHub.js";
import { S04_Heung } from "./scenes/S04_room_heung.js";
import { S04_Chemaeon } from "./scenes/S04_room_chemaeon.js";
import { S04_Han } from "./scenes/S04_room_han.js";
import { S04_Jeong } from "./scenes/S04_room_jeong.js";
import { S04_Ogi } from "./scenes/S04_room_ogi.js";


import { S05_DataMismatch } from "./scenes/S05_DataMismatch.js";
import { S06_DeepDiveLayer2 } from "./scenes/S06_DeepDiveLayer2.js";
import { S07_Reconstruction } from "./scenes/S07_Reconstruction.js";

import { S08_Heung } from "./scenes/S08_room_heung.js";
import { S08_Chemaeon } from "./scenes/S08_room_chemaeon.js";
import { S08_Han } from "./scenes/S08_room_han.js";

import { S09_MainHall_Taeguk } from "./scenes/S09_MainHall_Taeguk.js";
import { S10_Epilogue } from "./scenes/S10_Epilogue.js";

const BASE_W = 1280 + 220;
const BASE_H = 1080;

function applyFit() {
  fitAppToViewport({ baseW: BASE_W, baseH: BASE_H });
}
window.addEventListener("resize", applyFit);
applyFit();

const store = new Store();
const ui = new UI(store);
ui.bindGlobalButtons();

const scenes = new SceneManager({ ui, store });
scenes.register("S00", S00_Title);
scenes.register("S01", S01_Intro);
scenes.register("S02", S02_InvestigationLayer1);
scenes.register("S03", S03_Checkpoint);

scenes.register("S04", S04_GateHub);
scenes.register("S04_Heung", S04_Heung);
scenes.register("S04_Chemaeon", S04_Chemaeon);
scenes.register("S04_Han", S04_Han);
scenes.register("S04_Jeong", S04_Jeong);
scenes.register("S04_Ogi", S04_Ogi);


scenes.register("S05", S05_DataMismatch);
scenes.register("S06", S06_DeepDiveLayer2);
scenes.register("S07", S07_Reconstruction);

scenes.register("S08_Heung", S08_Heung);
scenes.register("S08_Chemaeon", S08_Chemaeon);
scenes.register("S08_Han", S08_Han);

scenes.register("S09", S09_MainHall_Taeguk);
scenes.register("S10", S10_Epilogue);


scenes.start("S00").catch(err => {
  console.error(err);
  ui.say("ERROR", "콘솔(F12) 확인: " + String(err), { noLog: true });
});
