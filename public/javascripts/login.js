
const login = (function (){

    const authorizeButton = document.getElementById('authorize-button');
    const signoutButton = document.getElementById('signout-button');

    function login (){
        const authObj = gapi.auth2.getAuthInstance();
        let isSigned = authObj.isSignedIn.get();

        authObj.isSignedIn.listen(updateSigninStatus);
        updateSigninStatus(isSigned);

        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
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

    return login;
})()
