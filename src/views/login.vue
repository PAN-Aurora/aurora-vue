<style scoped>
 /deep/ .ant-input-affix-wrapper .ant-input:not(:first-child) {
   padding-left: 18%;
}
</style>
<template>
  <div class="login">
    <div
      style="width:27%;min-width:400px;background-color: white;margin-top: 9%;margin-right: 58%;margin-left: 13%;border-radius:25px;"
    >
      <a-form
        id="formLogin"
        class="user-layout-login"
        ref="formLogin"
        :form="form"
        @submit="handleSubmit"
      >
        <a-form-item style="margin-bottom: 0;margin-left:12%;margin-top:15.4%;height:68px;">
          <a-input
            class="light_input"
            size="large"
            type="text"
            placeholder="请输入账号"
            ref="account"
            v-model="account"
            style="width: 85%;height:50px;"
          >
            <a-icon
              slot="prefix"
              type="user"
              :style="{ color: '#108def', fontSize: 'x-large',marginLeft: '50%'}"
            />
          </a-input>
        </a-form-item>

        <a-form-item style="margin-bottom: 0;margin-left:12%;margin-top:6.4%;height:68px;">
          <a-input
            class="light_input"
            size="large"
            type="password"
            autocomplete="false"
            placeholder="请输入密码"
            v-model="password"
            style="width: 85%;height:50px;"
            ref="password"
          >
            <a-icon
              slot="prefix"
              type="lock"
              :style="{ color: '#108def',fontSize: 'x-large',marginLeft: '50%' }"
            />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-checkbox
            v-decorator="['rememberMe']"
            :checked="remembered"
            style="margin-left: 11%;margin-top:4%"
            @change="changeRemembered"
          >记住密码</a-checkbox>
        </a-form-item>

        <a-form-item style="margin-top:24px">
          <a-button
            size="large"
            type="primary"
            class="login-button"
            :loading="state.loginBtn"
            :disabled="state.loginBtn"
            style="width:75%;height:50px;margin-left:11%;margin-bottom: 12%"
            @click="handleSubmit"
          >登录</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import { POST } from "../utils/restful_util";
import { generateMenus } from "../utils/object_util";
import { appRouter } from "../router/router";
import { info, warning } from "../utils/alert_util";

export default {
  data() {
    return {
      remembered: true,
      account: "",
      password: "",
      loginBtn: false,
      form: this.$form.createForm(this),
      appRouter: appRouter,
      state: {
        time: 60,
        loginBtn: false
      }
    };
  },

  created() {
    this.initAccount();
    document.onkeydown = () => {
      if (window.event.keyCode == 13) {
        if (this.$route.path == "/login") {
          this.handleSubmit();
        }
      }
    };
  },

  methods: {
    /**
     * @method changeRemembered 记住密码绑定修改时间
     */
    changeRemembered(e) {
      const remembered = e.target.checked;
      this.remembered = remembered;
      this.$ls.set("remembered", remembered);
    },

    /**
     * @method initAccount 记住密码初始化
     */
    initAccount() {
      this.remembered = this.$ls.get("remembered") || false;
      const accountStr = this.$ls.get("accountStr");
      if (accountStr) {
        const { account, password } = JSON.parse(accountStr);
        this.account = account;
        this.password = password;
      }
    },

    /**
     * @method handleSubmit 提交登录
     */
    async handleSubmit(e) {
      try {
        if (this.account == "" || this.account.length ==0) {
          warning(this, "账号格式错误");
          this.$refs.account.focus();
          return;
        }
        if (this.password == "" || this.password.length < 4) {
          warning(this, "密码格式错误");
          this.$refs.password.focus();
          return;
        }
  

         this.state.loginBtn = true;
        let formData = new FormData();
        formData.append("userName", this.account);
        formData.append("passWord",this.password);
         let res = await this.Request.post(this, "/api/auth/login",formData);

        let menuArray = [];
        if(res.user.menuList){
          console.info(res.user.menuList)
            res.user.menuList.forEach(menu=>{
                  if(menu.module){
                     menuArray.push(menu.module);
                  }
            });
        }
        this.$ls.set("userToken", res.token, 12*60*60*1000);
        let menus = generateMenus(this,menuArray, appRouter);
        this.$router.addRoutes(menus.addRoutes);
        this.$store.commit("updateMenulist", menus.menu);
        this.$store.dispatch("getBaseData");

        sessionStorage.setItem("userName", res.user.username);
        sessionStorage.setItem("realName", res.user.realName);
        sessionStorage.setItem("btnPermission", menuArray);
        sessionStorage.setItem("userId", res.id);
        sessionStorage.setItem("account", this.account);
        this.$ls.set("resMenu", JSON.stringify(menuArray));
        info(this, "登录成功");

        this.$router.push({ path: "/system/userManage" });

        if (this.remembered) {
          this.$ls.set(
            "accountStr",
            JSON.stringify({
              account: this.account,
              password: this.password
            })
          );
        } else {
          this.$ls.remove("accountStr");
        }
      } catch (e) {
        setTimeout(() => {
          this.state.loginBtn = false;
        }, 600);
      }
    }
  }
};
</script>

<style lang="less" scoped>
//登录背景图
.login {
  display: flex;
  width: @full;
  height: @full;
  justify-content: center;
  align-items: center;
  background: url(../assets/login_bg.jpg) no-repeat;
  background-size: 100% 100%;
  background-size: cover;
}

.user-layout-login {
  label {
    font-size: 14px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
