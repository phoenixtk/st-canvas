import { Group, Path } from "spritejs";
import getSvgPath from "../utils/svgMock";
import ctrlBlock from "../utils/ctrlBlock";

const setDefault = Symbol.for('spritejs_setAttribute');

const scaleObj = {
  COMPONENTS_SVG_SCALE: 50 / 1024,
  VIEWBOX_SCALE_INIT: 64 / 1024,
};


class StSvgSprite extends Group {
  constructor(attrs = {}) {
    attrs = Object.assign({
      normalize: true,
      size: [1222, 1024],
      anchor: [0, 0],
      // bgcolor: '#cec', // just for test
      borderRadius: 0,
      scale: [
        scaleObj.VIEWBOX_SCALE_INIT,
        scaleObj.VIEWBOX_SCALE_INIT,
      ], // svg width(height) divide svg viewBox width(height)
    }, attrs)
    
    super(attrs);
    let dArr = getSvgPath(attrs.stKey);
    for (const item of dArr) {
      const path = new Path();
      path.attr({
        d: item.d,
        // scale: 3,
        // anchor: [0, 0.5],
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
        this.active(true);
        evt.stopPropagation();
      });
  
      this.addEventListener('mouseup', (evt) => {
        delete window.mousedownObj
        evt.stopPropagation()
      });

      this.addEventListener('click', (evt) => {
        for (const child of this.layer.children) {
          if (child !== this) {
            child.active(false)
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
    } else {
      this.attributes.borderWidth = 0,
      this.attributes.borderColor = 'white'
    }
  }
}

export default StSvgSprite