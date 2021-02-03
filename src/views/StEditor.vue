<template>
  <div class="st-editor">
    <el-button
      class="st-editor-btn-components"
      icon="el-icon-picture-outline-round"
      circle
      v-show="btnComponentsShow"
      size="small"
      @click="showLeftDrawer"
    ></el-button>
    <div class="st-drawer-ltr" v-if="leftDrawerVisible">
      <div class="st-drawer-ltr-icon">
        <i class="el-icon-close" @click="leftDrawerClose"></i>
      </div>
      <el-tabs
        class="st-tabs"
        v-model="tabsActive"
        @tab-click="tabsActiveClick"
      >
        <el-tab-pane label="组件" name="comps">
          <el-collapse
            class="st-editor-btn-components-collapse"
            v-model="collapseActiveName"
            accordion
          >
            <el-collapse-item title="矢量图" name="1">
              <img
                v-for="svg in svgArr"
                :key="svg.key"
                class="st-editor-btn-components-svg"
                :st-key="svg.key"
                :src="svg.src"
                :draggable="true"
                @dragstart="componentsDrag($event, 'svg')"
              />
            </el-collapse-item>
            <el-collapse-item title="线" name="2">
              <div>
                <img
                  v-for="line in lineArr"
                  :key="line.key"
                  class="st-editor-btn-components-line"
                  :st-key="line.key"
                  :src="line.src"
                  :draggable="true"
                  @dragstart="componentsDrag($event, 'line')"
                />
              </div>
            </el-collapse-item>
            <el-collapse-item title="高级矢量图" name="3">
              <div>简化流程：设计简洁直观的操作流程；</div>
              <div>
                清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；
              </div>
              <div>
                帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。
              </div>
            </el-collapse-item>
            <el-collapse-item title="其他" name="4">
              <div>
                用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；
              </div>
              <div>
                结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-tab-pane>
        <el-tab-pane label="属性" name="props">
          <el-row v-show="propsDis.pos">
            <el-col :span="5">位置：</el-col>
            <el-col :span="4" style="text-align: right; padding-right: 10px"
              >x</el-col
            >
            <el-col :span="5">
              <el-input
                size="mini"
                v-model="propsForm.pos.x"
                @change="(val) => propsFormChange(val, 'posx')"
              ></el-input>
            </el-col>
            <el-col :span="4" style="text-align: right; padding-right: 10px"
              >y</el-col
            >
            <el-col :span="5">
              <el-input
                size="mini"
                v-model="propsForm.pos.y"
                @change="(val) => propsFormChange(val, 'posy')"
              ></el-input>
            </el-col>
          </el-row>
          <el-row v-show="propsDis.scale">
            <el-col :span="6"> 缩放： </el-col>
            <el-col :span="18">
              <el-input
                size="mini"
                v-model="propsForm.scale"
                @change="(val) => propsFormChange(val, 'scale')"
              ></el-input>
            </el-col>
          </el-row>
          <el-row v-show="propsDis.point1">
            <el-col :span="5">顶点1：</el-col>
            <el-col :span="4" style="text-align: right; padding-right: 10px"
              >x</el-col
            >
            <el-col :span="5">
              <el-input
                size="mini"
                v-model="propsForm.points.p1x"
                @change="(val) => propsFormChange(val, 'points1x')"
              ></el-input>
            </el-col>
            <el-col :span="4" style="text-align: right; padding-right: 10px"
              >y</el-col
            >
            <el-col :span="5">
              <el-input
                size="mini"
                v-model="propsForm.points.p1y"
                @change="(val) => propsFormChange(val, 'points1y')"
              ></el-input>
            </el-col>
          </el-row>
          <el-row v-show="propsDis.point2">
            <el-col :span="5">顶点2：</el-col>
            <el-col :span="4" style="text-align: right; padding-right: 10px"
              >x</el-col
            >
            <el-col :span="5">
              <el-input
                size="mini"
                v-model="propsForm.points.p2x"
                @change="(val) => propsFormChange(val, 'points2x')"
              ></el-input>
            </el-col>
            <el-col :span="4" style="text-align: right; padding-right: 10px"
              >y</el-col
            >
            <el-col :span="5">
              <el-input
                size="mini"
                v-model="propsForm.points.p2y"
                @change="(val) => propsFormChange(val, 'points2y')"
              ></el-input>
            </el-col>
          </el-row>
          <el-row v-show="propsDis.point3">
            <el-col :span="5">顶点3：</el-col>
            <el-col :span="4" style="text-align: right; padding-right: 10px"
              >x</el-col
            >
            <el-col :span="5">
              <el-input
                size="mini"
                v-model="propsForm.points.p3x"
                @change="(val) => propsFormChange(val, 'points3x')"
              ></el-input>
            </el-col>
            <el-col :span="4" style="text-align: right; padding-right: 10px"
              >y</el-col
            >
            <el-col :span="5">
              <el-input
                size="mini"
                v-model="propsForm.points.p3y"
                @change="(val) => propsFormChange(val, 'points3y')"
              ></el-input>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="动画" name="animation"> 动画 </el-tab-pane>
        <el-tab-pane label="业务" name="biz"> 定时任务补偿 </el-tab-pane>
      </el-tabs>
    </div>
    <div
      class="st-editor-canvas"
      :ref="stEditorCanvasRef"
      @drop="drop($event)"
      @dragover="allowDrop($event)"
    ></div>
    <div class="st-editor-attr"></div>
  </div>
