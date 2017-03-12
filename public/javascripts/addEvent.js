const React = require("react");

class AddEvent extends React.Component {
    constructor (props){
        super(props);
        this.titleEle = null;
        this.dateEle = null;
        this.formEle = null;
        this.nowDate = new Date().toISOString().split("T")[0];

        this.state = {
            dateVal: this.nowDate
        }
    }

    componentDidMount (){
         this.formEle.addEventListener("submit", this.addEvent.bind(this));
    }


    addEvent (event){
        event.preventDefault();

        const title = this.titleEle.value;
        const date = this.state.dateVal;
        const dateTime = new Date(this.dateEle.value);

        this.props.addEventFunc(title, dateTime, dateTime);
    }

    changeVal (event){
        this.setState({
            dateVal: this.dateEle.value
        });

    }

    render (){
        return (
            <form className="modal addEventPopup" ref={(ele) => {this.formEle = ele}} >
                <h2 className="addEventPopup-label">제목</h2>
                <input type="text" className="addEventPopup-title inpuText block" ref={(ele) => {this.titleEle = ele}} />

                <h2 className="addEventPopup-label">시작일</h2>
                <input type="date" className="addEventPopup-date inpuText block" ref={(ele) => {this.dateEle = ele}} onChange={this.changeVal.bind(this)} value={this.state.dateVal} />

                <div className="buttonWrapper">
                    <input type="submit" className="button" id="addEvent" value="추가" />
                    <span href="#" className="button white">취소</span>
                </div>
            </form>
        )
    }

}

module.exports = AddEvent;
