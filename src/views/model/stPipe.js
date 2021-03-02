import { Group, Path, Block, Gradient, Sprite } from "spritejs";
import tool from "../utils/tool";

// const setDefault = Symbol.for('spritejs_setAttribute');
const pipeCornerUrl = '/img/wanGuan.png';
const pipeDiameter = 14
const pipeBlock = {
  width: 14,
  height: 8,
}
const cornerCfg = {
  size: 26,
  posfix: 4,
}

function getDirectNext(preDirect) {
  if (preDirect === 'up' || preDirect === 'down') {
    return 'right'
  } else {
    return 'down'
  }
}

function getPos(type, index) {
  if (type === 'pipe') {
    if (index === 0) {
      return [0, 0]
    } else if (index === 1) {
      if (this.directArr[1] === 'down' || this.directArr[1] === 'up') {
        if (this.directArr[0] === 'right') {
          return [this.lengthArr[0] + cornerCfg.posfix, (this.directArr[1] === 'up' ? -1 : 1) * (cornerCfg.size / 2 + cornerCfg.posfix)]
        } else if (this.directArr[0] === 'left') {
          return [- (this.lengthArr[0] + cornerCfg.posfix), (this.directArr[1] === 'up' ? -1 : 1) * (cornerCfg.size / 2 + cornerCfg.posfix)]
        }
      } else if (this.directArr[1] === 'right' || this.directArr[1] === 'left') {
        if (this.directArr[0] === 'up') {
          return [(this.directArr[1] === 'left' ? -1 : 1) * (cornerCfg.size / 2 + cornerCfg.posfix), - (this.lengthArr[0] + cornerCfg.posfix)]
        } else if (this.directArr[0] === 'down') {
          return [(this.directArr[1] === 'left' ? -1 : 1) * (cornerCfg.size / 2 + cornerCfg.posfix), this.lengthArr[0] + cornerCfg.posfix]
        }
      }
    }
  }
}

