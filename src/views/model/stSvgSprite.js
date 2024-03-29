import { Group, Path } from "spritejs";
import getSvgPath from "../utils/svgMock";
// import ctrlBlock from "../utils/ctrlBlock";
import tool from "../utils/tool";
import svg from "../utils/svg";

// const setDefault = Symbol.for('spritejs_setAttribute');

const scaleObj = svg.getScale()


class StSvgSprite extends Group {
  constructor(attrs = {}, _vue) {
    attrs = Object.assign({
      normalize: true,
      size: svg.getSize(),
      anchor: [0.5, 0.5],
      // bgcolor: '#cec', // just for test
      borderRadius: 0,
      scale: [
        scaleObj.VIEWBOX_SCALE_INIT,
        scaleObj.VIEWBOX_SCALE_INIT,
      ], // svg width(height) divide svg viewBox width(height)
    }, attrs)
    
    super(attrs);
    this.$editor = _vue
    this.id = tool.getUuid();
    let dArr = getSvgPath(attrs.stKey);
    for (const item of dArr) {
      const path = new Path();
      path.attr({
        pos: [- 611, - 512],
        d: item.d,
        // scale: 3,
        anchor: [0.5, 0.5],
        // strokeColor: 'red',
        fillColor: item.fill,
        // rotate: i * 60,
      });
      this.append(path);
    }

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
      {rotate: parseInt(angle)},
    ], {
      duration: parseInt(duration),
      iterations: Infinity,
      // easing: 'step-end',
      // fill: 'both',
    });
  }
}

export default StSvgSprite