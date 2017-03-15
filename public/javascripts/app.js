const React = require("react");
const Header = require("./header");
const CalendarList = require("./calendar");
const AddEvent = require("./addEvent");

class App extends React.Component {
    constructor (props){
        super(props);
        this.state = {
            calendarIndex: [],
            calendar: []
        };
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
            this.init(response);
        }, null, this);
    }

    // 각각의 일정별로 들어오는 데이터를 날짜별로 재가공 한다.
    init (response){
        const eventInit = rebuildEvents(); // 데이터를 다루는 함수는 따로 분리함. constructor.prototype으로 프로토타입에 추가시켜줬음.
        const newState = eventInit.init(response); // 재가공된 데이터를 반환한다. 여기서 데이터는 곧 state임.

        this.constructor.prototype.addTheEvent = eventInit.func.addTheEvent;
        this.constructor.prototype.deleteTheEvent = eventInit.func.deleteTheEvent;
        this.setState(newState);
    }

    addEvent (title, startDate, endDate){
        const newEvent = {
            summary: title,
            start: {
                dateTime: startDate,
                timeZone: "Asia/Seoul"
            },
            end: {
                dateTime: endDate,
                timeZone: "Asia/Seoul"
            }
        };
        const request = gapi.client.calendar.events.insert({
          'calendarId': 'primary',
          'resource': newEvent
        });

        request.execute(function(event) {
            if (event.error){
                console.log(event.error);
                return false;
            }

            const newState = this.addTheEvent(event);
            this.setState(newState);
        }.bind(this));
    }

    deleteEvent (scheduleIndex, eventIndex){
        const eventId = this.state.calendar[scheduleIndex].eventList[eventIndex].id;
        const request = gapi.client.calendar.events.delete({
            'calendarId': 'primary',
            'eventId': eventId
        });

        request.execute(function(event) {
            if (event.error){
                console.log(event.error);
                return false;
            }

            const newState = this.deleteTheEvent(scheduleIndex, eventIndex);
            this.setState(newState);
        }.bind(this));
    }

    render (){
        return (
            <div>
                <Header googleApi={this.props.googleApi} isSignIn={this.props.isSignIn} getCalendarFunc={this.getCalendarFromServer.bind(this)}/>
                <div className="mainContents">
                    <CalendarList scheduleList = {this.state.calendar} deleteEvent={this.deleteEvent.bind(this)} />
                </div>
                <AddEvent addEventFunc={this.addEvent.bind(this)} />
            </div>
        )
    }
}

module.exports = App;
