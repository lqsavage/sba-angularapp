import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PaymentService } from '../services/payment.service';
import { AuthToken } from '../models/authToken';

declare var $: any;

@Component({
    selector: 'app-payment-commission',
    templateUrl: 'payment_commission.component.html'
})

export class PaymentCommissionComponent implements OnInit {

    logedUser: AuthToken = JSON.parse(localStorage.getItem('logedUser'));
    commissionPercent: number;

    constructor(
        private paymentService: PaymentService) {
    }

    ngOnInit() {

        $(function () {
            $("#newCommissionPercent").keypress(function (event) {
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
        });

        this.findPaymentCommission();
    }

    findPaymentCommission() {
        $('#wait').show();
        this.paymentService.findPaymentCommission(1).subscribe(
            apiResponse => {
                $('#wait').hide();
                this.commissionPercent = apiResponse.commissionPercent;
            }, error => {
                $('#wait').hide();
            }
        );
    }

    updateCommission() {

        var status = true;
        $("#form1 .requiredfield").css("border", "1px solid #cacaca");
        var newCommissionPercent = $("#form1 #newCommissionPercent").val();
        if (newCommissionPercent == "") {
            $("#form1 #newCommissionPercent").css("border", "solid 1px #f00");
            $("#form1 #newCommissionPercent").parent().children(".blankfield").html("Percentage required");
            $("#form1 #newCommissionPercent").parent().children(".blankfield").addClass("errorMessage");
            status = false;
        }

        if (status) {
            $('#wait').show();
            this.paymentService.updatePaymentCommission(1, newCommissionPercent).subscribe(
                apiResponse => {
                    $('#wait').hide();
                    alert(apiResponse.message);
                    if (apiResponse.status == 200)
                        this.findPaymentCommission();
                }, error => {
                    $('#wait').hide();
                }
            );
        }
    }

}