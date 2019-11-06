import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SkillService } from '../services/skill.service';
import { Pagination } from '../models/pagination';
import { AuthToken } from '../models/authToken';

declare var $: any;

@Component({
    selector: 'app-technology',
    templateUrl: 'technology.component.html'
})

export class TechnologyComponent implements OnInit {

    logedUser: AuthToken = JSON.parse(localStorage.getItem('logedUser'));
    skill: any = {};
    pagination: Pagination;
    selectedPage: number = 0;

    constructor(
        private skillService: SkillService,
        private cdr: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.findAllSkills(0);

        $(function () {
            $.descByFieldName = function (name) {
                var text;
                switch (name) {
                    case "name":
                        text = "Technology Name";
                        break;
                    case "toc":
                        text = "Table of Content";
                        break;
                    case "prerequisites":
                        text = "Prerequisites";
                        break;
                    default:
                        text = "";
                }
                return text;
            };
        });
    }

    pageChanged(page: number): void {
        this.selectedPage = page;
        this.findAllSkills(page);
    }

    findAllSkills(page: number) {
        $('#wait').show();
        this.skillService.findAllSkills(page).subscribe(
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

    addSkill() {
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
            $('#wait').show();
            this.skillService.addSkill(this.skill).subscribe(
                apiResponse => {
                    $('#wait').hide();
                    alert(apiResponse.message);
                    if (apiResponse.status == 200) {
                        this.clearFields();
                        this.findAllSkills(this.selectedPage);
                    }
                }, error => {
                    $('#wait').hide();
                }
            );
        }
        return false;

    }

    setValueForUpdate(index: number) {
        //this.skill = this.pagination.content[index];
        $("#form1 #name").attr('readonly', 'readonly');
        this.skill = {
            "id": this.pagination.content[index].id,
            "name": this.pagination.content[index].name,
            "toc": this.pagination.content[index].toc,
            "prerequisites": this.pagination.content[index].prerequisites
        };
        $("#cancelEditButton").show();
        $('#addButton').hide();
        $('#saveButton').show();
        this.cdr.detectChanges();
    }

    clearFields() {
        $("#form1 #name").removeAttr('readonly');
        this.skill = {
            "id": "",
            "name": "",
            "toc": "",
            "prerequisites": ""
        };
        $("#cancelEditButton").hide();
        $('#addButton').show();
        $('#saveButton').hide();
        this.cdr.detectChanges();
    }

    updateSkill() {
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
            $('#wait').show();
            this.skillService.updateSkill(this.skill).subscribe(
                apiResponse => {
                    $('#wait').hide();
                    alert(apiResponse.message);
                    if (apiResponse.status == 200) {
                        this.clearFields();
                        this.findAllSkills(this.selectedPage);
                    } 
                }, error => {
                    $('#wait').hide();
                }
            );
        }
    }

    deleteSkill(id: number) {
        if (confirm("Do you want to delete record ?")) {
            $('#wait').show();
            this.skillService.deleteSkill(id).subscribe(
                apiResponse => {
                    $('#wait').hide();
                    alert(apiResponse.message);
                    if (apiResponse.status == 200) {
                        this.findAllSkills(this.selectedPage);
                    } 
                }, error => {
                    $('#wait').hide();
                }
            );
        }
    }
}