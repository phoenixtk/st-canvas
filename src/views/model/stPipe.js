import { Group, Path, Block, Gradient, Sprite} from "spritejs";
import tool from "../utils/tool";

// const setDefault = Symbol.for('spritejs_setAttribute');
const pipeCornerUrl = '/img/wanGuan.png';
const cornerCfg = {
  size: 26,
  posfix: 4,
}

class StPipe extends Group {
  constructor(attrs = {}, _vue) {
    attrs = Object.assign({
      // normalize: true,
      size: [1, 1],
      // anchor: [0.5, 0.5],
      // bgcolor: '#cec', // just for test
      borderRadius: 0,
      scale: [1, 1],
    }, attrs)

    super(attrs);
    this.$editor = _vue
    this.id = tool.getUuid();
    this.stInterval = null

    let stPipeBg = new Block({
      bgcolor: new Gradient({
        vector: [0, 0, 0, 14],
        colors: [
          { offset: 0, color: 'rgba(120, 113, 112, 0.7)' },
          { offset: 0.5, color: '#fff' },
          { offset: 1, color: 'rgba(120, 113, 112, 0.7)' },
        ],
      }),
      pos: [0, 0],
      size: [500, 14],
      anchor: [0, 0.5],
      //   borderRadius: 15,
    });
    this.append(stPipeBg);

    this.stPipeBlock = new Block({
      bgcolor: new Gradient({
        vector: [0, 0, 0, 8],
        colors: [
          { offset: 0, color: 'rgba(75, 0, 130, 0.7)' },
          { offset: 0.5, color: 'rgba(75, 0, 130, 0.4)' },
          { offset: 1, color: 'rgba(75, 0, 130, 0.7)' },
        ],
      }),
      pos: [0, 0],
      size: [14, 8],
      anchor: [0, 0.5],
      //   borderRadius: 15,
      borderRadius: 1,
    });

    // this.addPipeCorner('down', [500, 0])

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
    if (attr.point1Direction) {
      console.log('attr.point1Direction changed');
    }
  }

  get stattr() {
    return this.attributes;
  }

  addPipeCorner(direction, pPos) {
    let rotate = 0
    let pos = []
    if (direction === 'down') {
      pos.push(pPos[0] + cornerCfg.size / 2 + cornerCfg.posfix)
      pos.push(pPos[1])
      rotate = 90
    }
    let stPipeCorner = new Sprite({
      pos,
      size: [cornerCfg.size, cornerCfg.size],
      anchor: [0.3, 0.3],
      rotate,
      texture: pipeCornerUrl,
      //   borderRadius: 15,
    });
    this.append(stPipeCorner);
  }

  stanimate() {

    this.stInterval = setInterval(() => {
      let pipeBlock = this.stPipeBlock.cloneNode(true)
      this.append(pipeBlock);
      let speed = 0.083
      pipeBlock.animate([
        // { offsetDistance: 0 },
        // { offsetDistance: 1 },
        {pos: [0, 0]},
        {pos: [500 - cornerCfg.size / 2, 0]},
      ], {
        duration: 500 / speed,
        // direction: 'alternate',
        // iterations: Infinity,
        // easing: 'step-end',
      });
      setTimeout(() => {
        pipeBlock.remove()
      }, 500 / speed)
    }, 380);
  }

  /* pauseAnimation() {
    clearInterval(this.stInterval)
    this.stInterval = null
  }

  playAnimation() {
    this.stanimate()
  } */
}

export default StPipe