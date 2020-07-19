<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    name: 'Scroll',
    props: {
      probeType: {
        type: Number,
        default: 0
      },
      pullUpLoad: {
        type: Boolean,
        default: false
      }
    },
     data() {
      return {
        scroll: null,
      }
    },
    mounted() {
      //创建bscroll对象
      this.scroll = new BScroll(this.$refs.wrapper, {
        click: true,
        probeType: this.probeType,
        pullUpLoad: this.pullUpLoad
      })
      //监听滚动位置后展示 回到顶部功能
      this.scroll.on('scroll', position => {
        this.$emit('scrollY', position)
      })
      this.scroll.on('pullingUp', () => {
        this.$emit('pullingUp')
        
      })
    },
    methods: {
      //自己封装一个方法方便在 Home组件里直接调用  这里设置time=500是一个默认值
      scrollTo(x, y, time = 500) {
        this.scroll.scrollTo(x, y, time)
      },
      finishPullUp() {
        this.scroll.finishPullUp()
      }
    }
  }
</script>

<style scoped>

</style>