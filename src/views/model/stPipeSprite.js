import { Group, Path, Polyline } from "spritejs";
import tool from "../utils/tool";
import getSvgPath from "../utils/svgMock";
import StSvgSprite from "./stSvgSprite";

// const setDefault = Symbol.for('spritejs_setAttribute');

const lineCfg = {
  points: [20, 20, 480, 20, 480, 330, 20, 330, 20, 20],
  strokeColor: "black",
  lineWidth: 2,
}

class StPipeSprite extends Group {
  constructor(attrs = {}, _vue) {
    attrs = Object.assign({
      // normalize: true,
      size: [500, 350],
      // anchor: [0.5, 0.5],
      // bgcolor: '#cec', // just for test
      borderRadius: 0,
      scale: [1, 1],
    }, attrs)

    super(attrs);
    this.$editor = _vue
    this.id = tool.getUuid();
    this.stInterval = null

    let stPolyline = new Polyline({
      // normalize: true,
      strokeColor: lineCfg.strokeColor,
      lineWidth: lineCfg.lineWidth,
      points: lineCfg.points,
      // lineJoin: 'bevel'
    });
    this.append(stPolyline);

    if (attrs.mode === 'edit') {
      this.addEventListener("mousedown", (evt) => {
        let scale = this.attributes.scale;
        let sp = this.getOffsetPosition(evt.x, evt.y);
        window.mousedownObj = {
          target: this,
          offsetPosition: [
            scale[0] * sp[0],
            scale[1] * sp[1],
          ]
        }
        evt.stopPropagation();
      });

      this.addEventListener('mouseup', (evt) => {
        delete window.mousedownObj
        evt.stopPropagation()
      });

      this.addEventListener('click', (evt) => {
        for (const child of this.layer.children) {
          if (child !== this) {
            if (typeof child.active === "function") {
              child.active(false)
            }
          } else {
            this.active(true);
          }
        }
        evt.stopPropagation();
      });
    }
  }

  active(b) {
    if (b) {
      this.attributes.borderWidth = 1 / this.attributes.scale[0],
        this.attributes.borderColor = 'blue'
      this.actived = true
      // 暂时只处理一个选中的时候
      this.$editor.showProp(this)
    } else {
      this.attributes.borderWidth = 0,
        this.attributes.borderColor = 'white'
      this.actived = false
      this.$editor.unactivatedData(this)
    }
  }

  del() {
    // this.removeAllChildren()
    this.remove()
  }

  set stattr(attr) {
    // 暂时暴露2个属性 pos scale
    // console.log(attr);
    if (attr.pos) {
      this.attributes.pos = attr.pos
    }
    if (attr.scale) {
      this.attributes.scale = attr.scale
    }
  }

  get stattr() {
    return this.attributes;
  }

  rotate(angle, duration) {
    this.animate([
      { rotate: parseInt(angle) },
    ], {
      duration: parseInt(duration),
      iterations: Infinity,
      // easing: 'step-end',
      // fill: 'both',
    });
  }

  stanimate() {
    let stPolyline = this.children[0];
    let d = stPolyline.attributes.d
    let stSvg = new StSvgSprite(
      {
        stKey: 'right-arrow',
        pos: [0, 0],
        mode: this.attributes.mode,
        offsetPath: d,
      },
      this.$editor,
    )
    
    this.stInterval = setInterval(() => {
      let svg = stSvg.cloneNode(true)
      this.append(svg);
      let duration = 4000
      svg.animate([
        { offsetDistance: 0 },
        { offsetDistance: 1 },
      ], {
        duration: duration,
        // direction: 'alternate',
        // iterations: Infinity,
        // easing: 'step-end',
      });
      setTimeout(() => {
        svg.remove()
      }, duration)
    }, 200);
  }
}

export default StPipeSprite