export default abstract class BaseTemplate {

  cb


  constructor (scene, parent, data) {

  }

  check () {

  }

  onSubmit (cb) {
    this.cb = cb
  }


}