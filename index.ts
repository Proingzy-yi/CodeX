import router from "@/router";
import store from "@/store";
import ACCESS_ENUM from "@/access/accessEnum";
import checkAccess from "@/access/checkAccess";

router.beforeEach(async (to, from, next) => {
  console.log("登陆用户信息", store.state.user.loginUser);

  let loginuser = store.state.user.loginUser;
  //如果之前未登录则直接登录
  if (!loginuser || !loginuser.userRole) {
    await store.dispatch("user/getLoginUser");
    loginuser = store.state.user.loginUser;
  }
  const needAccess = (to.meta?.access as string) ?? ACCESS_ENUM.NOT_lOGIN;
  //要跳转的页面需要登录
  if (needAccess !== ACCESS_ENUM.NOT_lOGIN) {
    if (
      !loginuser ||
      !loginuser.userRole ||
      loginuser.userRole == ACCESS_ENUM.NOT_lOGIN
    ) {
      next("/user/login?redirect=" + to.fullPath);
      return;
    }
    if (!checkAccess(loginuser, needAccess)) {
      next("/noAuth");
      return;
    }
  }
  next();
  console.log(to);
});
