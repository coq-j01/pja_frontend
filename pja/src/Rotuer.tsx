import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/common/PrivateRoute";
import MainPage from "./pages/mainpage/MainPage";
import LoginPage from "./pages/loginpage/LoginPage";
import OAuth2Success from "./pages/loginpage/success/OAuth2SuccessPage";
import FindIdPage from "./pages/loginpage/findid/FindIdPage";
import FindPwPage from "./pages/loginpage/findpw/FindPwPage";
import SignupPage from "./pages/signuppage/SignupPage";
import EmailVerificationPage from "./pages/signuppage/emailverificationpage/EmailVerificationPage";
import AddWSPage from "./pages/workspacepage/addworkspacepage/AddWSPage";
import MainWSPage from "./pages/workspacepage/mainworkspacepage/MainWSPage";
import AccountSettingPage from "./pages/accountsettingpage/AccountSettingPage";
import WorkspaceSettingPage from "./pages/workspacesettingpage/WorkspaceSettingPage";
import ActionPostPage from "./pages/workspacepage/developmentpage/postpage/ActionPostPage";
import RootRedirect from "./components/common/RootRedirect";

const Router = () => {
  return (
    <Routes>
      {/* 기본 경로에서 토큰이 있으면 메인, 없으면 로그인으로 리다이렉트 */}
      <Route path="/" element={<RootRedirect />} />

      {/* 공개 라우트 */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/oauth2/success" element={<OAuth2Success />} />
      {/* 이메일 인증 페이지 */}
      <Route path="/email-verification" element={<EmailVerificationPage />} />
      <Route path="/find-id" element={<FindIdPage />} />
      <Route path="/find-pw" element={<FindPwPage />} />
      {/* 인증 필요 라우트 */}
      <Route
        path="/main"
        element={
          <PrivateRoute>
            <MainPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/addws"
        element={
          <PrivateRoute>
            <AddWSPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/ws/:wsid/step/:stepId"
        element={
          <PrivateRoute>
            <MainWSPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/ws/:wsid/post/action/:acId"
        element={
          <PrivateRoute>
            <ActionPostPage />
          </PrivateRoute>
        }
      />
      {/*계정설정 페이지*/}
      <Route
        path="/account-settings"
        element={
          <PrivateRoute>
            <AccountSettingPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/workspace-setting"
        element={
          <PrivateRoute>
            <WorkspaceSettingPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default Router;
