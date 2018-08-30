// component/count-up.js
var cu = require('../../utils/countUp.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    class: String,
    options: {
      type: Object,
      value: {
      useEasing: true, 
      useGrouping: true, 
      separator: ',', 
      decimal: '.', 
      }
    },
    startVal: Number,
    endVal: {
      type : Number,
      value: 0,
      observer(newVal, oldVal, changePath) {
        this._countUp(newVal, oldVal)
      }
    },
    decimals: Number,
    duration: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    count: 0,
    fontSize: 60,
  },

  ready() {
    this._countUp()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _countUp(newVal, oldVal) {
      var countUp = new cu.CountUp(this, 'count', this.data.startVal, this.data.endVal, this.data.decimals, this.data.duration, this.data.options)
      if (!countUp.error) {
        countUp.start(() => {
          this.updateFontSize()
        })
        console.log(this.data.count)
      } else {
        console.error(countUp.error)
      }
    },
    updateFontSize() {
      // if (this.data.count.length >= 8) {
      //   this.setData({
      //     fontSize: this.data.fontSize - 10
      //   })
      // }
    }
  }
})
