//  抽离组件  是对象
export const props = {
  value: {
    type: [String, Number, Array, Date],
    default: ''
  },
  config: {
    type: Object,
    default: () => ({})
  }
}

// 是对象
export const mixin = {
  watch: {
    value: {
      handler(newValue) {
        this.val = newValue
      },
      immediate: true
    },
    config: {
      handler(val) {
        this.initOptions()
        this.initProps()
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      options: [],
      props: {
        label: 'label',
        value: 'value'
      }
    }
  },
  computed: {
    url() {
      return this.config?.url
    },
    method() {
      return this.config?.method || 'GET'
    },
    initRequest() {
      return this.config?.initRequest
    }
  },
  methods: {

    // 发送请求
    initOptions() {
      if (this.url) {
        this.getOptions()
        return false
      }

      const options = this.config.options
      if (options && Array.isArray(options) && options.length > 0) {
        this.options = options
        // console.log(options)
      }
    },

    // 监听 子组件传递的值
    handleSelectChangeEvent(value) {
      // console.log('1', value)
      this.$emit('update:value', value)
    },

    // 更改 options 属性  重新赋值   可以自动识别
    // 解决方案   接收 父组件的props  在赋值  在自动转换
    initProps() {
      // console.log('2', this.config)
      const props = this.config.props
      const keys = Object.keys(this.props)
      // console.log('1', props, keys)

      // 父传过来的值  检测类型
      if (props && Object.prototype.toString.call(props) === '[object Object]') {
        for (const key in props) {
          if (keys.includes(key)) {
            // 赋值   props[label]=name  props[value]=id
            this.props[key] = props[key]
          }
        }
      }

      //
    },

    // 请求
    async getOptions() {
      if (!this.initRequest) {
        return false
      }
      // console.log('url', this.url)
      // console.log('method', this.method)

      const res = await this.$axios({
        url: this.url,
        method: this.method
      })
      // console.log('res', res)

      const data = res.data.data
      this.options = data
      // console.log('options', this.options)
    }
  }
}
