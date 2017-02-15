
// 초기화 실행
handleClientLoad();


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

      // dom에 이벤트 리스트 추가한다.
      //@param {string} message Text to be placed in pre element.
      function appendLi(message, date) {
        var ul = document.querySelector(".contents");
        var div = document.createElement("div");
        div.innerHTML = message + "<span class='listUnit-date'>" + date + "</span>";
        ul.appendChild(div);
      }


      // 모든 일정 화면에 뿌려준다.
      function listUpcomingEvents() {
            gapi.client.calendar.events.list({
              'calendarId': 'primary',
              'timeMin': (new Date()).toISOString(),
              'showDeleted': false,
              'singleEvents': true,
              'orderBy': 'startTime'
          }).then(function(response) {
            let events = response.result.items;

            if (events.length <= 0){
                let content = document.querySelector(".contents");
                content.innerHTML = "등록된 일정이 없습니다."
                return false;
            }

            let newEventObjs = {}; // 일정을 날짜별로 묶어서 만들 오브젝트

            for (let i = 0; i < events.length; i++) { // 날짜별로 오브젝트 만든다.
                let orgDate = events[i].start.dateTime ? events[i].start.dateTime : events[i].start.date;
                let trimedDate = orgDate.replace(/(\d{4})\-(\d{2})\-(\d{2})?.+/, '$1$2$3');

                if (newEventObjs.hasOwnProperty(trimedDate)){
                    newEventObjs[trimedDate].appendLi(events[i].summary);
                } else {
                    let dateObj = new Date(orgDate);
                    newEventObjs[trimedDate] = new newEvent();
                    newEventObjs[trimedDate].drawDom(dateObj);
                    newEventObjs[trimedDate].appendLi(events[i].summary);
                }
            }
        });
      }





    // 날짜별로 오브젝트 만든다.
    class newEvent {
        constructor (){
            this.date = 0;
            this.eventLength = 0;
            this.node = null;
        }

        // 이벤트가 등록된 날짜를 돔에 추가한다.
        drawDom (date){
            let days = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
            let koreanDate = this.getKoreanDate(date);
            let day = date.getDay();
            let wrapperNode = document.querySelector(".contents");

            let domClass = {
                node: "listUnit",
                Item: "listUnit-date",
                day: "day",
                date: "date",
                ul: "listUnit-item"
            };
            let domStr = "<div class='" + domClass.Item + "'>" +
                                "<span class='" + domClass.day + "'>" + days[day] +"</span>" +
                                "<span class='" + domClass.date + "'>" + koreanDate + "</span>" +
                                "<ul class='" + domClass.ul + "'></ul>" +
                            "</div>";

            let node = this.createNode("div", domClass.node);
            node.innerHTML = domStr;
            wrapperNode.appendChild(node);
            this.node = node;
            this.date = koreanDate;
        }

        getKoreanDate (date){
            let result = new Intl.DateTimeFormat('ko-KR').format(date);
            return result;
        }

        createNode (tag, className){
            var newNode = document.createElement(tag);
            if (className){
                newNode.classList.add(className);
            }
            return newNode;
        }

        appendLi (data){
            var li = this.createNode("li");
            li.innerHTML = "<span>" + data + "</span>";
            this.node.appendChild(li);
            this.eventLength += 1;
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
