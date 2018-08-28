// component/md-checkbox/md-checkbox.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    checked: {
      type: Boolean,
      value: false,
      observer: function(newVal, oldVal, changedPath) {
        if (oldVal !== newVal) {
          this.setData({
            '_checked__class': newVal ? 'checked' : ''
          })

          this.triggerEvent('checkchanged', 
          { checked: newVal, key: this.data.key})
        }
      }
    },
    disabled: {
      type: Boolean,
      value: false
    },
    color: {
      type: String,
      value: '#6200ee'
    },
    label: String,
    key: String
  },

  ready () {

  },

  /**
   * 组件的初始数据
   */
  data: {
    _checked__class: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _onChecked (e) {
      if (this.data.disabled) return
      this.setData({
        'checked': !this.data.checked
      })
    }
  }
})
