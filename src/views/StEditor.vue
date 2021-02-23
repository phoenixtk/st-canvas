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
    <el-input-number
      class="st-editor-btn-totalscale"
      size="small"
      v-model="totalScale"
      v-show="btnComponentsShow"
      :precision="2"
      :step="0.1"
      :min="0.5"
      :max="1.5"
    >
    </el-input-number>
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
              <img
                src="/img/pipe.png"
                st-key="pipe"
                :draggable="true"
                @dragstart="componentsDrag($event, 'ad-vector')"
              />
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
            <el-col :span="3" style="text-align: right; padding-right: 10px">
              x
            </el-col>
            <el-col :span="4">
              <el-input
                size="mini"
                v-model="propsForm.pos.x"
                @change="(val) => propsChange(val, 'posx')"
              ></el-input>
            </el-col>
            <el-col :span="3" style="text-align: right; padding-right: 10px">
              y
            </el-col>
            <el-col :span="4">
              <el-input
                size="mini"
                v-model="propsForm.pos.y"
                @change="(val) => propsChange(val, 'posy')"
              ></el-input>
            </el-col>
            <el-col :span="4">
              <el-button
                class="st-pos-handler"
                :class="stPosHandlerEx('pos')"
                size="mini"
                icon="el-icon-edit"
                @click="altMarkerCur('pos')"
              >
              </el-button>
            </el-col>
          </el-row>
          <el-row v-show="propsDis.scale">
            <el-col :span="6"> 缩放： </el-col>
            <el-col :span="18">
              <el-input
                size="mini"
                v-model="propsForm.scale"
                @change="(val) => propsChange(val, 'scale')"
              ></el-input>
            </el-col>
          </el-row>
          <el-row v-show="propsDis.point1">
            <el-col :span="5">顶点1：</el-col>
            <el-col :span="3" style="text-align: right; padding-right: 10px">
              x
            </el-col>
            <el-col :span="4">
              <el-input
                size="mini"
                v-model="propsForm.points.p1x"
                @change="(val) => propsChange(val, 'points1x')"
              ></el-input>
            </el-col>
            <el-col :span="3" style="text-align: right; padding-right: 10px">
              y
            </el-col>
            <el-col :span="4">
              <el-input
                size="mini"
                v-model="propsForm.points.p1y"
                @change="(val) => propsChange(val, 'points1y')"
              ></el-input>
            </el-col>
            <el-col :span="4">
              <el-button
                class="st-pos-handler"
                :class="stPosHandlerEx('points1')"
                size="mini"
                icon="el-icon-edit"
                @click="altMarkerCur('points1')"
              >
              </el-button>
            </el-col>
          </el-row>
          <el-row v-show="propsDis.point2">
            <el-col :span="5">顶点2：</el-col>
            <el-col :span="3" style="text-align: right; padding-right: 10px">
              x
            </el-col>
            <el-col :span="4">
              <el-input
                size="mini"
                v-model="propsForm.points.p2x"
                @change="(val) => propsChange(val, 'points2x')"
              ></el-input>
            </el-col>
            <el-col :span="3" style="text-align: right; padding-right: 10px">
              y
            </el-col>
            <el-col :span="4">
              <el-input
                size="mini"
                v-model="propsForm.points.p2y"
                @change="(val) => propsChange(val, 'points2y')"
              ></el-input>
            </el-col>
            <el-col :span="4">
              <el-button
                class="st-pos-handler"
                :class="stPosHandlerEx('points2')"
                size="mini"
                icon="el-icon-edit"
                @click="altMarkerCur('points2')"
              >
              </el-button>
            </el-col>
          </el-row>
          <el-row v-show="propsDis.point3">
            <el-col :span="5">顶点3：</el-col>
            <el-col :span="3" style="text-align: right; padding-right: 10px">
              x
            </el-col>
            <el-col :span="4">
              <el-input
                size="mini"
                v-model="propsForm.points.p3x"
                @change="(val) => propsChange(val, 'points3x')"
              ></el-input>
            </el-col>
            <el-col :span="3" style="text-align: right; padding-right: 10px">
              y
            </el-col>
            <el-col :span="4">
              <el-input
                size="mini"
                v-model="propsForm.points.p3y"
                @change="(val) => propsChange(val, 'points3y')"
              ></el-input>
            </el-col>
            <el-col :span="4">
              <el-button
                class="st-pos-handler"
                :class="stPosHandlerEx('points3')"
                size="mini"
                icon="el-icon-edit"
                @click="altMarkerCur('points3')"
              >
              </el-button>
            </el-col>
          </el-row>
          <el-row v-show="propsDis.pipe.point1">
            <el-col :span="5">顶点1：</el-col>
            <el-col :span="7">
              <el-select
                v-model="propsForm.pipe.point1.direction"
                size="mini"
                placeholder="方向"
                @change="(val) => propsChange(val, 'pipePoint1Direction')"
              >
                <el-option
                  v-for="item in pipeOpt.directionOpts"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="3" style="text-align: right; padding-right: 10px">
              长
            </el-col>
            <el-col :span="4">
              <el-input
                size="mini"
                v-model="propsForm.pipe.point1.length"
                @change="(val) => propsChange(val, 'points1y')"
              ></el-input>
            </el-col>
            <el-col :span="4">
              <el-button
                class="st-pos-handler"
                :class="stPosHandlerEx('points1')"
                size="mini"
                icon="el-icon-edit"
                @click="altMarkerCur('points1')"
              >
              </el-button>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="动画" name="animation">
          <el-row>
            <el-col :span="24" style="text-align: right">
              <el-button
                type="default"
                size="mini"
                icon="el-icon-plus"
                @click="addAnimation"
                v-show="animationAdd.btnAddShow"
              >
              </el-button>
              <el-button
                type="default"
                size="mini"
                icon="el-icon-check"
                @click="saveAnimation"
                v-show="!animationAdd.btnAddShow"
              >
              </el-button>
            </el-col>
          </el-row>
          <div class="animation-add-container" v-show="animationAdd.show">
            <el-col :span="8">
              <el-select
                v-model="animationAdd.type"
                size="mini"
                placeholder="类型"
                @change="animationAddTypeChange"
              >
                <el-option
                  v-for="item in animationAdd.typeOpts"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="8" v-show="animationAdd.angleShow">
              <el-select
                v-model="animationAdd.angle"
                size="mini"
                placeholder="角度"
                @change="animationAddAngleChange"
              >
                <el-option
                  v-for="item in animationAdd.angleOpts"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="8" v-show="animationAdd.durationShow">
              <el-select
                v-model="animationAdd.duration"
                size="mini"
                placeholder="时长"
                @change="animationAddDurationChange"
              >
                <el-option
                  v-for="item in animationAdd.durationOpts"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-col>
            <div style="clear: both"></div>
          </div>
        </el-tab-pane>
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
import StPipe from "./model/stPipe";
// import tool from "./utils/tool";
import svg from "./utils/svg";

