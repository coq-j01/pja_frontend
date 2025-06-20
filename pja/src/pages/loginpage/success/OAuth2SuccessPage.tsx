// import { useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";

// function OAuth2Success() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     //URL 쿼리 파라미터에서 token 추출
//     const queryParams = new URLSearchParams(location.search);
//     const token = queryParams.get("token");

//     if (token) {
//       //localstorage 또는 sessionStorage에 저장(세션을 넘겨 유지됨)
//       localStorage.setItem("accessToken", token);

//       //이후 사용할 사용자 정보 요청 또는 메인 페이지 이동
//       navigate("/main");
//     } else {
//       //token이 없을 시 로그인 페이지로
//       navigate("/login");
//     }
//   }, [location, navigate]);
//   return <div>로그인 처리 중입니다...</div>;
// }
// export default OAuth2Success;
