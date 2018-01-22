//Dynamically Create popups (Currently not used - trying to add dynamically added stations)

$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "data/main.csv",
        dataType: "text",
        success: function(data) {
            var allData = data.split(/\r?\n|\r/);
            for (var i = 0, l = allData.length; i < l; i++) {
                currentData = allData[i].split(",");
                popupID = currentData[0] + "-popup";
                popupTitle = currentData[1];
                popupTime = currentData[2];
                popupRoom = currentData[3];
                var j = 4;
                var popupYears = []
                while (j < currentData.length) {
                    currentYear = currentData[j].replace(/\"/g, "")
                    popupYears.push(currentYear);
                    j++
                }

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
                $(time).addClass("time");
                timeText = document.createTextNode("Time: " + day + " " + eventTime);
                time.appendChild(timeText);
                content.append(time);

                room = document.createElement("p");
                $(room).attr("data-room",popupRoom);
                $(room).addClass("room");
                roomText = document.createTextNode("Room: "+popupRoom);
                room.appendChild(roomText);
                content.append(room);

                year = document.createElement("p");
                $(year).addClass("years");
                $(year).attr("data-years","{"+popupYears+"}")
                yearText = document.createTextNode("Years: "+popupYears);
                year.appendChild(yearText);
                content.append(year);

                arrowdown = document.createElement("div");
                $(arrowdown).addClass("arrow-down");

                $(container).append(content);
                container.append(arrowdown);
                $('.popup-container').append(container)
            }
        }
    });
});
