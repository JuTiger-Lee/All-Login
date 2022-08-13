import signUp from "@/controllers/apiDocs/user/signUp";
import signIn from "@/controllers/apiDocs/user/signIn";
import authTest from "@/controllers/apiDocs/user/authTest";
import kakao from "@/controllers/apiDocs/user/kakao";
import facebook from "@/controllers/apiDocs/user/facebook";
import google from "@/controllers/apiDocs/user/google";
import naver from "@/controllers/apiDocs/user/naver";

export default {
  ...signUp,
  ...signIn,
  ...authTest,
  ...kakao,
  ...facebook,
  ...google,
  ...naver,
};
