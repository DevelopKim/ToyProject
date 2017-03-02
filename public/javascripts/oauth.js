// 토큰 값 가져오기
// authObj.currentUser.get().getAuthResponse().access_token

const React = require("react");
const ReactDom = require("react-dom");
const LoginBtn = require("./loginBtn.js");


// google api 설정하고 로그인 한다. calendar api를 불러오기 위한 시작점.
const oauth = (function() {

    let status = {
        isSignIn: false
    }

    // google api console에서 발급받은 key.
    const clientKey = {
        CLIENT_ID: '703268525-pifhit4jthctje2sokdpqe9cg55mavas.apps.googleusercontent.com',
        API_KEY: 'AIzaSyAiGCbpePHFkTEcWQMn9CJw4_UvCVSEbwQ',
        DISCOVERY_DOCS: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
        SCOPES: "https://www.googleapis.com/auth/calendar"
    }

    // google api 로드한다.
    gapi.load('client:auth2', oauthInit);

    // 사용할 어플리케이션 세팅 설정한다.
    function oauthInit (){
        gapi.client.init({
            apiKey: clientKey.API_KEY,
            discoveryDocs: clientKey.DISCOVERY_DOCS,
            clientId: clientKey.CLIENT_ID,
            scope: clientKey.SCOPES
        }).then(login); // then(opt_onFulfilled, opt_onRejected, opt_context)
    }

    // 로그인 하고 인증(oauth) 한다.
    function login (){
        const authorizeButton = document.getElementById('authorize-button');
        const signoutButton = document.getElementById('signout-button');
        const authObj = gapi.auth2.getAuthInstance();

        authObj.isSignedIn.listen(updateSigninStatus);
        updateSigninStatus(authObj.isSignedIn.get());

        // authorizeButton.onclick = handleAuthClick;
        // signoutButton.onclick = handleSignoutClick;

        // 로그인 정보가 바뀌면 ui 바꿔준다. (로그인하거나 로그아웃 할때 실행)
        function updateSigninStatus(isSignedIn) {
            if (isSignedIn) {
                // authorizeButton.classList.remove("active");
                // signoutButton.classList.add("active");
                // listUpcomingEvents();
                // console.log(gapi.client.calendar);

                // 반환해줄 오브젝트 수정해준다.
                status.isSignIn = true;
            } else {
                // authorizeButton.classList.add("active");
                // signoutButton.classList.remove("active");
            }

            // console.log(authObj)



            // 로그인 버튼 컴포넌트
            // ReactDom.render(<LoginBtn googleApi = {authObj} isSignIn = {isSignedIn.toString()} />, document.querySelector(".header-right"));

        }

        // 로그인 실행
        function handleAuthClick(event) {
            authObj.signIn();
        }

        // 로그아웃 실행
        function handleSignoutClick(event) {
            authObj.signOut();
        }

    }

    // 로그인 관련된 status 반환해준다.
    return status;

})();
