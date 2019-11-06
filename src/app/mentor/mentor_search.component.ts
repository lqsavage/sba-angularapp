import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { User } from '../models/user';
import { Pagination } from '../models/pagination';
import { UserService } from '../services/user.service';
import { MentorSkillService } from '../services/mentor_skill.service';
import { TrainingService } from '../services/training.service';
import { API_URL } from '../models/constants';
import { AuthToken } from '../models/authToken';

declare var $: any;

@Component({
    selector: 'app-mentor-search',
    templateUrl: 'mentor_search.component.html'
})

export class MentorSearchComponent implements OnInit {

    logedUser: AuthToken;
    searchModel: any = {};
    searchClicked = false;
    mentor: User;
    mentorId: number;
    training: any = {};
    pagination: Pagination;
    paginationTraining: Pagination;
    selectedPage: number = 0;
    selectedPageTraining: number = 0;

    constructor(
        private userService: UserService,
        private mentorSkillService: MentorSkillService,
        private trainingService: TrainingService,
        private cdr: ChangeDetectorRef) {
    }

    ngAfterViewChecked(): void {

        $(function () {
            $.datepicker.setDefaults({
                dateFormat: 'yy-mm-dd',
            });
            $('#startDate').datepicker({
                minDate: 0,
                onSelect: function (selectedDate) {
                    var date = $(this).datepicker('getDate');
                    date.setDate(date.getDate() + 1);
                    $('#endDate').datepicker('option', 'minDate', date);
                }
            });
            $('#endDate').datepicker({
                onSelect: function (selectedDate) {
                    var date = $(this).datepicker('getDate');
                    date.setDate(date.getDate() - 1);
                    $('#startDate').datepicker('option', 'maxDate', date);
                }
            });
            function removeAllOptions(selectbox) {
                var i;
                for (i = selectbox.options.length - 1; i > 0; i--) {
                    selectbox.remove(i);
                }
            }

            //populate start time
            for (var i = 9; i <= 22; i++) {
                var val = (i < 10) ? "0" + i + ":00 AM" : (i >= 12) ? (i - 12) < 10 ? "0" + (i - 12) + ":00 PM" : (i - 12) + ":00 PM" : i + ":00 AM";
                var opt = new Option(val, (i < 10) ? "0" + i + ":00" : i + ":00");
                opt.title = val;
                $("#form1 #startTime").append(opt);
            }
            //populate end time
            $("#startTime").on('change', function () {
                var list = document.getElementById("endTime");
                removeAllOptions(list);
                var hour = parseInt(this.value.split(":")[0]);
                for (var i = hour + 1; i <= 22; i++) {
                    var val = (i < 10) ? "0" + i + ":00 AM" : (i >= 12) ? (i - 12) < 10 ? "0" + (i - 12) + ":00 PM" : (i - 12) + ":00 PM" : i + ":00 AM";
                    var opt = new Option(val, (i < 10) ? "0" + i + ":00" : i + ":00");
                    opt.title = val;
                    $("#form1 #endTime").append(opt);
                }
            });
            $("#endTime").on('change', function () {
            });

            $.descByFieldName = function (name) {
                var text;
                switch (name) {
                    case "skillName":
                        text = "Skill Name";
                        break;
                    case "startDate":
                        text = "Start Date";
                        break;
                    case "endDate":
                        text = "End Date";
                        break;
                    case "startTime":
                        text = "Start Time";
                        break;
                    case "endTime":
                        text = "End Time";
                        break;
                    default:
                        text = "";
                }
                return text;
            };

        });

    }

