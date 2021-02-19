import { Polyline } from "spritejs";
import tool from "../utils/tool";

// const setDefault = Symbol.for('spritejs_setAttribute');

const lineCfg = {
  l1broken: {
    points: [200, 0],
  },
  l3broken: {
    points: [100, 0, 100, 100, 200, 100],
  },
  strokeColor: "black",
  lineWidth: 2,
}

class StLineSprite extends Polyline {
  constructor(attrs = {}, _vue) {
    function getDefalutPoints(stKey) {
      if (stKey === 'polyline1broken') {
        return [0, 0, ...lineCfg.l1broken.points]
      } else if (stKey === 'polyline3broken') {
        return [0, 0, ...lineCfg.l3broken.points]
      }
    }
    attrs = Object.assign({
      // normalize: true,
      strokeColor: lineCfg.strokeColor,
      lineWidth: lineCfg.lineWidth,
      points: getDefalutPoints(attrs.stKey),
      // lineJoin: 'bevel'
    }, attrs)

    super(attrs);
    this.$editor = _vue
    this.id = tool.getUuid();
    

    if(attrs.mode === 'edit') {
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


    /* this.addEventListener('mousedown', () => {
      this.attr({scale: 0.9});
    });
    this.addEventListener('mouseup', () => {
      this.attr({scale: 1.0});
    });
    this.addEventListener('mouseenter', () => {
      this.layer.canvas.style.cursor = 'pointer';
    });
    this.addEventListener('mouseleave', () => {
      this.layer.canvas.style.cursor = '';
    }); */
  }

  active(b) {
    if (b) {
      this.attributes.strokeColor = "blue",
      this.attributes.lineWidth = 4
      this.actived = true
      // 暂时只处理一个选中的时候
      this.$editor.showProp(this)
    } else {
      this.attributes.strokeColor = "black",
      this.attributes.lineWidth = 2
      this.actived = false
      this.$editor.unactivatedData(this)
    }
  }

  del() {
    this.remove()
  }

  set stattr(attr) {
    // 暂时支持以下属性
    if (attr.pos) {
      this.attributes.pos = attr.pos
    } else if (attr.scale) {
      this.attributes.scale = attr.scale
    } else if (attr.points) {
      this.attributes.points = attr.points
    }
  }

  get stattr() {
    return this.attributes;
  }
}

export default StLineSprite