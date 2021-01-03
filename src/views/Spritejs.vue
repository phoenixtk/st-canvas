<template>
  <div>
    <div id="container" style="width:1000px;height:800px"></div>
  </div>
</template>

<script>
  import * as spritejs from 'spritejs';

  export default {
    //import引入的组件需要注入到对象中才能使用",
    components: {},
    data() {
      //这里存放数据",
      return {};
    },
    //监听属性 类似于data概念",
    computed: {},
    //监控data中的数据变化",
    watch: {},
    //方法集合",
    methods: {
      show1() {
        const imgUrl = 'https://s5.ssl.qhres.com/static/ec9f373a383d7664.svg'
        const {Scene, Sprite} = spritejs;
        const container = document.getElementById('container');
        const paper = new Scene({
          container,
          width: 400,
          height: 400,
        })

        const sprite = new Sprite(imgUrl)
        sprite.attr({
          bgcolor: '#fff',
          pos: [0, 0],
          size: [400, 400],
          borderRadius: '200'
        })

        paper.layer().appendChild(sprite)
      },
      show2() {
        const {Scene, Sprite} = spritejs;

        const container = document.getElementById('container');
        const scene = new Scene({container, width: 1000, height: 800, mode: 'stickyTop'});

        const layer = scene.layer();

        const robot = new Sprite('https://p5.ssl.qhimg.com/t01c33383c0e168c3c4.png');

        robot.attr({
          anchor: [0, 0.5],
          pos: [0, 0],
        });

        robot.animate([
          {pos: [0, 0]},
          {pos: [0, 200]},
          {pos: [300, 0]},
          {pos: [300, 200]},
          {pos: [600, 200]},
          {pos: [600, 0]},
        ], {
          duration: 5000,
          iterations: Infinity,
          direction: 'alternate',
        });

        layer.append(robot);
      }
    },
    //生命周期 - 创建完成（可以访问当前this实例）",数据模型已加载，方法已加载,html模板已加载,html模板未渲染
    created() {

    },
    //生命周期 - 挂载完成（可以访问DOM元素）",html模板已渲染
    mounted() {
      this.show2();
    },
    //生命周期 - 更新之后",数据模型已更新,html模板已更新
    updated() {

    },
    //生命周期 - 销毁之前",
    beforeDestroy() {

    },
    destroyed() {

    },
    //生命周期 - 销毁完成",
    //如果页面有keep-alive缓存功能，这个函数会触发",
    activated() {

    },
  }

</script>

<style lang="scss" scope>

</style>