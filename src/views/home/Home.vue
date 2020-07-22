<template>
  <div id="home" class="wrapper">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行', '新款', '精选']"
                 @tabClick="tabClick"
                 ref="tabControl1"
                 class="tab-control" v-show="isTabFixed"/>
    <scroll class="content" 
            ref="scroll" 
            :probe-type="3" 
            @scroll="contentScroll" 
            :pull-up-load="true" 
            @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <recommend-view :recommends="recommends" />
      <feature-view/>
      <tab-control :titles="['流行','新款','精选']" 
                    @tabClick="tabClick" 
                    ref="tabControl2"/>
      <goods-list :goods="showGoods"/>
    </scroll>
    <!-- 监听组件点击 必须要加修饰符.native -->
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView'

  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodsList from 'components/content/goods/GoodsList'
  import Scroll from 'components/common/scroll/Scroll'
  import BackTop from 'components/content/backTop/BackTop'



  import {getHomeMultidata, getHomeGoods} from 'network/home'
  import {debounce} from 'common/utiles'

  export default {
    name: "Home",
    components: {
      HomeSwiper,
      RecommendView,
      FeatureView,
      NavBar,
      TabControl,
      GoodsList,
      Scroll,
      BackTop
    },
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {
            page:0,
            list: []
          },
          'new': {
            page:0,
            list: []
          },
          'sell': {
            page:0,
            list: []
          }
        },
        currentType: 'pop',
        isShowBackTop: false,
        tabOffsetTop: 622,
        isTabFixed: false,
        saveY: 0
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    destroyed() {
      console.log('销毁');
    },
    //活跃状态
    activated() {
      this.$refs.scroll.refresh()
      this.$refs.scroll.scrollTo(0, this.saveY, 0)
    },
    // 离开状态
    deactivated() {
      this.saveY = this.$refs.scroll.getScrollY()
    },
    created() {
      //1.请求多个数据
      this.getHomeMultidata();
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')

      //监听goodItem中的图片加载完成
      // this.$bus.$on('itemImageLoad', () => {
      //   this.$refs.scroll && this.$refs.scroll.refresh()
      // })
    },
    mounted() {
      //图片加载完成的事件监听
      const refresh = debounce(this.$refs.scroll.refresh, 50)
      this.$bus.$on('itemImageLoad', () => {
        refresh()
      })
    },
    methods: {
      
      //事件监听相关的方法
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2: 
            this.currentType = 'sell'
            break
        }
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      },
      backClick() {
        //this.$refs.scroll 调取scroll组件对象   然后在调scroll属性  然后再掉scroll属性里的scrollTop方法  容易看不懂
        // this.$refs.scroll.scroll.scrollTo(0, 0, 500)
        this.$refs.scroll.scrollTo(0, 0)
      },
      contentScroll(position) {
        //判断backTop是否显示
        this.isShowBackTop = (-position.y) > 1000
        //决定tabcontrol是否吸顶
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      //加载更多
      loadMore() {
        this.getHomeGoods(this.currentType)
      },
      //实现轮播图加载监控
      swiperImageLoad() {
        //获取tabControl的offsetTop
        //所有的组件都有一个属性  $el 用于获取组件的元素
        // this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
        console.log(this.tabOffsetTop); 
      },
      
      //网络请求相关的方法
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page +1
        getHomeGoods(type, page).then(res => {
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1
          this.$refs.scroll.finishPullUp()
          // this.$refs.scroll && this.$refs.scroll.scroll.refresh()

        })
      } 
    }
  }
</script>

<style scoped>
  #home {
    /*padding-top: 44px;*/
    height: 100vh;
    position: relative;
  }
  .home-nav {
    background-color: var(--color-tint);
    color: #fff;
    /* 子啊使用浏览器原生滚动时   为了让导肮不跟随一起滚动 */
    /* 现在使用better-scroll实现局部滚动，这里就没有必要了 */
    /* position: fixed;
    left: 0;
    top: 0;
    right: 0;
    z-index: 9; */
  }
  .tab-control {
    position: relative;
    z-index: 9; 
  }
 
  .content {
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
  
</style>
