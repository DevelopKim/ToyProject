// 토큰 값 가져오기
// authObj.currentUser.get().getAuthResponse().access_token

const React = require("react");
const ReactDom = require("react-dom");
const App = require("./app")


// google api 설정하고 로그인 한다. calendar api를 불러오기 위한 시작점.
const oauth = (function() {

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
        const authObj = gapi.auth2.getAuthInstance();
        let isSignedIn = authObj.isSignedIn.get();

        // 로그인 버튼 컴포넌트
        ReactDom.render(<App googleApi = {authObj} isSignIn = {isSignedIn} />, document.querySelector(".contents"));
        todoMenu();
    }

})();
