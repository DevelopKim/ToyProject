let helper = {
    createNode: function (tag, className){
        var newNode = document.createElement(tag);
        if (className){
            newNode.classList.add(className);
        }
        return newNode;
    },

    // 20170210 형태로 바꿔준다.
    resetDateFormat: function (date){
        let trimmedDate = date.match(/(\d{4})\-(\d{2})\-(\d{2})/);
        let result = trimmedDate[0].replace(/\-/g, "");
        return result;
    }
}
