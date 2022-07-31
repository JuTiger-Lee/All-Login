import signUp from "@/controllers/apiDocs/user/signUp";
import signIn from "@/controllers/apiDocs/user/signIn";
import authTest from "@/controllers/apiDocs/user/authTest";
import kakao from "@/controllers/apiDocs/user/kakao";

export default {
  ...signUp,
  ...signIn,
  ...authTest,
  ...kakao,
};
