import { SceneManager } from "./sceneManager_core.js";
import { TITLE } from "./scenes/title.js";
import { P0 } from "./scenes/p0_boot.js";
import { P1 } from "./scenes/p1_video.js";
import { P2 } from "./scenes/p2_tabs.js";
import { P3 } from "./scenes/p3_name.js";
import { P4 } from "./scenes/p4_page.js";
import { P5 } from "./scenes/p5_select.js";
import { P6 } from "./scenes/p6_phone.js";
import { P7 } from "./scenes/p7_end.js";

const sm = new SceneManager();

sm.register("TITLE", new TITLE(sm));
sm.register("P0", new P0(sm));
sm.register("P1", new P1(sm));
sm.register("P2", new P2(sm));
sm.register("P3", new P3(sm));
sm.register("P4", new P4(sm));
sm.register("P5", new P5(sm));
sm.register("P6", new P6(sm));
sm.register("P7", new P7(sm));


sm.start("TITLE");
