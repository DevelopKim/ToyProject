const React = require("react");
const Header = require("./header");
const CalendarList = require("./calendar");

/*
스캐줄 오브젝트
{
    orgDate: dateObj.orgDate,
    day: dateObj.day,
    trimmedDate: dateObj.trimmedDate,
    koreanDate: dateObj.koreanDate,
    eventList: [],
    eventLength: 0
};
*/

class App extends React.Component {
    constructor (props){
        super(props);
        this.state = {
            calendarIndex: [],
            calendar: []
        }
        this.calendarSetting = {
            'calendarId': 'primary',
            'timeMin': (new Date()).toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'orderBy': 'startTime'
        };
    }

    componentDidMount (){
        if (this.props.isSignIn){
            this.getCalendarFromServer();
        }
    }

    getCalendarFromServer (){
        gapi.client.calendar.events.list(
            this.calendarSetting
        ).then(function (response){
            this.makeScheduleObj(response);
        }, null, this);
    }

    // 각각의 일정별로 들어오는 데이터를 날짜별로 재가공 한다.
    makeScheduleObj (response){
        let events = response.result.items;
        let calendarIndex = this.state.calendarIndex;

        events.forEach(function (ele, index, arr){
            let orgDate = ele.start.dateTime ? ele.start.dateTime : ele.start.date;
            let dateObj = helper.makeDateObj(orgDate);

            // 해당 날짜의 오브젝트 없으면 오브젝트 만든다.
            if (index === 0 || calendarIndex[calendarIndex.length - 1] !== dateObj.trimmedDate){
                rebuildEvents.appendSchedulObj(ele, dateObj, this.state);
            } else {
                rebuildEvents.appendEventToSchedule(ele, this.state.calendar[calendarIndex.length - 1]);
            }
        }.bind(this));

        this.setState({
            calendarIndex: calendarIndex,
            calendar: this.state.calendar
        });
    }

    deleteEvent (scheduleIndex, eventIndex, eventComponent){
        // google api call
        var request = gapi.client.calendar.events.delete({
            'calendarId': 'primary',
            'eventId': this.state.calendar[scheduleIndex].eventList[eventIndex].id
        });
        request.execute(function(event) {
            if (this.state.calendar[scheduleIndex].eventList.length === 1){
                this.state.calendarIndex.splice(scheduleIndex, 1);
                this.state.calendar.splice(scheduleIndex, 1);
            } else {
                this.state.calendar[scheduleIndex].eventList.splice(eventIndex, 1);
            }

            this.setState({
                calendarIndex: this.state.calendarIndex,
                calendar: this.state.calendar
            });
        }.bind(this));
    }

    render (){
        return (
            <div>
                <Header googleApi={this.props.googleApi} isSignIn={this.props.isSignIn} getCalendarFunc={this.getCalendarFromServer.bind(this)}/>
                <div className="mainContents">
                    <CalendarList scheduleList = {this.state.calendar} deleteEvent={this.deleteEvent.bind(this)} />
                </div>
            </div>
        )
    }
}

module.exports = App;
