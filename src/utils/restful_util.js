export function GET(_this, url, params, callback){
  _this.$axios.get(url,{params})
    .then(function (response) {
        callback(response.data)
    })
    .catch(function (error) {
      error(_this,'获取失败',true)
    })
}

export function POST (_this, url, trans, callback) {
  _this.$axios.post(url, trans)
    .then(function (response) {
      callback(response.data)
    })
    .catch(function (error) {
      console.log(error)
        if (error.response.status == 401) {
            _this.$router.push({path: '/login'})
        }
    })
}

// export function PUT(_this, url,reqObj, callback){
//   _this.$axios.put(url,reqObj).then(function(response){
//     // console.log(response)
//   })
// }

export function DELETE (_this, url, callback) {
  _this.$axios.delete(url)
    .then(function (res) {
      if (res.data.status == '0') {
        callback(res.data)
      }
    })
}

export function DOWNLOADFILE(_this, path, fileName) {
  let url = path + fileName
  _this.$axios({
    method:'get',
    url:url,
    responseType:'blob',
  })
    .then((data) => {
      if (!data) {
        return
      }
      let url = window.URL.createObjectURL(data.data)
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
    })
}
