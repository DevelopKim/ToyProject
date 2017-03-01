// 토큰 값 가져오기
// authObj.currentUser.get().getAuthResponse().access_token

var CLIENT_ID = '703268525-pifhit4jthctje2sokdpqe9cg55mavas.apps.googleusercontent.com';
var API_KEY = 'AIzaSyAiGCbpePHFkTEcWQMn9CJw4_UvCVSEbwQ';
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
var SCOPES = "https://www.googleapis.com/auth/calendar";

var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: DISCOVERY_DOCS,
        clientId: CLIENT_ID,
        scope: SCOPES
    }).then(function () {
        var authObj = gapi.auth2.getAuthInstance();

        authObj.isSignedIn.listen(updateSigninStatus);
        updateSigninStatus(authObj.isSignedIn.get());

        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    });
}

// 로그인 정보가 바뀌면 ui 바꿔준다. (로그인하거나 로그아웃 할때 실행)
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.classList.remove("active");
        signoutButton.classList.add("active");
        listUpcomingEvents();
    } else {
        authorizeButton.classList.add("active");
        signoutButton.classList.remove("active");
    }
}

// 로그인 실행
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

// 로그아웃 실행
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}


// 초기화 실행
handleClientLoad();
