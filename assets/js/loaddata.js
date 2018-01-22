$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "testdata.csv",
        dataType: "text",
        success: function(data) {
            var allData = data.split(/\r?\n|\r/);
            for (var i = 0, l = allData.length; i < l; i++) {
                currentData = allData[i].split(",");
                popupID = currentData[0] + "-popup";
                popupTitle = currentData[1];
                popupTime = currentData[2];
                popupRoom = currentData[3];

                popupTimeArr = popupTime.split("-");
                weekdaysArr = ["Monday","Tuesday","Wednesday","Thursday","Friday"];
                timesArr = ["8:30", "1:15", "After School"]
                day = (weekdaysArr[popupTimeArr[0]-1]);
                eventTime = (timesArr[popupTimeArr[1]-1]);


                container = document.createElement("div");
                $(container).attr("id", popupID);
                $(container).addClass("popup ui-draggable ui-draggable-handle");
                $(container).attr("data-title",popupTitle);

                content = document.createElement("div");
                $(content).addClass("content");

                title = document.createElement("H1");
                titleText = document.createTextNode(popupTitle);
                title.appendChild(titleText);
                content.append(title);

                time = document.createElement("p");
                $(time).attr("data-time",popupTime)
                timeText = document.createTextNode(day + " " + eventTime);
                time.appendChild(timeText);
                content.append(time);

                room = document.createElement("p");
                roomText = document.createTextNode(popupRoom);
                room.appendChild(roomText);
                content.append(room);

                arrowdown = document.createElement("div");
                $(arrowdown).addClass("arrow-down");

                $(container).append(content);
                container.append(arrowdown);
                $('.popup-container').append(container)
            }
        }
    });
});
