import { Component, OnInit } from '@angular/core';
import { Pagination } from '../models/pagination';
import { MentorSkillService } from '../services/mentor_skill.service';
import { API_URL } from '../models/constants';
import { AuthToken } from '../models/authToken';

declare var $: any;

@Component({
    selector: 'app-mentor-skill',
    templateUrl: 'mentor_skill.component.html'
})

export class MentorSkillComponent implements OnInit {

    logedUser: AuthToken = JSON.parse(localStorage.getItem('logedUser'));
    mentorSkill: any = {};
    skills: any[];
    pagination: Pagination;
    selectedPage: number = 0;

    constructor(
        private mentorSkillService: MentorSkillService) {
    }

    ngAfterViewInit() {

        $(function () {
            $.descByFieldName = function (name) {
                var text;
                switch (name) {
                    case "skillName":
                        text = "Skill Name"
                        break;
                    case "yearsOfExperience":
                        text = "Years of Experience";
                        break;
                    case "tariningsDelivered":
                        text = "Total Tarinings Delivered";
                        break;
                    case "facilitiesOffered":
                        text = "Facilities Offered";
                        break;
                    case "fees":
                        text = "Fees";
                        break;
                    default:
                        text = "";
                }
                return text;
            };
        });
    }

    ngOnInit() {
        this.clearFields();
        this.findAllMentorSkills(0);

        $(document).ready(function () {

            $("#form1 #yearsOfExperience").keypress(function (event) {
                if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
                    if ((event.which != 46 || $(this).val().indexOf('.') != -1)) {
                        event.preventDefault();
                    }
                    event.preventDefault();
                }
                if (this.value.indexOf(".") > -1 && (this.value.split('.')[1].length > 1)) {
                    event.preventDefault();
                }
            });

            $("#skillName").autocomplete({
                source: function (request, response) {
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
    }

    pageChanged(page: number): void {
        this.selectedPage = page;
        this.findAllMentorSkills(page);
    }

    findAllMentorSkills(page: number) {
        $('#wait').show();
        this.mentorSkillService.findMentorSkillsByMentorId(this.logedUser.id, page).subscribe(
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

    addMentorSkill() {
        var status = true;
        $("#form1 .requiredfield").css("border", "1px solid #cacaca");
        $("#form1 .requiredfield").each(function () {
            var v = $(this).val();
            if (v == '' && !(typeof this.name === "undefined")) {
                $(this).css("border", "solid 1px #f00");
                $(this).parent().children(".blankfield").html($.descByFieldName(this.name) + " required");
                $(this).parent().children(".blankfield").addClass("errorMessage");
                status = false;
            } else {
                $(this).parent().children(".blankfield").html("");
            }
        });
        if (this.mentorSkill.selfRating == 0) {
            $("#selfRatingr").css("border", "solid 1px #f00");
            $("#selfRating").parent().children(".blankfield").html("Self Rating required");
            $("#selfRating").parent().children(".blankfield").addClass("errorMessage");
            status = false;
        }
        if (status) {
            $('#wait').show();
            this.mentorSkill.skillId = $("#form1 #skillId").val();
            this.mentorSkill.skillName = $("#form1 #skillName").val();
            this.mentorSkillService.addMentorSkill(this.mentorSkill).subscribe(
                apiResponse => {
                    $('#wait').hide();
                    alert(apiResponse.message);
                    if (apiResponse.status == 200) {
                        this.clearFields();
                        this.findAllMentorSkills(this.selectedPage);
                    } 
                }, error => {
                    $('#wait').hide();
                }
            );
        }
    }

    setValueForUpdate(index: number) {
        this.mentorSkill = {
            "id": this.pagination.content[index].id,
            "mentorId": this.logedUser.id,
            "skillId": this.pagination.content[index].skillId,
            "skillName": this.pagination.content[index].skillName,
            "selfRating": this.pagination.content[index].selfRating,
            "yearsOfExperience": this.pagination.content[index].yearsOfExperience,
            "tariningsDelivered": this.pagination.content[index].tariningsDelivered,
            "facilitiesOffered": this.pagination.content[index].facilitiesOffered,
            "fees": this.pagination.content[index].fees
        };
        $("#cancelEditButton").show();
        $('#addButton').hide();
        $('#saveButton').show();
        $("#skillName").prop('disabled', 'disabled');
        //this.cdr.detectChanges();
    }

    clearFields() {
        this.mentorSkill = {
            "id": "",
            "mentorId": this.logedUser.id,
            "skillId": "",
            "selfRating": 0,
            "yearsOfExperience": "",
            "tariningsDelivered": "",
            "facilitiesOffered": "",
            "fees": ""
        };
        $("#cancelEditButton").hide();
        $('#addButton').show();
        $('#saveButton').hide();
        $("#skillName").prop('disabled', false);
        //this.cdr.detectChanges();
    }

    updateMentorSkill() {
        var status = true;
        $("#form1 .requiredfield").css("border", "1px solid #cacaca");
        $("#form1 .requiredfield").each(function () {
            var v = $(this).val();
            if (v == '' && !(typeof this.name === "undefined")) {
                $(this).css("border", "solid 1px #f00");
                $(this).parent().children(".blankfield").html($.descByFieldName(this.name) + " required");
                $(this).parent().children(".blankfield").addClass("errorMessage");
                status = false;
            } else {
                $(this).parent().children(".blankfield").html("");
            }
        });
        if (this.mentorSkill.selfRating == 0) {
            $("#selfRatingr").css("border", "solid 1px #f00");
            $("#selfRating").parent().children(".blankfield").html("Self Rating required");
            $("#selfRating").parent().children(".blankfield").addClass("errorMessage");
            status = false;
        }
        if (status) {
            $('#wait').show();
            this.mentorSkillService.updateMentorSkill(this.mentorSkill).subscribe(
                apiResponse => {
                    $('#wait').hide();
                    alert(apiResponse.message);
                    if (apiResponse.status == 200) {
                        this.clearFields();
                        this.findAllMentorSkills(this.selectedPage);
                    } 
                }, error => {
                    $('#wait').hide();
                }
            );
        }
    }

    deleteMentorSkill(id: number) {
        if (confirm("Do you want to delete record ?")) {
            $('#wait').show();
            this.mentorSkillService.deleteMentorSkill(id).subscribe(
                apiResponse => {
                    $('#wait').hide();
                    alert(apiResponse.message);
                    if (apiResponse.status == 200)
                        this.findAllMentorSkills(this.selectedPage);
                }, error => {
                    $('#wait').hide();
                }
            );
        }
    }
}