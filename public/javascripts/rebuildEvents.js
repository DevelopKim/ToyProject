
const calendarIndex = [];
const calendar = [];
// 일정이 있는 날짜별 오브젝트 생성한다.
const ScheduleObj = function (dateObj){
    this.orgDate = dateObj.orgDate;
    this.day = dateObj.day;
    this.trimmedDate = dateObj.trimmedDate;
    this.koreanDate = dateObj.koreanDate;
    this.eventList = [];
    this.eventLength = 0;
};

function init (data){
    const events = data.result.items;

    events.forEach(function (ele, index, arr){
        const orgDate = ele.start.dateTime ? ele.start.dateTime : ele.start.date;
        const dateObj = helper.makeDateObj(orgDate);

        // 해당 날짜의 오브젝트 없으면 오브젝트 만든다.
        if (index === 0 || calendarIndex[calendarIndex.length - 1] !== dateObj.trimmedDate){
            appendSchedulObj(ele, dateObj, calendarIndex, calendar);
        } else {
            appendEventToSchedule(ele, calendarIndex.length - 1);
        }
    });

    return {
        calendarIndex: calendarIndex,
        calendar: calendar
    };
}

function appendSchedulObj (theEvent, dateObj){
    const newCalendar = new ScheduleObj(dateObj);

    calendar.push(newCalendar);
    calendarIndex.push(dateObj.trimmedDate);

    // 리스트 마지막에 추가한다.
    appendEventToSchedule(theEvent, calendarIndex.length - 1);
}

function appendEventToSchedule (theEvent, index){
    calendar[index].eventList.push(theEvent);
}

function addTheEvent (event){
    const orgDate = event.start.dateTime ? event.start.dateTime : event.start.date;
    const dateObj = helper.makeDateObj(orgDate);
    const index = calendarIndex.indexOf(dateObj.trimmedDate);

    if (index < 0){
        newState = appendSchedulObj(event, dateObj);
    } else {
        newState = appendEventToSchedule(event, index);
    }

    return {
        calendarIndex: calendarIndex,
        calendar: calendar
    };
}

function deleteTheEvent (scheduleIndex, eventIndex){
    if (calendar[scheduleIndex].eventList.length === 1){
        calendarIndex.splice(scheduleIndex, 1);
        calendar.splice(scheduleIndex, 1);
    } else {
        calendar[scheduleIndex].eventList.splice(eventIndex, 1);
    }

    return {
        calendarIndex: calendarIndex,
        calendar: calendar
    }
}

module.exports = {
    init: init,
    func: {
        addTheEvent: addTheEvent,
        deleteTheEvent: deleteTheEvent
    }
}
