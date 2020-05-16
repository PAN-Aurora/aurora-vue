export function info (_this, msg, remind) {
  if (remind === undefined || remind) {
    _this.$message.info(msg);
  }
}

export function success (_this, msg, remind) {
  if (remind === undefined || remind) {
    _this.$message.success(msg);
  }
}

export function warning (_this, msg, remind) {
  if (remind === undefined || remind) {
    _this.$message.warning(msg);
  }
}

export function notificationWarn (_this, msg) {
  _this.$notification['warning']({
    duration: 6,
    message: '警告',
    description: msg
  });
}

export function notificationInfo (_this, msg) {
  _this.$notification['info']({
    duration: 6,
    message: '提示信息',
    description: msg
  });
}

export function error (_this ,msg, remind) {
  if (remind === undefined || remind) {
    _this.$message.error(msg);
  }
}

export function confirm (_this,title,content,successCallback) {
  let config = {
    title: title,
    content: content,
    onOk: function(){
       successCallback(true)
    }
  };
  _this.$confirm(config);
}
