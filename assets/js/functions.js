//Two global variables used for the timetable
var usedTimes = [];
var currentEvents = new Array();
var a = 0;


$( document ).ready(function() {
    //Run functions when document is ready
    popupID(); //Gives each of the popups on the page a unique id
    trimSvgWhitespace(); //Remove whitespace from svg's (fixes postioning issues)
    addLabel(); //Add labels
    popupHover(); //Script to make popups appear on hover
    popupClick(); //Script to stick the popups when you click on the station
    addBtn();
    //yearSelector(); (doesnt work)

    //Ensures that dynamically created popups are draggable and that the draggable function isnt contantly run :)
    clicked = 0;
    if (clicked == 0) {
        $(document).on('click',function () {
            draggable(); //Make stuff draggable
            clicked = 1;
        });
    }

    //Cick functions to run actions
    $('.opn-timetable').on('click', function() {
        $('.timetable').fadeIn();
    });
    $('.close-timetable').on('click', function() {
        $('.timetable').fadeOut();
    });

    $('.opn-tutorial').on('click', function() {
        $('.tutorial-container').fadeIn();
    });
    $('.close-tutorial').on('click', function() {
        $('.tutorial-container').fadeOut();
    });

    $(".print").on('click', function() {
        print();
    });

    $(".tt-remove").on('click', function() {
        time = $(this).parent().attr('class').split(' ')[0];
        removeTimetableItem(time);
    });
});

Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};

$( window ).resize(function() {
    //Deletes then readds labels when resizing window (would probably be more efficient to update position)
    removeLabel();
    addLabel();
});

//Function to add labels to every station
function addLabel() {
    $(".norm").each(function(index) {
        var offset = $( this ).offset();
        var elementClass = "test";
        var text = $(this).data('name');

        var leftMod = $(this).data("leftlabel");
        var topMod = $(this).data("toplabel");

        if($(window).width() < 1880) {
            //var scaleFactor = ((1880/$(window).width())*0.4)
            var scaleFactor = 1
        } else {
            var scaleFactor = 1
        }

        $('.label-holder').append("<p class=" + index + ">"+text+" </p>");
        $('.' + index).css("position", "absolute");
        $('.' + index).addClass('label')
        //Only works for stations that are not at an angle
        $('.' + index).css('left',offset.left - ($('.' + index).width()/2) + eval(leftMod)*scaleFactor);
        $('.' + index).css('top',offset.top - 35 + eval(topMod*scaleFactor));
        $('.' + index).css('text-align',"right")
        //Set z-index to 1 so is below popup
        $('.' + index).css('z-index',1)
    });
}

//Function to remove labels (used when resizing the page)
function removeLabel() {
    $(".norm").each(function(index) {
        $('.' + index).remove();
    });
}

function popupHover() {
    //Popup Scripting - Occurs when hovering over the .station class
    $(".station").on("mouseenter", function() {
        var clickedID = $(this).attr("id");
        var popupID = clickedID + "-popup"
        if (!($('#' + popupID).hasClass('fixed'))) {
            var offset = $('#' + clickedID).offset();

            var leftMod = $(this).data("leftpopup")
            var topMod = $(this).data("toppopup")

            if ($(this).hasClass("multi-station")) {
              $('#' + popupID).css('left',offset.left + 10 - ($('#' + popupID).width()/2) + eval(leftMod));        // Use the offset of clickedID to set X and Y co-ordinates of popupID (-55 is half the width of the popup)
              $('#' + popupID).css('top',offset.top - 5 - $('#' + popupID).height() + eval(topMod));               // Use the popup height to set the offset of the vertical
            } else {
              $('#' + popupID).css('left',offset.left -10- ($('#' + popupID).width()/2) + eval(leftMod));      // Use the offset of clickedID to set X and Y co-ordinates of popupID
              $('#' + popupID).css('top',offset.top - 2 - $('#' + popupID).height() + eval(topMod));             // Use the popup height to set the offset of the vertical
            }

            $('#' + popupID).css('display','inline');
            $('#' + popupID).css("position", "absolute");  // <<< also make it absolute!
            $('#' + popupID).hide().fadeIn(400);
        }
    }).on('mouseleave', function() {
        var clickedID = $(this).attr("id");
        var popupID = clickedID + "-popup"
        if (!($('#' + popupID).hasClass('fixed'))) {
            $('#' + popupID).fadeOut(400);
        }
    });
}

//Allows the popup to stay visable when you click on the station
function popupClick() {
    $(".station").on("click", function() {
        var clickedID = $(this).attr("id");
        var popupID = clickedID + "-popup"
        if (!($('#' + popupID).hasClass('fixed'))) {
            $('#' + popupID).addClass('fixed');
        } else {
            $('#' + popupID).removeClass('fixed');
        }
    });
}

