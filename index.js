class L {
  constructor() {
    this.args = {}
    this.fnMap = new Map()
  }

  _newArg() {
    return {
      ready: false,
      fnArr: [],
    }
  }

  _newFnDesc() {
    return {
      listenArgs: [],
      runOnce: false,
      hasRun: false,
    }
  }

  /**
   *
   * @param {Array<String>|String} args 监听的变量
   * @param {Function} fn 回调函数
   * @param {Boolean} runOnce 回调函数是否需要在执行成功之后移除
   */
  _set(arg, fn, runOnce) {
    if (!this.args[arg]) {
      // 初始化arg
      this.args[arg] = this._newArg()
    }

    // 初始化fnDesc
    let fnDesc = this.fnMap.get(fn)
    if (fnDesc) {
      fnDesc.listenArgs.push(arg)
    } else {
      let newFnDesc = this._newFnDesc()
      newFnDesc.listenArgs.push(arg)
      newFnDesc.runOnce = runOnce
      this.fnMap.set(fn, newFnDesc)
    }

    this.args[arg].fnArr.push(fn)

    if (this.args[arg].ready) {
      // 如果该值已准备就绪则预运行fn
      this._run(fn)
    }
  }

  /**
   * 预运行fn
   * @param {Function} fn 监听函数
   */
  _run(fn) {
    const fnDesc = this.fnMap.get(fn)

    if (!fnDesc) {
      return
    }

    if (fnDesc.runOnce && fnDesc.hasRun) {
      return
    }

    for (const arg of fnDesc.listenArgs) {
      if (!this.args[arg].ready) {
        return
      }
    }

    fnDesc.hasRun = true
    fn()
    if (fnDesc.runOnce) {
      setTimeout(() => {
        this._remove(fn)
      })
    }
  }

  /**
   * 移除fn在args、fnMap中所有记录
   * @param {Function} fn 
   */
  _remove(fn) {
    const fnDesc = this.fnMap.get(fn)

    for (const arg of fnDesc.listenArgs) {
      const idx = this.args[arg].fnArr.indexOf(fn)

      if (idx === -1) {
        continue
      }

      this.args[arg].fnArr.splice(idx, 1)
    }

    this.fnMap.delete(fn)
  }

  /**
   *
   * @param {Array<String>|String} args 监听的变量
   * @param {Function} fn 回调函数
   * @param {Boolean} runOnce 回调函数是否需要在执行成功之后移除
   */
  _listen(args, fn, runOnce = true) {
    if (!args) {
      return
    }

    if (args.constructor === String) {
      args = [args]
    }

    for (const arg of args) {
      this._set(arg, fn, runOnce)
    }
  }

  /**
   *
   * @param {Array<String>|String} args 监听的变量
   * @param {Function} fn 回调函数
   */
  listenOnce(args, fn) {
    this._listen(args, fn)
  }

  /**
   *
   * @param {Array<String>|String} args 监听的变量
   * @param {Function} fn 回调函数
   */
  listen(args, fn) {
    this._listen(args, fn, false)
  }

  /**
   *
   * @param {Array<String>|String} args 将变量状态置为ready,检查并执行监听函数
   */
  ready(args) {
    if (!args) {
      return
    }

    if (args.constructor === String) {
      args = [args]
    }

    for (const arg of args) {
      if (this.args[arg]) {
        this.args[arg].ready = true
        for (const fn of this.args[arg].fnArr) {
          this._run(fn)
        }
      } else {
        this.args[arg] = this._newArg()
      }
    }
  }

  /**
   *
   * @param {Array<String>|String} args 需要重置状态的变量
   */
  reset(args) {
    if (!args) {
      return
    }

    if (args.constructor === String) {
      args = [args]
    }

    for (const arg of args) {
      if (this.args[arg]) {
        this.args[arg].ready = false
      }
    }
  }
}

module.exports = L
