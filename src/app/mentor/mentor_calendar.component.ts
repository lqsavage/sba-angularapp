import { Component, OnInit } from '@angular/core';
import { MentorCalendarService } from '../services/mentor_calendar.service';
import { DatePipe } from '@angular/common';
import { AuthToken } from '../models/authToken';

@Component({
    selector: 'app-mentor-calendar',
    templateUrl: 'mentor_calendar.component.html'
})

export class MentorCalendarComponent implements OnInit {

    logedUser: AuthToken = JSON.parse(localStorage.getItem('logedUser'));
    mentorId: number;
    displayEvent: any;
    calendarEvents: any;

    calendarOptions: any = {
        header: {
            right: 'prev,next',
        },
        dayClick: (date, jsEvent, view) => {
            console.log(date + "  " + jsEvent + "  " + view);
        },
        slotDuration: '01:00',
        color: "#456778",
        //height: 650,
        contentHeight: 'auto',
        defaultView: 'agendaWeek',
        eventRender: function (eventObj, $el) {
            $el.popover({
                title: eventObj.title,
                content: eventObj.tooltip,
                trigger: 'hover',
                placement: 'top',
                container: 'body'
            });
        },
        minTime: "09:00",
        maxTime: "23:00",
        slotLabelFormat: "hh:mm A",
        timeFormat: "hh:mm A",
        allDaySlot: false,
        fixedWeekCount: false,
        editable: false,
        eventLimit: true,
        selectable: true,
        nowIndicator: true,
        selectHelper: false,
        defaultDate: new Date(),
        firstDay: 1,
        events: []
    };

    constructor(
        private datePipe: DatePipe,
        private mentorCalendarService: MentorCalendarService) {
        //this.logedUser = JSON.parse(localStorage.getItem('logedUser'));
        this.mentorId = this.logedUser.id;
    }


    ngOnInit() {

        var start_date = this.getMonday(new Date());
        var startDate = this.datePipe.transform(start_date, "yyyy-MM-dd");
        var end_date = start_date.setDate(start_date.getDate() + 6);
        var endDate = this.datePipe.transform(end_date, "yyyy-MM-dd");
        this.setEventsInCalendar(startDate, endDate);
    }

    private getMonday(d) {
        d = new Date(d);
        var day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    }

    setEventsInCalendar(startDate: string, endDate: string) {
        $('#wait').show();
        this.mentorCalendarService.findMentorCalendarByMentorId(
            this.mentorId, startDate, endDate).subscribe(
                data => {
                    $('#wait').hide();
                    if (data.length > 0) {
                        var events = new Array<{ id: number, title: string, tooltip: string, start: string, end: string }>();
                        for (var i = 0; i < data.length; i++) {
                            events.push({
                                id: (i + 1),
                                title: data[i].skillName,
                                tooltip: data[i].skillName,
                                start: data[i].startDate + "T" + data[i].startTime,
                                end: data[i].endDate + "T" + data[i].endTime
                            });
                        }
                        this.calendarEvents = events;
                    } else
                        this.calendarEvents = [];
                }, error => {
                    $('#wait').hide();
                }
            );            
    }

    updateCalendarEvents(model: any) {
        this.displayEvent = model;
        var startDate = this.datePipe.transform(model.data, "yyyy-MM-dd");
        var calendarDate = new Date(model.data);
        calendarDate.setDate(calendarDate.getDate() + 6);
        var endDate = this.datePipe.transform(calendarDate, "yyyy-MM-dd");
        this.setEventsInCalendar(startDate, endDate);
    }

}