    ngOnInit() {
        $(document).ready(function () {

            $("#skillName").autocomplete({
                source: function (request, response) {
                    //this.cdr.detectChanges();
                    if (request.term.length < 3)
                        return;
                    $.ajax({
                        url: `${API_URL}/skills/findByLikeName/${request.term}`,
                        type: "GET",
                        dataType: "json",
                        beforeSend: function () { $('#wait').show(); },
                        complete: function () { $('#wait').hide(); },
                        cache: false,
                        success: function (data) {
                            $("#skillName").removeAttr("disabled");
                            response($.map(data, function (item) {
                                return {
                                    label: item.name,
                                    value: item.id,
                                }
                            }));
                        },
                        error: function (xhr, errorType, exception) {
                            try {
                                var err = JSON.parse(xhr.responseText);
                                alert(err.message);
                            } catch (e) {
                                alert(xhr.responseText);
                            }
                        }
                    });
                },
                focus: function (event, ui) {
                    $(".ui-autocomplete > li").attr("title", ui.item.label);
                    $(this).attr("title", ui.item.label);
                },
                select: function (event, ui) {
                    event.preventDefault();
                    $("#skillId").val(ui.item.value);
                    $("#skillName").val(ui.item.label);
                },
                minLength: 1
            });


        });

        this.logedUser = JSON.parse(localStorage.getItem('logedUser'));
        if (this.logedUser != null && localStorage.getItem('trainingObject') != null) {
            if (this.logedUser.role.includes('ROLE_ADMIN') || this.logedUser.role.includes('ROLE_MENTOR')) {
                alert("User having USER role can only send training proposal");
                this.searchClicked = false;
                return;
            }
            this.training = JSON.parse(localStorage.getItem('trainingObject'));
            $("#form1 #skillId").val(this.training.skillId);
            $("#form1 #skillName").val(this.training.skillName);
            $("#form1 #startDate").val(this.training.startDate);
            $("#form1 #startTime").val(this.training.startTime);
            $("#form1 #endDate").val(this.training.endDate);
            var hour = parseInt(this.training.startTime.split(":")[0]);
            for (var i = hour + 1; i <= 22; i++) {
                var val = (i < 10) ? "0" + i + ":00 AM" : (i >= 12) ? (i - 12) < 10 ? "0" + (i - 12) + ":00 PM" : (i - 12) + ":00 PM" : i + ":00 AM";
                var opt = new Option(val, (i < 10) ? "0" + i + ":00" : i + ":00");
                opt.title = val;
                $("#form1 #endTime").append(opt);
            }
            $("#form1 #endTime").val(this.training.endTime);
            this.pagination = JSON.parse(localStorage.getItem('mentorSearchList'));
            this.selectedPage = parseInt(localStorage.getItem('mentorSearchPageNo'));
            this.searchClicked = true;
            this.proposeTraining(this.training.mentorId, this.training.skillId, this.training.fees)
        } else {
            this.training = {
                "mentorId": "",
                "skillId": "",
                "skillName": "",
                "startDate": "",
                "startTime": "",
                "endDate": "",
                "endTime": ""
            };
        }

    }

    pageChanged(page: number): void {
        this.selectedPage = page;
        this.findMentorByTechnology(page);
    }

    findMentorByTechnology(page: number) {
        if (localStorage.getItem('trainingObject') != null) {
            localStorage.removeItem('trainingObject')
            localStorage.removeItem('mentorSearchList')
            localStorage.removeItem('mentorSearchPageNo')
        }
        var status = true;
        $("#form1 .requiredfield").css("border", "1px solid #cacaca");
        $("#form1 .requiredfield").each(function () {
            var v = $(this).val();
            if (v == '') {
                $(this).css("border", "solid 1px #f00");
                $(this).parent().children(".blankfield").html($.descByFieldName(this.name) + " required");
                $(this).parent().children(".blankfield").addClass("errorMessage");
                status = false;
            } else {
                $(this).parent().children(".blankfield").html("");
            }
        });

        if (status) {
            this.searchClicked = true;
            this.searchModel = {
                "skillId": $("#form1 #skillId").val(),
                "skillName": $("#form1 #skillName").val(),
                "startDate": $("#form1 #startDate").val(),
                "startTime": $("#form1 #startTime").val(),
                "endDate": $("#form1 #endDate").val(),
                "endTime": $("#form1 #endTime").val()
            };
            $('#wait').show();
            this.mentorSkillService.findBySkillIdDateRange(
                this.searchModel.skillId,
                this.searchModel.startDate, this.searchModel.endDate,
                this.searchModel.startTime, this.searchModel.endTime,
                page).subscribe(
                    page => {
                        $('#wait').hide();
                        this.pagination = page;
                    },
                    error => {
                        $('#wait').hide();
                        this.pagination = new Pagination();
                        this.pagination.content = [];
                    }
                );
        }
    }