function trimSvgWhitespace() {

  // get all SVG objects in the DOM
  var svgs = document.getElementsByTagName("svg");

  // go through each one and add a viewbox that ensures all children are visible
  for (var i=0, l=svgs.length; i<l; i++) {

    var svg = svgs[i],
        box = svg.getBBox(), // <- get the visual boundary required to view all children
        viewBox = [box.x, box.y, box.width+10, box.height+10].join(" ");

    // set viewable area based on value above
    svg.setAttribute("viewBox", viewBox);
  }
}

function draggable() {
    var left = 0;
    var top = 0;
    $( ".popup" ).draggable({
        start: function(event, ui) {
            console.log("drag")
            //$(".dropArea").fadeIn();
        }, containment: $(document.body),
        scroll: false,
        revert : function() {
            //$(".dropArea").fadeOut();
            return true;
        }
    });
    $( ".dropArea" ).droppable({
        drop: function(event, ui) {
            var droppedElement = $(ui.draggable);

            droppedElement.removeClass("fixed");
            droppedElement.fadeOut(400);

            //$(".dropArea").fadeOut(); removed as no longer hidden

            var found = false;

            if (!(currentEvents.length === 0)) {
                $.each(currentEvents, function(i) {
                    $.each(currentEvents[i], function() {
                        if (currentEvents[i]["id"] == droppedElement.find(".id").data("id")) {
                            found = true;
                        }
                    });
                });
            }

            if (found != true) {
                currentEvents[a] = {};
                currentEvents[a]["id"] = droppedElement.find(".id").data("id");
                currentEvents[a]["title"] = $(ui.draggable).data("title");
                currentEvents[a]["time"] = $(ui.draggable).find(".time").data("time");
                currentEvents[a]["room"] = $(ui.draggable).find(".room").data("room")
                currentEvents[a]["years"] = $(ui.draggable).find(".years").data("years")
                a++;
                updateTimetable(currentEvents)
            } else {
                //Then the event is already in the "timetable" so no need to add it
                //Won't output anything that the user can see
                console.log("found")
            }
        }
    })
}

//Draggable doesn't work on some browsers, so added a function which allows users to click the add btn
function addBtn() {
    $('.add-btn').on('click', function() {
        popup = $(this).parent();
        currentEvents[a] = {};
        currentEvents[a]["id"] = popup.parent().find(".id").data("id");
        currentEvents[a]["title"] = popup.parent().data("title");
        currentEvents[a]["time"] = popup.find(".time").data("time");
        currentEvents[a]["room"] = popup.find(".room").data("room")
        currentEvents[a]["years"] = popup.find(".years").data("years")
        a++;
        updateTimetable(currentEvents)
    });
}

function popupID() {
    //This function give each popup a unique ID which is used to avoid duplicated in the drag and drop system!!
    var id = 0;
    $('.popup').each(function (index) {
        $(this).append("<span class='id' data-id=" + id + "></span>");
        id++;
    });
}

function yearSelector() {
    selectedYears = [7,8,9,10,11,12,13]
    $('.norm').each(function(index) {
        year = $(this).data("year")

        $.each(year, function(i) {
            if ($.inArray(year[i],selectedYears) == -1) {
                $(this).hide();
                $('.' + index).hide();
            }
        });
    });
}

function updateTimetable(events) {
    console.log(events);
    events.clean(undefined);
    console.log(events);
    var error = false;
    $.each(events, function(i) {
        try {
            time = events[i]['time']
            title = events[i]['title']
            room = events[i]['room']
            id = events[i]['id']
        } catch (err) {
            error = true;
        }
        if (error == false) {
            //If the time isn't in the array usedTimes add it to the timetable
            if ($.inArray(time,usedTimes) == -1) {
                usedTimes.push(time);
                $('.' + time).find('h1').html(title);
                $('.' + time).find('.tt-room').html("Room: " + room);
                $('.' + time).find('.tt-remove').html("Remove")
                $('.' + time).data('id', id);
            } else {
                //Output message telling user that the time slot has been filled already
                //alert("You have used that time already!!!");
            }
        }
    });
}

function removeTimetableItem(time) {
    $('.' + time).find('h1').html("");
    $('.' + time).find('.tt-room').html("");
    $('.' + time).find('.tt-remove').html("")
    usedTimes.splice($.inArray(time, usedTimes),1);
    console.log(usedTimes);
    $.each(currentEvents, function(i) {
        if (currentEvents[i]['id'] == $('.' + time).data('id')) {
            currentEvents.splice(i,1);
        }
    })
}