export default {
  name: "StEditor",
  components: {},
  data() {
    return {
      scene: null,
      bglayer: null,
      layer: null,
      totalScale: 1,
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
      scaleObj: svg.getScale(),
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
      propsDis: {
        // 属性tab中的控件显示隐藏
        pos: false,
        scale: false,
        point1: false,
        point2: false,
        point3: false,
        pipe: {
          point1: false,
          point2: false,
          point3: false,
        },
      },
      propsForm: {
        // 属性tab中的控件值
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
        pipe: {
          point1: {
            direction: 'right',
            length: 500,
          },
          point2: {
            direction: null,
            length: null,
          },
          point3: {
            direction: null,
            length: null,
          },
        },
      },
      activatedItems: [], // 当前选中项
      altMarker: {
        // alt + 左键 相关控制
        cur: "pos",
        axis: {
          x: null,
          y: null,
        },
      },
      animationAdd: {
        btnAddShow: true,
        show: false,
        angleShow: false,
        durationShow: false,
        type: "",
        typeOpts: [
          {
            value: "rotate",
            label: "旋转",
          },
          {
            value: "changeColor",
            label: "变色",
          },
          {
            value: "offset",
            label: "边缘平移",
          },
        ],
        angle: "",
        angleOpts: [
          {
            value: "90",
            label: "90°",
          },
          {
            value: "180",
            label: "180°",
          },
          {
            value: "360",
            label: "360°",
          },
        ],
        duration: "",
        durationOpts: [],
      },
      pipeOpt: {
        directionOpts: [
          {
            value: "up",
            label: "上",
          },
          {
            value: "right",
            label: "右",
          },
          {
            value: "down",
            label: "下",
          },
          {
            value: "left",
            label: "左",
          },
        ]
      }
    };
  },
  computed: {
    btnComponentsShow() {
      return !this.leftDrawerVisible;
    },
  },
  watch: {
    totalScale: {
      handler(scale) {
        // console.log(scale);
        // console.log(this.scene);
        let width = 1440;
        let height = 810;
        this.scene.width = width * scale;
        this.scene.height = height * scale;
        this.scene.resize();
      },
    },
  },
  methods: {
    editorInit() {
      const container = this.$refs[this.stEditorCanvasRef];
      this.scene = new Scene({
        container,
        width: 1440,
        height: 810,
        // bgcolor: '#1e1e1e',
        mode: "stickyTop",
      });

      const bglayer = this.scene.layer("bg", {
        // bgcolor: '#1e1e1e',
        handleEvent: false,
      });
      // console.log(bglayer);
      bglayer.attributes.bgcolor = "#1e1e1e";
      bglayer.attributes.zIndex = 10;

      const fglayer = this.scene.layer("fg", {
        handleEvent: true,
      });
      fglayer.attributes.zIndex = 50;

      this.bglayer = bglayer;
      this.layer = fglayer;
      if (this.mode === "edit") {
        this.layer.addEventListener("mouseup", (evt) => {
          if (window.mousedownObj) {
            const mdo = window.mousedownObj;
            // console.log(mdo.target);
            mdo.target.stattr = {
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
          if (evt.originalEvent.altKey) {
            this.altMarker.axis.x = evt.x;
            this.altMarker.axis.y = evt.y;
            /* this.$message({
              dangerouslyUseHTMLString: true,
              message:
                '已获取当前坐标 x:' + this.altPos.x + ' y:' + this.altPos.y,
              duration: 3000,
              center: true,
            }); */
            this.altMarkerPosHandler();
          } else {
            this.tabsActive = "comps";
            this.unactiveAll();
          }
        });
        /* this.layer.addEventListener("mouseup", (e) => {
          console.log(e);
          var keyCode = e.keyCode || e.which || e.charCode;
          var ctrlKey = e.ctrlKey || e.metaKey;
          if (ctrlKey) {
            if (keyCode == 71) {  // ctrl + g
              console.log('ctrl + g' + keyCode);
              e.preventDefault();
              return false;
            }
          }
        }); */
      }

      /* window.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          this.layer.timeline.playbackRate = 0;
          this.pauseAllAnimation()
        } else {
          this.layer.timeline.playbackRate = 1;
          this.playAllAnimation()
        }
      }); */
    },
    unactiveAll() {
      // console.log("unactiveAll");
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
    addPipe(pos) {
      const stPipe = new StPipe(
        {
          pos: pos,
          mode: this.mode,
        },
        this
      );
      this.layer.append(stPipe);
      this.unactiveAll();
      stPipe.active(true);
      stPipe.stanimate();
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
      } else if (type === "ad-vector") {
        ev.dataTransfer.setData("act", "componentsAdVectorDrag");
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
      let size = svg.getSize();
      if (act === "componentsSvgDrag") {
        let targetOffsetX =
          (fromOffsetX / this.scaleObj.COMPONENTS_SVG_SCALE) *
          this.scaleObj.VIEWBOX_SCALE_INIT;
        let targetOffsetY =
          (fromOffsetY / this.scaleObj.COMPONENTS_SVG_SCALE) *
          this.scaleObj.VIEWBOX_SCALE_INIT;
        targetX =
          ev.x +
          (size[0] * this.scaleObj.VIEWBOX_SCALE_INIT) / 2 -
          targetOffsetX;
        targetY =
          ev.y +
          (size[1] * this.scaleObj.VIEWBOX_SCALE_INIT) / 2 -
          targetOffsetY;
        this.addSvgSprite(stKey, [targetX, targetY]);
      } else if (act === "componentsLineDrag") {
        this.addLineSprite(stKey, [ev.x, ev.y]);
      } else if (act === "componentsAdVectorDrag") {
        if (stKey === "pipe") {
          this.addPipe([ev.x, ev.y]);
        }
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
        this.propsDis.pipe.point1 = false;
        this.propsDis.pipe.point2 = false;
        this.propsDis.pipe.point3 = false;
      } else if (type === "StLineSprite1b") {
        this.propsDis.pos = true;
        this.propsDis.scale = false;
        this.propsDis.point1 = true;
        this.propsDis.point2 = false;
        this.propsDis.point3 = false;
        this.propsDis.pipe.point1 = false;
        this.propsDis.pipe.point2 = false;
        this.propsDis.pipe.point3 = false;
      } else if (type === "StLineSprite3b") {
        this.propsDis.pos = true;
        this.propsDis.scale = false;
        this.propsDis.point1 = true;
        this.propsDis.point2 = true;
        this.propsDis.point3 = true;
        this.propsDis.pipe.point1 = false;
        this.propsDis.pipe.point2 = false;
        this.propsDis.pipe.point3 = false;
      } else if (type === "StPipe") {
        this.propsDis.pos = true;
        this.propsDis.scale = false;
        this.propsDis.point1 = false;
        this.propsDis.point2 = false;
        this.propsDis.point3 = false;
        this.propsDis.pipe.point1 = true;
        this.propsDis.pipe.point2 = false;
        this.propsDis.pipe.point3 = false;
      }
    },
    showProp(obj) {
      this.tabsActive = "props";
      this.altMarker.cur = "pos";
      if (obj.constructor.name === "StSvgSprite") {
        this.activatedItems.push(obj);
        this.propsForm.pos.x = obj.stattr.pos[0];
        this.propsForm.pos.y = obj.stattr.pos[1];
        this.propsForm.scale = obj.stattr.scale[0];
        this.propsDisHandler("StSvgSprite");
      } else if (obj.constructor.name === "StLineSprite") {
        this.activatedItems.push(obj);
        if (obj.stattr.stKey === "polyline1broken") {
          this.propsForm.pos.x = obj.stattr.pos[0];
          this.propsForm.pos.y = obj.stattr.pos[1];
          this.propsForm.points.p1x = obj.stattr.points[2];
          this.propsForm.points.p1y = obj.stattr.points[3];
          this.propsDisHandler("StLineSprite1b");
        } else if (obj.stattr.stKey === "polyline3broken") {
          this.propsForm.pos.x = obj.stattr.pos[0];
          this.propsForm.pos.y = obj.stattr.pos[1];
          this.propsForm.points.p1x = obj.stattr.points[2];
          this.propsForm.points.p1y = obj.stattr.points[3];
          this.propsForm.points.p2x = obj.stattr.points[4];
          this.propsForm.points.p2y = obj.stattr.points[5];
          this.propsForm.points.p3x = obj.stattr.points[6];
          this.propsForm.points.p3y = obj.stattr.points[7];
          this.propsDisHandler("StLineSprite3b");
        }
      } else if (obj.constructor.name === "StPipe") {
        this.activatedItems.push(obj);
        this.propsForm.pos.x = obj.stattr.pos[0];
        this.propsForm.pos.y = obj.stattr.pos[1];
        this.propsDisHandler("StPipe");
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
    propsChange(val, type) {
      function setPoint(item, attr, index, val) {
        let points = [];
        for (let i = 0; i < item.stattr.points.length; i++) {
          const point = item.stattr.points[i];
          if (i === index) {
            points.push(parseFloat(val));
          } else {
            points.push(point);
          }
        }
        attr.points = points;
      }
      if (this.activatedItems && this.activatedItems.length > 0) {
        for (const item of this.activatedItems) {
          let attr = {};
          if (type === "posx") {
            attr.pos = item.stattr.pos;
            attr.pos[0] = parseFloat(val);
          } else if (type === "posy") {
            attr.pos = item.stattr.pos;
            attr.pos[1] = parseFloat(val);
          } else if (type === "scale") {
            attr.scale = parseFloat(val);
          } else if (type === "points1x") {
            setPoint(item, attr, 2, val);
          } else if (type === "points1y") {
            setPoint(item, attr, 3, val);
          } else if (type === "points2x") {
            setPoint(item, attr, 4, val);
          } else if (type === "points2y") {
            setPoint(item, attr, 5, val);
          } else if (type === "points3x") {
            setPoint(item, attr, 6, val);
          } else if (type === "points3y") {
            setPoint(item, attr, 7, val);
          } else if (type === "pipePoint1Direction") {
            attr.point1Direction = val
          }
          item.stattr = attr;
        }
      }
    },
    stPosHandlerEx(type) {
      return {
        "st-pos-handler-cur": type === this.altMarker.cur,
      };
    },
    altMarkerCur(type) {
      this.altMarker.cur = type;
    },
    checkActivated() {
      if (this.activatedItems.length === 0) {
        this.$message({
          dangerouslyUseHTMLString: true,
          message: "未选中元素",
          duration: 3000,
          center: true,
        });
        return false;
      }
      return true;
    },
    altMarkerPosHandler() {
      if (!this.checkActivated()) {
        return false;
      }
      if (this.tabsActive !== "props") {
        this.$message({
          dangerouslyUseHTMLString: true,
          message: "tab未切换至属性",
          duration: 3000,
          center: true,
        });
        return false;
      }
      let cur = this.altMarker.cur;
      for (const item of this.activatedItems) {
        if (item.stattr && item.stattr.constructor.name === "Group") {
          // 图
          if (cur === "pos") {
            this.propsForm.pos.x = this.altMarker.axis.x;
            this.propsForm.pos.y = this.altMarker.axis.y;
            item.stattr.x = this.altMarker.axis.x;
            item.stattr.y = this.altMarker.axis.y;
          }
        } else if (item.stattr && item.stattr.constructor.name === "Polyline") {
          if (cur === "pos") {
            this.propsForm.pos.x = this.altMarker.axis.x;
            this.propsForm.pos.y = this.altMarker.axis.y;
            item.stattr.x = this.altMarker.axis.x;
            item.stattr.y = this.altMarker.axis.y;
          } else if (cur.indexOf("points") > -1) {
            let curLast = parseInt(cur.substring(cur.length - 1, cur.length));
            let oldPoints = item.stattr.points;
            let newPoints = [];
            let attr = {};
            // 线
            // 节点
            if (curLast === 1) {
              this.propsForm.points.p1x = this.altMarker.axis.x - item.stattr.x;
              this.propsForm.points.p1y = this.altMarker.axis.x - item.stattr.y;
            } else if (curLast === 2) {
              this.propsForm.points.p2x = this.altMarker.axis.x - item.stattr.x;
              this.propsForm.points.p2y = this.altMarker.axis.x - item.stattr.y;
            } else if (curLast === 3) {
              this.propsForm.points.p3x = this.altMarker.axis.x - item.stattr.x;
              this.propsForm.points.p3y = this.altMarker.axis.x - item.stattr.y;
            }

            for (let i = 0; i < oldPoints.length; i++) {
              const op = oldPoints[i];
              if (i === curLast * 2) {
                newPoints.push(this.altMarker.axis.x - item.stattr.x);
              } else if (i === curLast * 2 + 1) {
                newPoints.push(this.altMarker.axis.y - item.stattr.y);
              } else {
                newPoints.push(op);
              }
            }
            attr.points = newPoints;
            item.stattr = attr;
          }
        }
      }
    },
    addAnimation() {
      if (!this.checkActivated()) {
        return false;
      }
      this.animationAdd.show = true;
      this.animationAdd.angleShow = false;
      this.animationAdd.durationShow = false;
      this.animationAdd.type = "";
    },
    saveAnimation() {
      for (const activated of this.activatedItems) {
        if (this.animationAdd.type === "rotate") {
          activated.rotate(this.animationAdd.angle, this.animationAdd.duration);
        }
      }
    },
    animationAddTypeChange(val) {
      if (val === "rotate") {
        this.animationAdd.angleShow = true;
      }
    },
    animationAddAngleChange(val) {
      if (val !== "") {
        this.animationAdd.durationShow = true;
      }
    },
    animationAddDurationChange(val) {
      if (val !== "") {
        this.animationAdd.btnAddShow = false;
      }
    },
    /* pauseAllAnimation() {
      for (const activated of this.activatedItems) {
        if (typeof activated.pauseAnimation === "function") {
          activated.pauseAnimation()
        }
      }
    },
    playAllAnimation() {
      for (const activated of this.activatedItems) {
        if (typeof activated.playAnimation === "function") {
          activated.playAnimation()
        }
      }
    } */
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

    this.animationAdd.durationOpts = [];
    for (let i = 0; i < 50; i++) {
      let d = 500;
      this.animationAdd.durationOpts.push({
        value: 500 + i * 100,
        label: 500 + i * 100 + "ms",
      });
    }
  },
  mounted() {
    this.editorInit();
    // this.addSvgSprite("cat1", [300, 300]);

    window.onkeydown = (e) => {
      var keyCode = e.keyCode || e.which || e.charCode;
      var ctrlKey = e.ctrlKey || e.metaKey;
      // console.log(keyCode);
      if (ctrlKey) {
        if (keyCode == 219) {
          this.$message({
            dangerouslyUseHTMLString: true,
            message:
              "<strong><i>使用说明</i></strong><br>" +
              "Alt + 左键: 获取当前鼠标坐标",
            duration: 0,
            center: true,
            showClose: true,
          });
          e.preventDefault();
          return false;
        }
      }
    };

    window.onkeyup = (e) => {
      if (e.which === 46) {
        if (this.activatedItems && this.activatedItems.length > 0) {
          for (let i = 0; i < this.activatedItems.length; i++) {
            const item = this.activatedItems[i];
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
    window.onkeydown = null;
    window.onkeyup = null;
  },
  activated() {},
};
</script>

<style lang="scss" scope>
.st-editor {
  width: 100%;
  height: 100%;
  overflow: hidden;
  div {
    color: #fff;
  }

  &-btn-totalscale {
    position: absolute;
    right: 130px;
    top: 30px;
    z-index: 200;
  }
  &-btn-components {
    position: absolute;
    margin: 30px;
    z-index: 200;
    &-collapse {
      width: 90%;
      height: 50px;
      margin-left: 5%;
    }
    &-svg {
      width: 60px;
      height: 50px;
      background-color: #fff;
    }
    &-line {
      width: 60px;
      height: 50px;
      background-color: #fff;
    }
  }
  &-canvas {
    position: absolute;
    width: 1440px;
    height: 810px;
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
    background-color: #252526;
    box-shadow: 1px 0px 8px #252526;
    z-index: 1000;
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

  .animation-add-container {
    display: block;
    box-sizing: border-box;
    width: 90%;
    margin-left: 5%;
    border: 1px solid teal;
    // background-color: #c4e1ff;
    border-radius: 5px;
    padding: 15px;
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
    .el-col {
      line-height: 32px;
    }
  }
  .el-input__inner {
    padding: 0 2px;
  }
  .el-select {
    .el-input__inner {
      width: 58px;
    }
  }
  .st-pos-handler,
  .el-button--mini {
    padding: 7px 9px;
    margin: 0 8px;
  }
  .st-pos-handler-cur {
    background-color: aquamarine;
  }
  .el-select-dropdown .el-popper {
    z-index: 10000;
  }
  .st-tabs {
    div {
      background-color: #252526;
    }
  }
}
</style>