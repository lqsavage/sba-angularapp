import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../services/payment.service';
import { Pagination } from '../models/pagination';
import { WindowRef } from '../utils/WindowRef';
import { RAZORPAY_KEY } from '../models/constants';
import { AuthToken } from '../models/authToken';

declare var $: any;

@Component({
    selector: 'app-payment',
    templateUrl: 'payment.component.html'
})

export class PaymentComponent implements OnInit {

    logedUser: AuthToken = JSON.parse(localStorage.getItem('logedUser'));
    index: number = 0;
    payment: any = {};
    searchModel: any = {};
    searchClicked = false;
    pagination: Pagination;
    selectedPage: number = 0;
    rzp1: any;
    amount: number;
    options = {
        "key": RAZORPAY_KEY,
        "amount": this.amount * 100,
        "name": "SBA - IIHT & IBM",
        "description": "Withdraw Amount",
        "image": "../../assets/images/fav.icon",
        handler: function (response) {
            var razorpayPaymentId = response.razorpay_payment_id;
            alert("Successfully completed payment with Razorpay Payment Id " + razorpayPaymentId);
            //database call to store paymentId
            this.updatePaymentInformation(razorpayPaymentId);
        },
        modal: {
            ondismiss: function () { }
        },
        prefill: {
            "name": this.logedUser.userName,
            "email": "test123@gmail.com",
            "contact": ""
        },
        notes: {
            address: "Hello World"
        },
        theme: {
            color: "#F37254"
        }
    };

    constructor(
        private paymentService: PaymentService,
        private winRef: WindowRef) {
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

            $.descByFieldName = function (name) {
                var text;
                switch (name) {
                    case "startDate":
                        text = "Start Date";
                        break;
                    case "endDate":
                        text = "End Date";
                        break;
                    default:
                        text = "";
                }
                return text;
            };

        });

    }

    ngOnInit() {
    }
    
    findPaymentDtls(page: number) {
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
            var mentorId = 0;
            if (this.logedUser.role.includes('ROLE_ADMIN'))
                mentorId = this.logedUser.id;
            this.searchModel = {
                "startDate": $("#form1 #startDate").val(),
                "endDate": $("#form1 #endDate").val()
            };
            $('#wait').show();
            this.paymentService.findPaymentDtlsByDateRange(
                mentorId,
                this.searchModel.startDate, this.searchModel.endDate, page).subscribe(
                    page => {
                        $('#wait').hide();
                        this.pagination = page;
                        this.searchClicked = true;
                    },
                    error => {
                        $('#wait').hide();
                        this.pagination = new Pagination();
                        this.pagination.content = [];
                    }
                );
        }
    }

    pageChanged(page: number): void {
        this.selectedPage = page;
        this.findPaymentDtls(page);
    }

    withdrawMoney(index: number): void {
        this.index = index;
        this.amount = this.pagination.content[index].amount;
        this.rzp1 = new this.winRef.nativeWindow.Razorpay(this.options);
        this.rzp1.open();
    }
    updatePaymentInformation(razorpayPaymentId: string): void {
        this.payment = {
            "txnType": "DR",
            "razorpayPaymentId": razorpayPaymentId,
            "amount": this.pagination.content[this.index].amount,
            "remarks": this.pagination.content[this.index].amount + " withdraw by mentor",
            "mentorId": this.pagination.content[this.index].mentorId,
            "trainingId": this.pagination.content[this.index].trainingId
        };
        $('#wait').show();
        this.paymentService.addPayment(this.payment).subscribe(
            apiResponse => {
                $('#wait').hide();
                alert(apiResponse.message);
                if (apiResponse.status == 200)
                    this.findPaymentDtls(this.selectedPage);
            }, error => {
                $('#wait').hide();
            }
        );
    }
}