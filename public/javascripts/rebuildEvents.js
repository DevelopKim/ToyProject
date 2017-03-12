const rebuildEvents = {
    // schedule 오브젝트 생성
    makeNewScheduleObj: function (dateObj){
        const newCalendar = {
            orgDate: dateObj.orgDate,
            day: dateObj.day,
            trimmedDate: dateObj.trimmedDate,
            koreanDate: dateObj.koreanDate,
            eventList: [],
            eventLength: 0
        };

        return newCalendar;
    },

    appendSchedulObj: function (theEvent, dateObj, state){
        let newCalendar = this.makeNewScheduleObj(dateObj);
        this.appendEventToSchedule(theEvent, newCalendar);
        state.calendar.push(newCalendar);
        state.calendarIndex.push(dateObj.trimmedDate);
    },

    appendEventToSchedule: function (theEvent, targetSchedule){
        targetSchedule.eventList.push(theEvent);
    }
}
