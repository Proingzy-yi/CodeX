/*
 *检查权限
 * @param loginUser 当前登录用户
 * @param needAccess 需要有的权限
 * @return boolean 有无权限
 */
import ACCESS_ENUM from "@/access/accessEnum";

const checkAccess = (loginUser: any, needAccess = ACCESS_ENUM.NOT_lOGIN) => {
  //检查当前用户具有的权限(如果没有loginUSER，默认未登录)
  const loginUserAccess = loginUser?.userRole ?? ACCESS_ENUM.NOT_lOGIN;
  if (needAccess === ACCESS_ENUM.NOT_lOGIN) {
    return true;
  }
  //如果需要用户登录才能访问
  if (needAccess === ACCESS_ENUM.USER) {
    //如果用户未登录那么表示无权限
    if (loginUserAccess === ACCESS_ENUM.NOT_lOGIN) {
      return false;
    }
  }
  //如果需要管理员权限
  if (needAccess === ACCESS_ENUM.ADMIN) {
    //如果不为管理员那么表示无权限
    if (loginUserAccess !== ACCESS_ENUM.ADMIN) {
      return false;
    }
  }
  return true;
};

export default checkAccess;
