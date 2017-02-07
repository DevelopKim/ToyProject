
// 어플리케이션에서 개인의 데이터를 읽거나 쓰기 위해서는
// googl api를 실행할 때 google auth sever에 authorization 정보를 줘야 한다. (api key 만으로는 안됨)
// google api console에서 OAuth 2.0 client ID를 발급받아서 어플리케이션을 init 할 때, 넘겨줘야 한다.
// 이때, OAuth 2.0 protocol를 사용하는데 과정은 다음과 같다.
// 1. make access-token request (browser redirect to Google방법으로 요청한다.)
// 2. user consent (사용자가 로그인 후, 권한 승인하는 단계)
// 3. 사용자가 승인하면 Google Authorization Server에서 access-token을 발급한다.
// 4. google api에 access-tokend을 넘겨준다. (http authorization header에 담아서)
// 5. access-tokend은 일정시간이 지나면 만료된다. 만료되면 새로운 access-tokend을 받으면 된다. (refresh token)

// google api가 한두개가 아니니.... google api client libraries 하나로 구성해 놓았다.





// 초기화 실행
handleClientLoad();

    // google api console에서 확인할 수 있다.
      var CLIENT_ID = '703268525-pifhit4jthctje2sokdpqe9cg55mavas.apps.googleusercontent.com';
      var API_KEY = 'AIzaSyAiGCbpePHFkTEcWQMn9CJw4_UvCVSEbwQ';

      // Array of API discovery doc URLs for APIs used by the quickstart
      var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

      // scope 정보.
      // calendar.readonly 이면 읽기만 가능하고, calendar이면 읽기/쓰기 둘 다 가능하다.
      // 하나의 clientId로 여러개의 어플케이션에 쓸 수 있기 때문에 scope으로 현재 어플리케이션에서 사용할 api를 지정해준다.
      // included, separated by spaces.
      var SCOPES = "https://www.googleapis.com/auth/calendar";

      var authorizeButton = document.getElementById('authorize-button');
      var signoutButton = document.getElementById('signout-button');




      // client 라이브러리를 불러온다.
      // :auth2 는 옵션인데, client와 auth2 두개의 라이브러리를 불러오게 한다.
      // :auth2가 없으면 gapi.client.init에서 auth2를 불러온다. -> handleClientLoad에서 불러주는게 http 요청 하나를 줄일 수 있다.
      function handleClientLoad() {
        gapi.load('client:auth2', initClient);
      }

      /**
       *  Initializes the API client library and sets up sign-in state
       *  listeners.
       */
      function initClient() {
        gapi.client.init({ // client api 초기화
            apiKey: API_KEY,
          discoveryDocs: DISCOVERY_DOCS,
          clientId: CLIENT_ID,
          scope: SCOPES
        }).then(function () {
          // Listen for sign-in state changes.
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

          // Handle the initial sign-in state.
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
          authorizeButton.onclick = handleAuthClick;
          signoutButton.onclick = handleSignoutClick;
        });
      }

      /**
       *  Called when the signed in status changes, to update the UI
       *  appropriately. After a sign-in, the API is called.
       */
      function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
          authorizeButton.style.display = 'none';
          signoutButton.style.display = 'block';
          listUpcomingEvents();
        } else {
          authorizeButton.style.display = 'block';
          signoutButton.style.display = 'none';
        }
      }

      /**
       *  Sign in the user upon button click.
       */
      function handleAuthClick(event) {
        gapi.auth2.getAuthInstance().signIn();
      }

      /**
       *  Sign out the user upon button click.
       */
      function handleSignoutClick(event) {
        gapi.auth2.getAuthInstance().signOut();
      }

      /**
       * Append a pre element to the body containing the given message
       * as its text node. Used to display the results of the API call.
       *
       * @param {string} message Text to be placed in pre element.
       */
      function appendPre(message) {
        var pre = document.getElementById('content');
        var textContent = document.createTextNode(message + '\n');
        pre.appendChild(textContent);
      }

      /**
       * Print the summary and start datetime/date of the next ten events in
       * the authorized user's calendar. If no events are found an
       * appropriate message is printed.
       */
      function listUpcomingEvents() {
        gapi.client.calendar.events.list({
          'calendarId': 'primary',
          'timeMin': (new Date()).toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 10,
          'orderBy': 'startTime'
        }).then(function(response) {
          var events = response.result.items;
          appendPre('Upcoming events:');

          if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
              var event = events[i];
              var when = event.start.dateTime;
              if (!when) {
                when = event.start.date;
              }
              appendPre(event.summary + ' (' + when + ')');
            }
          } else {
            appendPre('No upcoming events found.');
          }
        });
      }
