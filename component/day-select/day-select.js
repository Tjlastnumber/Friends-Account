// component/day-select/day-select.js
const uitls = require('../../utils/util.js')
const today = new Date()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    year: {
      type: Number,
      value: today.getFullYear(),
      observer() {
        this._initDay()
      }
    },
    month: {
      type: Number,
      value: today.getMonth() + 1,
      observer() {
        this._initDay()
      }
    },
    tags: {
      type: Array,
      value: []
    },
    day: {
      type: String,
      value: 1,
      observer(newVal, oldVal) {
        this.setData({
          selectedDay: newVal
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    selectedDay: 0,
    everyDay: [ ]
  },

  ready() {
    console.log("day-select ready start")
    this._initDay()
    console.log('day-select ready end')
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _initDay() {
      console.log('init day');
      var day_number = new Date(this.data.year, this.data.month, 0).getDate()
      var every_day = []
      for (var d = 1; d <= day_number; d++) {
        every_day.push({
          id: 'd-' + d,
          tag: this.data.tags.find(v=> v === d),
          year: this.data.year,
          month: this.data.month,
          day: d,
        })
      }
      this.setData({
        everyDay: every_day
      })
    },
    _selectDay(e) {
      this.setData({
        selectedDay: e.target.dataset.item.day
      })
      this.triggerEvent('selectedDay', e.target.dataset.item, e.option)
    }
  }
})
