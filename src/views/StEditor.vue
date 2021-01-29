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
      <el-collapse
        class="st-editor-btn-components-collapse"
        v-model="collapseActiveName"
        accordion
      >
        <el-collapse-item title="SVG" name="1">
          <img
            v-for="svg in svgArr"
            :key="svg.key"
            class="st-editor-btn-components-svg"
            :st-key="svg.key"
            :src="svg.src"
            :draggable="true"
            @dragstart="componentsSvgDrag($event)"
          />
        </el-collapse-item>
        <el-collapse-item title="反馈 Feedback" name="2">
          <div>
            控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；
          </div>
          <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
        </el-collapse-item>
        <el-collapse-item title="效率 Efficiency" name="3">
          <div>简化流程：设计简洁直观的操作流程；</div>
          <div>
            清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；
          </div>
          <div>
            帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。
          </div>
        </el-collapse-item>
        <el-collapse-item title="可控 Controllability" name="4">
          <div>
            用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；
          </div>
          <div>
            结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。
          </div>
        </el-collapse-item>
      </el-collapse>
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
const { Scene, Sprite, Group, Path } = spritejs;
import StSvgSprite from "./model/stSvgSprite";

export default {
  name: "StEditor",
  //import引入的组件需要注入到对象中才能使用",
  components: {},
  data() {
    //这里存放数据",
    return {
      layer: null,
      leftDrawerVisible: true,
      // btnComponentsShow: false,
      mode: "edit",
      mousedownObj: {},
      stEditorCanvasRef:
        "stEditorCanvasRef" + Math.floor(Math.random() * 100000),
      collapseActiveName: "1",
      svgArr: [],
      scaleObj: {
        COMPONENTS_SVG_SCALE: 50 / 1024,
        VIEWBOX_SCALE_INIT: 64 / 1024,
      },
    };
  },
  //监听属性 类似于data概念",
  computed: {
    btnComponentsShow() {
      return !this.leftDrawerVisible;
    },
  },
  //监控data中的数据变化",
  watch: {},
  //方法集合",
  methods: {
    playerInit() {
      const container = this.$refs[this.stEditorCanvasRef];
      const scene = new Scene({
        container,
        width: 1440,
        height: 750,
        mode: "stickyTop",
      });

      this.layer = scene.layer();
    },
    addGroup(stKey, pos) {
      const stSvgSprite = new StSvgSprite({stKey: stKey, pos: pos, mode: 'edit'});
      this.layer.addEventListener("mouseup", (evt) => {
        if (window.mousedownObj) {
          const mdo = window.mousedownObj
          mdo.target.attr({
            pos: [
              evt.x - mdo.offsetPosition[0],
              evt.y - mdo.offsetPosition[1],
            ],
          });
          delete window.mousedownObj
        }
      });
      this.layer.append(stSvgSprite);
    },
    showLeftDrawer() {
      this.leftDrawerVisible = true;
    },
    leftDrawerClose() {
      this.leftDrawerVisible = false;
    },
    componentsSvgDrag(ev) {
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

      ev.dataTransfer.setData("act", "componentsSvgDrag");
      ev.dataTransfer.setData("stKey", stKey);
      ev.dataTransfer.setData("fromOffsetX", ev.offsetX);
      ev.dataTransfer.setData("fromOffsetY", ev.offsetY);
    },
    drop(ev) {
      const act = ev.dataTransfer.getData("act");
      const stKey = ev.dataTransfer.getData("stKey");
      const fromOffsetX = parseFloat(ev.dataTransfer.getData("fromOffsetX"));
      const fromOffsetY = parseFloat(ev.dataTransfer.getData("fromOffsetY"));
      // console.log(act, stKey, fromOffsetX, fromOffsetY);

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
      }
      // console.log(targetX, targetY);

      this.addGroup(stKey, [targetX, targetY]);
    },
    allowDrop(ev) {
      ev.preventDefault();
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）",数据模型已加载，方法已加载,html模板已加载,html模板未渲染
  created() {
    let keyArr = [
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
    for (const key of keyArr) {
      this.svgArr.push({
        key: key,
        src: require("@/assets/svgs/" + key + ".svg"),
      });
    }
  },
  //生命周期 - 挂载完成（可以访问DOM元素）",html模板已渲染
  mounted() {
    this.playerInit();
    this.addGroup("cat1", [300, 300]);
  },
  //生命周期 - 更新之后",数据模型已更新,html模板已更新
  updated() {},
  //生命周期 - 销毁之前",
  beforeDestroy() {},
  destroyed() {},
  //生命周期 - 销毁完成",
  //如果页面有keep-alive缓存功能，这个函数会触发",
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
    &-icon {
      width: 93%;
      height: 30px;
      margin-top: 10px;
      margin-right: 0;
      text-align: right;
    }
  }
}
</style>