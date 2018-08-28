// component/md-input/md-input.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder: String,
    type: {
      type: String,
      value: 'text'
    },
    value: {
      type: String,
      value: '',
      observer: function(newVal, oldVal, changePath) {
        this._inputState()
      }
    },
    width: {
      type: Number,
      value: 150
    },
    color: {
      type: String,
      value: '#6200ee'
    }
  },
  ready: function() {
    wx.createSelectorQuery()
    .in(this)
    .select('#md-input-placeholder')
    .boundingClientRect(res => {
      this.setData({
        '_placeholderWidth': res.width * (this._isEmpty() ? .87 : 1)  + 18
      })
    }).exec()
  },
  attached: function() {
  },
  created: function() {
  },

  /**
   * 组件的初始数据
   */
  data: {
    _isFocus: false,
    _placeholderWidth: 0,
    _focus: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onfocus: function(event) {
      this.setData({
        '_isFocus': true
      })
      this._inputState()
    },
    onblur: function(event) {
      this.setData({
        '_isFocus': false
      })
      this._inputState()
    },
    _handlerInput: function(event) {
      this.setData({
        'value': event.detail.value
      })
      this.triggerEvent('valuechange', event.detail, event.option);
    },
    _inputState() {
      this.setData({
        '_focus': this.data._isFocus ? 'focus input-state' :  
                  !this._isEmpty() ? 'input-state' : ''
      })
    },
    _isEmpty() {
      return this._isUndef(this.data.value)
    },
    _isUndef(v) {
      return v === null || v === undefined || v === ''
    }
  }
})