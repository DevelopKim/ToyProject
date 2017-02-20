
// 초기화 실행
handleClientLoad();

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



      let newEventObjs = {}; // 일정을 날짜별로 묶어서 만들 오브젝트

      // 20170210 형태로 바꿔준다.
      function resetDateFormat (date){
          let trimmedDate = date.match(/(\d{4})\-(\d{2})\-(\d{2})/);
          let result = trimmedDate[0].replace(/\-/g, "");
          return result;
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

            // 날짜별로 오브젝트 만들고 메서드 사용해서 화면에 보여준다.
            for (let i = 0; i < events.length; i++) {
                let orgDate = events[i].start.dateTime ? events[i].start.dateTime : events[i].start.date;
                let trimedDate = resetDateFormat(orgDate);

                if (newEventObjs.hasOwnProperty(trimedDate)){
                    newEventObjs[trimedDate].appendLi(events[i]);
                } else {
                    newEventObjs[trimedDate] = new newEvent(orgDate);
                    newEventObjs[trimedDate].drawDom();
                    newEventObjs[trimedDate].appendLi(events[i]);
                }
            }
        });
      }


      
      // 일정 삭제한다.
      function deleteEvent (){
          document.querySelector(".listUnit-delete").addEventListener("click", function(){
              var content = document.querySelector(".contents");
              var parent = this.parentNode;
              var id = parent.getAttribute("data-id");

              var request = gapi.client.calendar.events.delete({
                  'calendarId': 'primary',
                  'eventId': id
              });

              request.execute(function(event) {
                console.log("test")
              });

          });
      }





    // 날짜별로 오브젝트 만든다.
    class newEvent {
        constructor (date){ // 정리 안된 날짜 그대로.
            this.date = 0;
            this.orgDate = date;
            this.eventLength = 0;
            this.node = null;
            this.ul = null;
        }

        // 이벤트가 등록된 날짜를 돔에 추가한다.
        drawDom (){
            let wrapperNode = document.querySelector(".contents");

            let dateObj = new Date(this.orgDate);
            let koreanDate = this.getKoreanDate(dateObj);

            let days = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
            let day = dateObj.getDay();

            let domStr = "<div class='listUnit-date'>" +
                                "<span class='day'>" + days[day] +"</span>" +
                                "<span class='date'>" + koreanDate + "</span>" +
                            "</div>";

            let node = this.createNode("div", "listUnit");
            let ul = this.createNode("ul", "listUnit-item");

            node.innerHTML = domStr;
            node.appendChild(ul);
            wrapperNode.appendChild(node);
            this.node = node;
            this.ul = ul;
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

        appendLi (event){
            var li = this.createNode("li");
            li.setAttribute("data-id", event.id);
            li.innerHTML = "<span>" + event.summary + "</span>" + "<a href='#' class='listUnit-delete'>삭제</a>";
            this.ul.appendChild(li);

            this.eventLength += 1;
        }
    }


    // 캘린더에 이벤트 추가한다.
    document.getElementById("addEvent").addEventListener("click", function(e){
        e.preventDefault();

        let event = makeEventMetadata();

        var request = gapi.client.calendar.events.insert({
            'calendarId': 'primary',
            'resource': event
        });

        // event: 생성된 이벤트 오브젝트
        request.execute(function(event) {
          let trimedDate = resetDateFormat(event.start.dateTime);

          if (newEventObjs[trimedDate]){
              newEventObjs[trimedDate].appendLi(event);
          } else {
              newEventObjs[trimedDate] = new newEvent(event.start.dateTime);
              newEventObjs[trimedDate].drawDom();
              newEventObjs[trimedDate].appendLi(event);
          }
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
