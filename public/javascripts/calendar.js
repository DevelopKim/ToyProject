
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

      // api 초기화하고 sign-in state를 설정한다.
      // 초기화(initialization)란? data object 또는 variable에 최초의 값(initial value)을 할당하는 것이다.
      // oop에서는 constructor코드에 들어가는 경우가 많음.
      // api key 세팅, discovery doc 로딩, auth, initializing auth가 끝난 후 goog.Thenable 오브젝트를 반환한다.
      function initClient() {
        gapi.client.init({
            apiKey: API_KEY,
          discoveryDocs: DISCOVERY_DOCS,
          clientId: CLIENT_ID,
          scope: SCOPES
      }).then(function () {
          var authObj = gapi.auth2.getAuthInstance();

          // 로그인 정보가 바뀌면 callback 함수 실행.
          authObj.isSignedIn.listen(updateSigninStatus);

          // 로그인 되있는지 체크
          updateSigninStatus(authObj.isSignedIn.get());

          // 로그인, 로그아웃 버튼에 이벤트 등록한다.
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

      // dom에 이벤트 리스트 추가한다.
      //@param {string} message Text to be placed in pre element.
      function appendLi(message, date) {
        var ul = document.querySelector(".contents");
        var div = document.createElement("div");
        div.innerHTML = message + "<span class='listUnit-date'>" + date + "</span>";
        ul.appendChild(div);
      }


       // 유저는 하나의 primary calendar를 가지고 있으며, 하나 이상의 다른 캘린더를 가질 수 있다.
       // 유저(organizer)는 이벤트를 생성하고 다른 유저(attendee)를 초대할 수 있다.
       // 여러 사람들과 공유되는 이벤트일 경우, 이벤트 입장에서는 공유되는 캘린더(이벤트가 등록된 캘린더)가 organizer이며, 캘린더를 공유하는 유저가 attendees가 된다.

       // event: 캘린더에 등록된 이벤트 (시작일, 종료일, 제목 등을 갖는다.)
       //   event는 single(한번에 끝남. occurrence), recurring(반복되는 일정. containing multiple occurrences) 두가지가 있다.
       //   특정 시간(timed)에 발생할 수도 있고 하루 종일(all-day) 발생할 수도 있다.
       //   하나의 organizer(캘린더)를 가지고, 여러 attendees(초대된 유저의 primary calendar)를 가진다.
       // calendar: 이벤트의 모음이다. 각각의 캘린더는 metadata를 가지고 있다. Calendars collection는 존재하는 모든 캘린더를 담고 있다.
       //   기본으록 생성되는 캘린더를 Primary calendar라고 한다 (캘린더의 id는 보통 유저의 이메일 주소이다).
       // calendar list: 캘린더 ui 상의 모든 캘린더 리스트. 캘린더 하나의 메타데이터는 CalendarListEntry에 있다. ("kind": "calendar#calendarListEntry")
       // setting: Calendar UI의 세팅
       // ACL: 다른 사용자가 어떤 허용범위에서 캘런더에 접근할 수 있는지 정해놓은 룰. An access control rule.
       // color: Calendar UI에서 정해놓은 색.(이벤트 색과 캘린더 색 두가지가 있다.)
       // free/busy: 스케쥴된 이벤트가 있는 캘린더는 busy, 없는 캘린더는 free

       // Reminders와 Notifications을 제공한다.
       // remnder: 이벤트 시작 일정 시간 전에 알려준다.
       // notification: 이벤트가 수정될 때 알려준다.

      function listUpcomingEvents() {
        gapi.client.calendar.events.list({ // 캘린더에 등록되있는 이벤트 리스트 오브젝트를 반환한다.
          'calendarId': 'primary',
          'timeMin': (new Date()).toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'orderBy': 'startTime'
      }).then(function(response) {
          var events = response.result.items;



        //   console.log("date: " + test.getDate());
        //   console.log("day: " + test.getDay());
        //   console.log("year: " + test.getFullYear());
        //   console.log("month: " + test.getMonth());

          if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
              var event = events[i];
              var when = event.start.dateTime;
              if (!when) {
                when = event.start.date;
              }
              appendLi(event.summary, when);
            }
          } else {
            appendLi("등록된 이벤트가 없습니다.");
          }
      });
    }




    // 날짜별로 오브젝트 만든다.
    // function EventCategory (){
    //     this.date = "";
    //     this.eventLength = 0;
    //
    //     this.ul = null;
    //     this.container = null;
    //     this.eventId = [];
    // }
    //
    // obj1 = new EventCategory();


    class EventCategory {
        constructor (){
            this.date = 0;
            this.ul = null;
            this.eventLength = 0;
            this.container = null;
        }

        createContainer (date){
            let node = createElement("listUnit")
        }

    }







    // 캘린더에 이벤트 추가한다.//////////////////////////////////////////////////////////////////////////////////
    document.getElementById("addEvent").addEventListener("click", function(e){
        e.preventDefault();

        let event = makeEventMetadata();

        var request = gapi.client.calendar.events.insert({
            'calendarId': 'primary',
            'resource': event
        });

        request.execute(function(event, test) {
          appendLi('Event created: ' + event.htmlLink);
        });
    });

    function makeEventMetadata (){
        let eventTitleDom = document.querySelector(".addEventPopup-title");
        let eventDateDom = document.querySelector(".addEventPopup-date");
        let eventDateEndDom = document.querySelector(".addEventPopup-date2");

        let eventTitle = eventTitleDom.value;
        let eventStartDate = new Date(eventDateDom.value);
        let eventEndDate = new Date(eventDateEndDom.value);

        let calenarEvent = {
            summary: eventTitle,
            start: {
                dateTime: eventStartDate.toISOString()
            },
            end: {
                dateTime: eventEndDate.toISOString()
            }
        };

        return JSON.stringify(calenarEvent);
    }