</template>

<script>
import * as spritejs from "spritejs";
const { Scene } = spritejs;
import StSvgSprite from "./model/stSvgSprite";
import StLineSprite from "./model/stLineSprite";
// import tool from "./utils/tool";

export default {
  name: "StEditor",
  components: {},
  data() {
    return {
      layer: null,
      leftDrawerVisible: true,
      // btnComponentsShow: false,
      mode: "edit",
      mousedownObj: {},
      stEditorCanvasRef:
        "stEditorCanvasRef" + Math.floor(Math.random() * 100000),
      collapseActiveName: "1",
      tabsActive: "comps",
      svgArr: [],
      lineArr: [],
      propsDis: {
        pos: false,
        scale: false,
        point1: false,
        point2: false,
        point3: false,
      },
      scaleObj: {
        COMPONENTS_SVG_SCALE: 50 / 1024,
        VIEWBOX_SCALE_INIT: 64 / 1024,
      },
      lineCfg: {
        LINE: {
          points: [200, 0],
          strokeColor: "black",
          lineWidth: 2,
        },
        POLYLINE: {
          points: [100, 0, 100, 100, 200, 100],
          strokeColor: "black",
          lineWidth: 2,
        },
      },
      propsForm: {
        pos: {
          x: 0,
          y: 0,
        },
        scale: 0,
        points: {
          p1x: 0,
          p1y: 0,
          p2x: 0,
          p2y: 0,
          p3x: 0,
          p3y: 0,
        },
      },
      activatedItems: [],
    };
  },
  computed: {
    btnComponentsShow() {
      return !this.leftDrawerVisible;
    },
  },
  watch: {},
  methods: {
    editorInit() {
      const container = this.$refs[this.stEditorCanvasRef];
      const scene = new Scene({
        container,
        width: 1440,
        height: 750,
        mode: "stickyTop",
      });

      this.layer = scene.layer();
      if (this.mode === "edit") {
        this.layer.addEventListener("mouseup", (evt) => {
          if (window.mousedownObj) {
            const mdo = window.mousedownObj;
            // console.log(mdo.target);
            mdo.target.attr = {
              pos: [
                evt.x - mdo.offsetPosition[0],
                evt.y - mdo.offsetPosition[1],
              ],
            };
            this.showProp(mdo.target);
            delete window.mousedownObj;
          }
        });
        this.layer.addEventListener("click", (evt) => {
          this.tabsActive = "comps";
          this.unactiveAll();
        });
      }
    },
    unactiveAll() {
      console.log('unactiveAll');
      // get sprites
      for (const child of this.layer.children) {
        // set sprites unactive
        if (typeof child.active === "function") {
          child.active(false);
        }
      }
    },
    addSvgSprite(stKey, pos) {
      const stSvgSprite = new StSvgSprite(
        {
          stKey: stKey,
          pos: pos,
          mode: this.mode,
        },
        this
      );
      this.layer.append(stSvgSprite);
      this.unactiveAll();
      stSvgSprite.active(true);
    },
    addLineSprite(stKey, pos) {
      const stLineSprite = new StLineSprite(
        {
          stKey: stKey,
          pos: pos,
          mode: this.mode,
        },
        this
      );
      this.layer.append(stLineSprite);
      this.unactiveAll();
      stLineSprite.active(true);
    },
    tabsActiveClick(tab, event) {
      // console.log(tab, event);
    },
    showLeftDrawer() {
      this.leftDrawerVisible = true;
    },
    leftDrawerClose() {
      this.leftDrawerVisible = false;
    },
    componentsDrag(ev, type) {
      if (this.mode !== "edit") {
        return;
      }
      // console.log(ev);
      function getStKey(ev) {
        for (const attribute of ev.target.attributes) {
          if (attribute.name === "st-key") return attribute.value;
        }
        return null;
      }
      let stKey = getStKey(ev);
      if (!stKey) {
        throw new Error("业务逻辑错误： 该svg没有st-key");
      }

      ev.dataTransfer.setData("stKey", stKey);
      if (type === "svg") {
        ev.dataTransfer.setData("act", "componentsSvgDrag");
        ev.dataTransfer.setData("fromOffsetX", ev.offsetX);
        ev.dataTransfer.setData("fromOffsetY", ev.offsetY);
      } else if (type === "line") {
        ev.dataTransfer.setData("act", "componentsLineDrag");
      }
    },
    drop(ev) {
      if (this.mode !== "edit") {
        return;
      }
      const act = ev.dataTransfer.getData("act");
      const stKey = ev.dataTransfer.getData("stKey");
      const fromOffsetX = parseFloat(ev.dataTransfer.getData("fromOffsetX"));
      const fromOffsetY = parseFloat(ev.dataTransfer.getData("fromOffsetY"));

      let targetX = null;
      let targetY = null;
      if (act === "componentsSvgDrag") {
        let targetOffsetX =
          (fromOffsetX / this.scaleObj.COMPONENTS_SVG_SCALE) *
          this.scaleObj.VIEWBOX_SCALE_INIT;
        let targetOffsetY =
          (fromOffsetY / this.scaleObj.COMPONENTS_SVG_SCALE) *
          this.scaleObj.VIEWBOX_SCALE_INIT;

        targetX = ev.x - targetOffsetX;
        targetY = ev.y - targetOffsetY;
        this.addSvgSprite(stKey, [targetX, targetY]);
      } else if (act === "componentsLineDrag") {
        this.addLineSprite(stKey, [ev.x, ev.y]);
      }
    },
    allowDrop(ev) {
      ev.preventDefault();
    },
    propsDisHandler(type) {
      if (type === "StSvgSprite") {
        this.propsDis.pos = true;
        this.propsDis.scale = true;
        this.propsDis.point1 = false;
        this.propsDis.point2 = false;
        this.propsDis.point3 = false;
      } else if (type === "StLineSprite1b") {
        this.propsDis.pos = true;
        this.propsDis.scale = false;
        this.propsDis.point1 = true;
        this.propsDis.point2 = false;
        this.propsDis.point3 = false;
      } else if (type === "StLineSprite3b") {
        this.propsDis.pos = true;
        this.propsDis.scale = false;
        this.propsDis.point1 = true;
        this.propsDis.point2 = true;
        this.propsDis.point3 = true;
      }
    },
    showProp(obj) {
      this.tabsActive = "props";
      if (obj.constructor.name === "StSvgSprite") {
        this.activatedItems.push(obj);
        this.propsForm.pos.x = obj.attr.pos[0];
        this.propsForm.pos.y = obj.attr.pos[1];
        this.propsForm.scale = obj.attr.scale[0];
        this.propsDisHandler("StSvgSprite");
      } else if (obj.constructor.name === "StLineSprite") {
        this.activatedItems.push(obj);
        // console.log(obj.attr);
        if (obj.attr.stKey === "polyline1broken") {
          this.propsForm.pos.x = obj.attr.pos[0];
          this.propsForm.pos.y = obj.attr.pos[1];
          this.propsForm.points.p1x = obj.attr.points[2];
          this.propsForm.points.p1y = obj.attr.points[3];
          this.propsDisHandler("StLineSprite1b");
        } else if (obj.attr.stKey === "polyline3broken") {
          this.propsForm.pos.x = obj.attr.pos[0];
          this.propsForm.pos.y = obj.attr.pos[1];
          this.propsForm.points.p1x = obj.attr.points[2];
          this.propsForm.points.p1y = obj.attr.points[3];
          this.propsForm.points.p2x = obj.attr.points[4];
          this.propsForm.points.p2y = obj.attr.points[5];
          this.propsForm.points.p3x = obj.attr.points[6];
          this.propsForm.points.p3y = obj.attr.points[7];
          this.propsDisHandler("StLineSprite3b");
        }
      }
    },
    unactivatedData(obj) {
      let retIndex = -1;
      if (this.activatedItems && this.activatedItems.length > 0) {
        for (let i = 0; i < this.activatedItems.length; i++) {
          const item = this.activatedItems[i];
          if (item.id === obj.id) {
            retIndex = i;
            break;
          }
        }
      }
      if (retIndex > -1) {
        this.activatedItems.splice(retIndex, 1);
      }
    },
    propsFormChange(val, type) {
      function setPoint(item, attr, index, val) {
        let points = []
          for (let i = 0; i < item.attr.points.length; i++) {
            const point = item.attr.points[i];
            if (i === index) {
              points.push(parseFloat(val));
            } else {
              points.push(point);
            }
          }
          attr.points = points
      }
      if (this.activatedItems && this.activatedItems.length > 0) {
        for (const item of this.activatedItems) {
          let attr = {}
          if (type === "posx") {
            attr.pos = item.attr.pos
            attr.pos[0] = parseFloat(val);
          } else if (type === "posy") {
            attr.pos = item.attr.pos
            attr.pos[1] = parseFloat(val);
          } else if (type === "scale") {
            attr.scale = parseFloat(val);
          } else if (type === "points1x") {
            setPoint(item, attr, 2, val)
          } else if (type === "points1y") {
            setPoint(item, attr, 3, val)
          } else if (type === "points2x") {
            setPoint(item, attr, 4, val)
          } else if (type === "points2y") {
            setPoint(item, attr, 5, val)
          } else if (type === "points3x") {
            setPoint(item, attr, 6, val)
          } else if (type === "points3y") {
            setPoint(item, attr, 7, val)
          }
          item.attr = attr;
        }
      }
    },
  },
  created() {
    // ============= svgs ==============
    let svgKeyArr = [
      "cat1",
      "cat2",
      "cat3",
      "cat4",
      "cat5",
      "cat6",
      "ghost1",
      "ghost2",
      "ghost3",
      "ghost4",
      "ghost5",
      "ghost6",
    ];
    for (const svgKey of svgKeyArr) {
      this.svgArr.push({
        key: svgKey,
        src: require("@/assets/svgs/" + svgKey + ".svg"),
      });
    }

    // ============= lines ==============
    let lineKeyArr = ["polyline1broken", "polyline3broken"];
    for (const lineKey of lineKeyArr) {
      this.lineArr.push({
        key: lineKey,
        src: require("@/assets/lines/" + lineKey + ".svg"),
      });
    }
  },
  mounted() {
    this.editorInit();
    // this.addSvgSprite("cat1", [300, 300]);

    window.onkeyup = (e) => {
      if (e.which === 46) {
        console.log(this.activatedItems);
        if (this.activatedItems && this.activatedItems.length > 0) {
          for (let i = 0; i < this.activatedItems.length; i++) {
            const item = this.activatedItems[i];
            console.log('item.del()');
            console.log(item);
            item.del();
          }
        }
        this.activatedItems = [];
        this.tabsActive = "comps";
      }
    };
  },
  updated() {},
  beforeDestroy() {
    window.onkeyup = null;
  },
  activated() {},
};
</script>