class StPipe extends Group {
  constructor(attrs = {}, _vue) {
    attrs = Object.assign({
      // normalize: true,
      size: [7, 7],
      // anchor: [0.5, 0.5],
      // bgcolor: '#cec', // just for test
      borderRadius: 0,
      scale: [1, 1],
    }, attrs)

    super(attrs);
    this.$editor = _vue
    this.id = tool.getUuid();
    this.stPipeBlocks = {}
    this.stInterval = null
    this.directArr = []
    this.lengthArr = []
    this.directArr[0] = 'right'
    this.lengthArr[0] = 500
    this.strender(1)

    // this.addCorner('down', [500, 0])

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

  set stattr(attr) {
    if (attr.pos) {
      this.attributes.pos = attr.pos
    }
    if (attr.scale) {
      this.attributes.scale = attr.scale
    }
    if (attr.point1Direction && attr.point1Length) {
      this.directArr[0] = attr.point1Direction
      this.lengthArr[0] = attr.point1Length
      this.strender(1)
    } else if (attr.point2Direction && attr.point2Length) {
      // console.log(attr.point2Direction, attr.point2Length);
      this.directArr[1] = attr.point2Direction
      this.lengthArr[1] = attr.point2Length
      this.strender(2)
    }
  }

  get stattr() {
    return this.attributes;
  }

  active(b) {
    if (b) {
      this.attributes.borderWidth = 1 / this.attributes.scale[0]
      this.attributes.borderColor = 'blue'
      this.actived = true
      // 暂时只处理一个选中的时候
      this.$editor.showProp(this)
    } else {
      this.attributes.borderWidth = 0
      this.attributes.borderColor = 'white'
      this.actived = false
      this.$editor.unactivatedData(this)
    }
  }

  del() {
    this.remove()
  }

  intervalClear() {
    clearInterval(this.stInterval)
    this.removeAllChildren()
    this.removeAllListeners()
  }

  /* 
    绘制管道主方法
    @partsCnt 绘制管道数 无拐角为1 一拐角为2 二拐角为3
  */
  strender(partsCnt) {
    if (this.directArr.length >= 3) {
      this.$editor.$message({
        dangerouslyUseHTMLString: true,
        message: "暂不支持4段",
        duration: 1000,
        center: true,
        showClose: true,
      });
      return
    }
    this.intervalClear()

    let length1 = null
    let length2 = null
    let length3 = null
    if (partsCnt === 1) {
      length1 = this.lengthArr[0] === undefined ? 500 : this.lengthArr[0]
    } else if (partsCnt === 2) {
      this.directArr[1] = this.directArr[1] === undefined ? getDirectNext(this.directArr[0]) : this.directArr[1]
      this.lengthArr[1] = this.lengthArr[1] === undefined ? this.lengthArr[0] : this.lengthArr[1]
      length1 = this.lengthArr[0] - cornerCfg.size / 2
      length2 = this.lengthArr[1] - cornerCfg.size / 2
    } else if (partsCnt === 3) {
      this.directArr[1] = this.directArr[1] === undefined ? getDirectNext(this.directArr[0]) : this.directArr[1]
      this.lengthArr[1] = this.lengthArr[1] === undefined ? this.lengthArr[0] : this.lengthArr[1]
      this.directArr[2] = this.directArr[2] === undefined ? getDirectNext(this.directArr[1]) : this.directArr[2]
      this.lengthArr[2] = this.lengthArr[2] === undefined ? this.lengthArr[1] : this.lengthArr[2]
      length1 = this.lengthArr[0] - cornerCfg.size / 2
      length2 = this.lengthArr[1] - cornerCfg.size
      length3 = this.lengthArr[2] - cornerCfg.size / 2
    }

    if (partsCnt === 1) {
      this.addPipe(partsCnt, 0, length1)
    } else if (partsCnt === 2) {
      this.addPipe(partsCnt, 0, length1)
      this.addCorner(1, length1)
      this.addPipe(partsCnt, 1, length2)
    } else if (partsCnt === 3) {
      this.addPipe(partsCnt, 0, length1)
      this.addCorner(1, length1)
      this.addPipe(partsCnt, 1, length2)
      this.addCorner(2, length2)
      this.addPipe(partsCnt, 2, length3)
    }

    // this.addPartSecond(partsCnt, length1, length2)

    this.stanimate(partsCnt, length1, length2, length3)
  }

  addPipe(partsCnt, partsCur, length) {
    // console.log('addPipe:' + partsCnt + ',' + partsCur + ',' + length);
    let vector = null
    let size1 = null
    let size2 = null
    let anchor = null
    // console.log(this.directArr[partsCur]);
    if (this.directArr[partsCur] === 'up' || this.directArr[partsCur] === 'down') {
      vector = [0, 0, 1, 0]
      size1 = [pipeDiameter, (this.directArr[partsCur] === 'up' ? -1 : 1) * length]
      size2 = [pipeBlock.height, (this.directArr[partsCur] === 'up' ? -1 : 1) * pipeBlock.width]
      anchor = [0.5, 0]
    } else {
      vector = [0, 0, 0, 1]
      size1 = [(this.directArr[partsCur] === 'left' ? -1 : 1) * length, pipeDiameter]
      size2 = [(this.directArr[partsCur] === 'left' ? -1 : 1) * pipeBlock.width, pipeBlock.height]
      anchor = [0, 0.5]
    }

    let vector1 = vector.map(function (i) {
      return i * pipeDiameter
    })

    let stPipeBg = new Block({
      bgcolor: new Gradient({
        vector: vector1,
        colors: [
          { offset: 0, color: 'rgba(120, 113, 112, 0.7)' },
          { offset: 0.5, color: '#fff' },
          { offset: 1, color: 'rgba(120, 113, 112, 0.7)' },
        ],
      }),
      pos: getPos.call(this, 'pipe', partsCur),
      size: size1,
      anchor,
      //   borderRadius: 15,
    });
    this.append(stPipeBg);

    let vector2 = vector.map(function (i) {
      return i * pipeBlock.height
    })

    if (partsCnt === 1) {
      this.stPipeBlocks.block1 = new Block({
        bgcolor: new Gradient({
          vector: vector2,
          colors: [
            { offset: 0, color: 'rgba(75, 0, 130, 0.7)' },
            { offset: 0.5, color: 'rgba(75, 0, 130, 0.4)' },
            { offset: 1, color: 'rgba(75, 0, 130, 0.7)' },
          ],
        }),
        pos: getPos.call(this, 'pipe', partsCur),
        size: size2,
        anchor,
        //   borderRadius: 15,
        borderRadius: 1,
      });
    } else if (partsCnt === 2) {
      this.stPipeBlocks.block2 = new Block({
        bgcolor: new Gradient({
          vector: vector2,
          colors: [
            { offset: 0, color: 'rgba(75, 0, 130, 0.7)' },
            { offset: 0.5, color: 'rgba(75, 0, 130, 0.4)' },
            { offset: 1, color: 'rgba(75, 0, 130, 0.7)' },
          ],
        }),
        pos: getPos.call(this, 'pipe', partsCur),
        size: size2,
        anchor,
        //   borderRadius: 15,
        borderRadius: 1,
      });
    }

  }

  addCorner(partsCur, length) {
    // console.log(partsCur, length, this.directArr);
    let curDirect = null
    let preDirect = this.directArr[partsCur - 1]
    if (preDirect === 'up' || preDirect === 'down') {
      curDirect = this.directArr[partsCur] === undefined ? 'right' : this.directArr[partsCur]
    } else {
      curDirect = this.directArr[partsCur] === undefined ? 'down' : this.directArr[partsCur]
    }

    let rotate = 0
    let pos = []
    // console.log(preDirect, curDirect);
    let lengthFact = length + cornerCfg.size / 2 + cornerCfg.posfix
    if (curDirect === 'down') {
      if (preDirect === 'right') {
        pos.push(lengthFact)
        pos.push(0)
        rotate = 90
      } else if (preDirect === 'left') {
        pos.push(-lengthFact)
        pos.push(0)
        rotate = 0
      }
    } else if (curDirect === 'up') {
      if (preDirect === 'right') {
        console.log('right up 23434346668');
        pos.push(lengthFact)
        pos.push(0)
        rotate = 180
      } else if (preDirect === 'left') {
        pos.push(-lengthFact)
        pos.push(0)
        rotate = 270
      }
    } else if (curDirect === 'right') {
      if (preDirect === 'up') {
        pos.push(0)
        pos.push(-lengthFact)
        rotate = 0
      } else if (preDirect === 'down') {
        pos.push(0)
        pos.push(lengthFact)
        rotate = 270
      }
    } else if (curDirect === 'left') {
      if (preDirect === 'up') {
        pos.push(0)
        pos.push(-lengthFact)
        rotate = 90
      } else if (preDirect === 'down') {
        pos.push(0)
        pos.push(lengthFact)
        rotate = 180
      }
    }

    let stPipeCorner = new Sprite({
      pos,
      size: [cornerCfg.size, cornerCfg.size],
      anchor: [0.3, 0.3],
      rotate,
      texture: pipeCornerUrl,
      // borderRadius: 15,
    });
    this.append(stPipeCorner);
  }

  stanimate(partsCnt, length1, length2, length3) {
    // console.log(partsCnt, length1, length2, length3);
    this.stInterval = setInterval(() => {
      let pipeBlock1 = null
      let pipeBlock2 = null
      let pipeBlock3 = null

      pipeBlock1 = this.stPipeBlocks.block1.cloneNode(true)
      this.append(pipeBlock1);
      let speed = 0.083
      let targetPos = []
      if (this.directArr[0] === 'up' || this.directArr[0] === 'down') {
        targetPos = [0, (this.directArr[0] === 'up' ? -1 : 1) * (length1 - cornerCfg.size / 2)]
      } else {
        targetPos = [(this.directArr[0] === 'left' ? -1 : 1) * (length1 - cornerCfg.size / 2), 0]
      }
      pipeBlock1.animate([
        // { offsetDistance: 0 },
        // { offsetDistance: 1 },
        { pos: getPos.call(this, 'pipe', 0) },
        { pos: targetPos },
      ], {
        duration: length1 / speed,
        // direction: 'alternate',
        // iterations: Infinity,
        // easing: 'step-end',
      });
      setTimeout(() => {
        pipeBlock1.remove()
      }, length1 / speed)

      if (partsCnt === 2 || partsCnt === 3) {
        pipeBlock2 = this.stPipeBlocks.block2.cloneNode(true)
        this.append(pipeBlock2);
        let speed = 0.083
        let posStart = getPos.call(this, 'pipe', 1)
        let targetPos = []
        if (this.directArr[1] === 'up' || this.directArr[1] === 'down') {
          targetPos = [posStart[0], (this.directArr[1] === 'up' ? -1 : 1) * (length2 - cornerCfg.size / 2) + posStart[1]]
        } else {
          targetPos = [(this.directArr[1] === 'left' ? -1 : 1) * (length2 - cornerCfg.size / 2) + posStart[0], posStart[1]]
        }
        // console.log(posStart, targetPos);
        pipeBlock2.animate([
          // { offsetDistance: 0 },
          // { offsetDistance: 1 },
          { pos: posStart },
          { pos: targetPos },
        ], {
          duration: length2 / speed,
          // direction: 'alternate',
          // iterations: Infinity,
          // easing: 'step-end',
        });

        setTimeout(() => {
          pipeBlock2.remove()
        }, length2 / speed)
      }

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