    viewProfile(mentorId: number) {
        $('#wait').show();
        this.userService.findById(mentorId).subscribe(
            apiResponse => {
                $('#wait').hide();
                this.mentor = apiResponse;
                $("#ViewProfileDiv").modal("toggle");
            }, error => {
                $('#wait').hide();
            }
        );
    }

    viewTrainingHistory(mentorId: number) {
        $("#TrainingHistoryDiv").modal("toggle");
        this.mentorId = mentorId;
        this.mentorTrainingHistory(mentorId, 0);
    }

    mentorTrainingHistory(mentorId: number, page: number) {
        let skillId = $("#form1 #skillId").val();
        $('#wait').show();
        this.trainingService.findByMentorIdSkillId(mentorId, skillId, page).subscribe(
            page => {
                $('#wait').hide();
                this.paginationTraining = page;
            },
            error => {
                $('#wait').hide();
                this.paginationTraining = new Pagination();
                this.paginationTraining.content = [];
            }
        );
    }

    pageChangedTraining(page: number): void {
        this.selectedPageTraining = page;
        this.mentorTrainingHistory(this.mentorId, page);
    }

    proposeTraining(mentorId, skillId, fees) {
        if ($("#form1 #startTime").val() == '') {
            alert("Enter Start Time");
            $("#form1 #startTime").focus();
            return;
        } else if ($("#form1 #endTime").val() == '') {
            alert("Enter End Time");
            $("#form1 #endTime").focus();
            return;
        }
        if (this.logedUser == null) { //if user search training without login
            alert("Please login to send training proposal");
            var skillName = $("#form1 #skillName").val();
            this.training = {
                "mentorId": mentorId,
                "skillId": skillId,
                "skillName": skillName,
                "startDate": $("#form1 #startDate").val(),
                "startTime": $("#form1 #startTime").val(),
                "endDate": $("#form1 #endDate").val(),
                "endTime": $("#form1 #endTime").val(),
                "fees": fees
            };
            localStorage.setItem('trainingObject', JSON.stringify(this.training));
            localStorage.setItem('mentorSearchList', JSON.stringify(this.pagination));
            localStorage.setItem('mentorSearchPageNo', JSON.stringify(this.selectedPage));
        } else {
            var userId = this.logedUser.id;
            this.training = JSON.parse(localStorage.getItem('trainingObject'));  //if user search training before login
            if (this.training != null) {
                this.training.userId = userId;
            } else {  //if user search training after login
                var skillName = $("#form1 #skillName").val();
                this.training = {
                    "userId": userId,
                    "mentorId": mentorId,
                    "skillId": skillId,
                    "skillName": skillName,
                    "startDate": $("#form1 #startDate").val(),
                    "startTime": $("#form1 #startTime").val(),
                    "endDate": $("#form1 #endDate").val(),
                    "endTime": $("#form1 #endTime").val(),
                    "fees": fees
                };
            }
            $('#wait').show();
            this.trainingService.proposeTraining(this.training).subscribe(
                apiResponse => {
                    $('#wait').hide();
                    if (apiResponse.status == 200) {
                        alert(apiResponse.message);
                    } else
                        alert(apiResponse.message);
                }, error => {
                    $('#wait').hide();
                }
            );
            localStorage.removeItem('trainingObject');
            localStorage.removeItem('mentorSearchList')
            localStorage.removeItem('mentorSearchPageNo')
        }
    }

}