const helper = {
    // 20170210 형태로 바꿔준다.
    resetDateFormat: function (date){
        let trimmedDate = date.match(/(\d{4})\-(\d{2})\-(\d{2})/);
        let result = trimmedDate[0].replace(/\-/g, "");
        return result;
    },

    // 2017. 01. 01 형태로 바꿔준다.
    getKoreanDate: function (date){
        let result = new Intl.DateTimeFormat('ko-KR').format(date);
        return result;
    },

    // schedule에 필요한 필요한 날짜 오브젝트
    makeDateObj: function (orgDate){
        const dayList = ["월", "화", "수", "목", "금", "토", "일"];
        let dateObj = new Date(orgDate);
        let day = dateObj.getDay();

        let date = {
            orgDate: orgDate,
            day: dayList[day - 1],
            trimmedDate: this.resetDateFormat(orgDate),
            koreanDate: this.getKoreanDate(new Date(orgDate))
        }
        return date;
    }
}
