class Request {
    // axios请求二次封装
    static post(that, api, data = {}, operated = false) {
        return that.$axios.post(api, data).then(res => {
            if (res.data.code === 200) {
                if (operated) {
                    that.$message.success(res.data.message)
                    return res.data.message
                } else {
                    return res.data.data
                }
            }else {
                throw res.data
            }
        }).catch(err => {
            console.log('http错误');
            console.log(err);
            // that.$message.error('无法连接服务器');
            that.$message.error(err.message ? err.message : err.toString())
        })
    }

    static get(that, api, data = {}, operated = false) {
        return that.$axios.get(api, data).then(res => {
            if (res.data.code === 200) {
                if (operated) {
                    that.$message.success(res.data.message)
                    return res.data.message
                } else {
                    return res.data.data
                }
            }else {
                throw res.data
            }
        }).catch(err => {
            console.log('http错误');
            console.log(err);
            // that.$message.error('无法连接服务器');
            that.$message.error(err.message ? err.message : err.toString())
        })
    }
    //不弹出提示 的get
    static GET(that, api, data = {}) {
        return that.$axios.get(api, data).then(res => {
            if (res.data.code === 200) {
                return res.data.data
            }else {
                throw res.data
            }
        }).catch(err => {
            console.log('http错误');
            console.log(err);
            // that.$message.error('无法连接服务器');
        })
    }

     //不弹出信息的 post
     static POST(that, api, data = {}) {
        return that.$axios.post(api, data).then(res => {
            if (res.data.code === 200) {
                    return res.data.data
            }else {
                throw res.data
            }
        }).catch(err => {
            console.log('http错误');
            console.log(err);
            // that.$message.error('无法连接服务器');
           // that.$message.error(err.message ? err.message : err.toString())
        })
    }
}

export default {
    install(Vue) {
        Vue.prototype.Request = Request;
    }
}