<style lang="scss" scope>
.st-editor {
  width: 100%;
  height: 100%;
  &-btn-components {
    position: absolute;
    margin: 30px;
    z-index: 9999;
    &-collapse {
      width: 90%;
      height: 50px;
      margin-left: 5%;
    }
    &-svg {
      width: 60px;
      height: 50px;
    }
    &-line {
      width: 60px;
      height: 50px;
    }
  }
  &-canvas {
    position: absolute;
    width: 1440px;
    height: 750px;
    // border: 1px solid black;
    z-index: 100;
  }
  &-attr {
    float: left;
    width: 300px;
  }

  .st-drawer-ltr {
    position: absolute;
    width: 20%;
    height: 100%;
    background-color: white;
    box-shadow: 1px 0px 8px #888888;
    z-index: 9000;
    overflow: hidden;
    &-icon {
      width: 93%;
      height: 30px;
      margin-top: 10px;
      margin-right: 0;
      text-align: right;
    }
  }

  .st-tabs {
    height: 100%;
  }
}
</style>
<style lang="scss">
.st-editor {
  font-size: 14px;
  .el-tabs__content {
    height: 100%;
  }
  .el-tabs__nav {
    margin-left: 20px;
  }
  .el-tabs__nav-wrap::after {
    height: 0;
  }
  .el-row {
    width: 90%;
    height: 40px;
    margin-left: 5%;
  }
}
</style>