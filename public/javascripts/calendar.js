let commonEl = {
    wrapperNode: document.querySelector(".contents"),
    // 일정을 날짜별로 묶어서 만들 오브젝트
    eventGroups: {}
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
            commonEl.wrapperNode.innerHTML = "등록된 일정이 없습니다."
            return false;
        }

        // 날짜별로 오브젝트 만들고 메서드 사용해서 화면에 보여준다.
        for (let i = 0; i < events.length; i++) {
            let orgDate = events[i].start.dateTime ? events[i].start.dateTime : events[i].start.date;
            let trimedDate = helper.resetDateFormat(orgDate);

            if (commonEl.eventGroups[trimedDate]){
                commonEl.eventGroups[trimedDate].appendLi(events[i]);
            } else {
                commonEl.eventGroups[trimedDate] = new eventGroup(orgDate);
                commonEl.eventGroups[trimedDate].drawDom();
                commonEl.eventGroups[trimedDate].appendLi(events[i]);
            }
        }
    });
}


// 날짜별로 오브젝트 만든다.
class eventGroup {
    constructor (date){ // 정리 안된 날짜 그대로.
        this.date = 0;
        this.orgDate = date;
        this.eventLength = 0;
        this.node = null; // .listUnit
        this.ul = null;
    }

    // 이벤트가 등록된 날짜를 돔에 추가한다.
    drawDom (){
        let dateObj = new Date(this.orgDate);
        let koreanDate = this.getKoreanDate(dateObj);

        let days = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
        let day = dateObj.getDay();

        let domStr = "<div class='listUnit-date'>" +
        "<span class='day'>" + days[day] +"</span>" +
        "<span class='date'>" + koreanDate + "</span>" +
        "</div>";

        let node = helper.createNode("div", "listUnit");
        let ul = helper.createNode("ul", "listUnit-item");

        node.innerHTML = domStr;
        node.appendChild(ul);
        commonEl.wrapperNode.appendChild(node);
        this.node = node;
        this.ul = ul;
        this.date = koreanDate;
    }

    getKoreanDate (date){
        let result = new Intl.DateTimeFormat('ko-KR').format(date);
        return result;
    }

    appendLi (event){
        var newSchedule = new schedule(event);
        newSchedule.eventGroup = this;

        this.ul.appendChild(newSchedule.li);
        this.eventLength += 1;
    }

    deleteLi (targetLi){
        this.ul.removeChild(targetLi);
        this.eventLength -= 1;

        // 등록된 일정이 없을때, eventGroup 오브젝트 삭제한다.
        if (this.eventLength === 0){
            commonEl.wrapperNode.removeChild(this.node);
            let trimmedDate = helper.resetDateFormat(this.orgDate);
            commonEl.eventGroups[trimmedDate] = null;
        }
    }
}



// 등록된 일정 오브젝트
class schedule {
    constructor (event){
        this.id = event.id;
        this.li = helper.createNode("li");
        this.li.innerHTML = "<span>" + event.summary + "</span>" + "<a href='#' class='listUnit-delete'>삭제</a>";
        // 일정을 생성한 부모 object
        this.eventGroup = null;
        this.deleteBtn = this.li.querySelector(".listUnit-delete");

        // 새로 생성된 dom에 이벤트 리스너 등록한다.
        this.addEvent(this.deleteBtn, "click", this.deleteSchedule);
    }

    // 새로 생성된 dom에 이벤트 리스너 등록한다.
    addEvent (targetEl, eventName, func){
        targetEl.addEventListener(eventName, function (event){
            event.preventDefault();
            func.call(this);
        }.bind(this))
    }

    // 일정 삭제한다.
    deleteSchedule (){
        var request = gapi.client.calendar.events.delete({
            'calendarId': 'primary',
            'eventId': this.id
        });
        request.execute(function(event) {
            this.eventGroup.deleteLi(this.li);
        }.bind(this));
    }
}



// 캘린더에 일정 추가한다.
document.getElementById("addEvent").addEventListener("click", function(e){
    e.preventDefault();

    let event = makeEventMetadata();

    var request = gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': event
    });

    // event: 생성된 이벤트 오브젝트
    request.execute(function(event) {
        let trimedDate = helper.resetDateFormat(event.start.dateTime);

        if (commonEl.eventGroups[trimedDate]){
            commonEl.eventGroups[trimedDate].appendLi(event);
        } else {
            commonEl.eventGroups[trimedDate] = new eventGroup(event.start.dateTime);
            commonEl.eventGroups[trimedDate].drawDom();
            commonEl.eventGroups[trimedDate].appendLi(event);
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
