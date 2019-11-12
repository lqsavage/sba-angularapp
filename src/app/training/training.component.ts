import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TrainingService } from '../services/training.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Pagination } from '../models/pagination';
import { AuthToken } from '../models/authToken';
import { WindowRef } from '../utils/WindowRef';
import { RAZORPAY_KEY, RAZORPAY_SECRET } from '../models/constants';
import { TranslateService } from '@ngx-translate/core';

declare var $: any;


@Component({
  selector: "app-training",
  templateUrl: "training.component.html"
})
export class TrainingComponent implements OnInit {
  logedUser: AuthToken = JSON.parse(localStorage.getItem("logedUser"));
  translate: TranslateService;
  index: number = 0;
  trainingStatus: string;
  routePath: string;
  training: any = {};
  selectElementText: string = "";
  trainingStatusList: any[] = [
    { caption: "", value: "Select" },
    { caption: "TRAINING-STARTED", value: "TRAINING-STARTED" },
    { caption: "COMPLETED", value: "COMPLETED" },
    { caption: "DISABLED", value: "DISABLED" }
  ];
  pagination: Pagination;
  selectedPage: number = 0;
  pageTitle: string;
  enableDate: string = '';

  ngAfterViewChecked(): void {
    $(function() {
      $.datepicker.setDefaults({
        dateFormat: "yy-mm-dd"
      });
      $("#enableDate").datepicker({
        minDate: 0,
        onSelect: function(selectedDate) {
          var date = $(this).datepicker("getDate");
        }
      });
    });
  }

  razorPayOpen(amount, name) {
    let options: any = {
      key: RAZORPAY_KEY,
      amount: amount,
      name: "SBA - IIHT & IBM",
      description: "Training Fees",
      modal: {
        ondismiss: function() {}
      },
      prefill: {
        name: name,
        email: "iiht@gmail.com",
        contact: "9434580584"
      },
      notes: {
        address: ""
      },
      theme: {
        color: "#F37254"
      }
    };
    options.handler = response => {
      var razorpayPaymentId = response.razorpay_payment_id;
      alert(
        "Successfully completed payment with Razorpay Payment Id " +
          razorpayPaymentId
      );
      this.updatePaymentInformation(razorpayPaymentId);
    };
    let rzp1 = new this.winRef.nativeWindow.Razorpay(options);
    rzp1.open();
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private trainingService: TrainingService,
    private winRef: WindowRef
  ) {}

  ngOnInit() {
    //this.translate.setDefaultLang('en');
    //this.translate.use('en');
    this.routePath = this.router.url;
    this.trainingStatus = this.route.data["_value"]["trainingStatus"];
    if (this.routePath == "/allTrainings") {
      this.pageTitle = "All Registered Training(s)";
      this.findAllTrainings(0);
    } else if (this.routePath == "/receivedProposl") {
      this.pageTitle = "All Proposed Training(s)";
      this.findProposedTrainings(0);
    } else {
      if (this.routePath == "/finalizeProposal")
        this.pageTitle = "All Proposed Training(s)";
      else if (this.routePath == "/rateMentor") this.pageTitle = "Rate Mentor";
      else if (this.routePath == "/updateTrainingStatus")
        this.pageTitle = "Update Training Status";
      else if (this.routePath == "/inprogressTraining")
        this.pageTitle = "All In-Progress Training(s)";
      else if (this.routePath == "/completedTraining")
        this.pageTitle = "All Completed Training(s)";
      if (this.logedUser.role.includes("ROLE_MENTOR"))
        this.findByMentorIdAndStatus(0);
      else if (this.logedUser.role.includes("ROLE_USER"))
        this.findByUserIdAndStatus(0);
    }

    $(function() {
      $.descByFieldName = function(name) {
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

  private valueToPercentage(value: number): number {
    let percentage = 0;
    if (value == 1) percentage = 25;
    if (value == 2) percentage = 50;
    if (value == 3) percentage = 75;
    if (value == 4) percentage = 100;
    return percentage;
  }
  private percentageToValue(percentage: number): number {
    let value = 0;
    if (percentage == 25) value = 1;
    if (percentage == 50) value = 2;
    if (percentage == 75) value = 3;
    if (percentage == 100) value = 4;
    return value;
  }
  pageChanged(page: number): void {
    this.selectedPage = page;
    if (this.routePath == "/allTrainingRecord") this.findAllTrainings(page);
    else if (this.routePath == "/receivedProposl")
      this.findProposedTrainings(page);
    else {
      if (this.logedUser.role.includes("ROLE_MENTOR"))
        this.findByMentorIdAndStatus(page);
      else if (this.logedUser.role.includes("ROLE_USER"))
        this.findByUserIdAndStatus(page);
    }
  }

  findAllTrainings(pageNumber: number) {
    $("#wait").show();
    this.trainingService.findAllTrainings(pageNumber).subscribe(
      page => {
        $("#wait").hide();
        this.pagination = page;
        for (var i = 0; i < this.pagination.content.length; i++)
          this.pagination.content[i].progress = this.percentageToValue(
            this.pagination.content[i].progress
          );
      },
      error => {
        $("#wait").hide();
        this.pagination = new Pagination();
        this.pagination.content = [];
      }
    );
  }

  private findProposedTrainings(page: number) {
    $("#wait").show();
    this.trainingService
      .findProposedTrainings(this.logedUser.id, page)
      .subscribe(
        page => {
          $("#wait").hide();
          this.pagination = page;
          for (var i = 0; i < this.pagination.content.length; i++)
            this.pagination.content[i].progress = this.percentageToValue(
              this.pagination.content[i].progress
            );
        },
        error => {
          $("#wait").hide();
          this.pagination = new Pagination();
          this.pagination.content = [];
        }
      );
  }

  private findByMentorIdAndStatus(page: number) {
    $("#wait").show();
    this.trainingService
      .findByMentorIdAndStatus(this.logedUser.id, this.trainingStatus, page)
      .subscribe(
        page => {
          $("#wait").hide();
          this.pagination = page;
          for (var i = 0; i < this.pagination.content.length; i++)
            this.pagination.content[i].progress = this.percentageToValue(
              this.pagination.content[i].progress
            );
        },
        error => {
          $("#wait").hide();
          this.pagination = new Pagination();
          this.pagination.content = [];
        }
      );
  }

  private findByUserIdAndStatus(page: number) {
    $("#wait").show();
    this.trainingService
      .findByUserIdAndStatus(this.logedUser.id, this.trainingStatus, page)
      .subscribe(
        page => {
          $("#wait").hide();
          this.pagination = page;
          for (var i = 0; i < this.pagination.content.length; i++)
            this.pagination.content[i].progress = this.percentageToValue(
              this.pagination.content[i].progress
            );
        },
        error => {
          $("#wait").hide();
          this.pagination = new Pagination();
          this.pagination.content = [];
        }
      );
  }

  private approveTraining(index: number, status: string) {
    $("#wait").show();
    this.trainingService
      .approveTraining(this.pagination.content[index].id, status)
      .subscribe(
        apiResponse => {
          $("#wait").hide();
          alert(apiResponse.message);
          if (apiResponse.status == 200)
            this.findProposedTrainings(this.selectedPage);
        },
        error => {
          $("#wait").hide();
        }
      );
  }

  payFees(index: number): void {
    this.index = index;
    let amount = this.pagination.content[index].fees * 100 + "";
    this.razorPayOpen(amount, this.logedUser.userName);
  }
  updatePaymentInformation(razorpayPaymentId: string): void {
    this.training = {
      id: this.pagination.content[this.index].id,
      amountReceived: this.pagination.content[this.index].fees,
      razorpayPaymentId: razorpayPaymentId
    };
    $("#wait").show();
    this.trainingService.updateTraining(this.training).subscribe(
      apiResponse => {
        $("#wait").hide();
        alert(apiResponse.message);
        //if (apiResponse.status == 200)
        this.findByUserIdAndStatus(this.selectedPage);
      },
      error => {
        $("#wait").hide();
        this.findByUserIdAndStatus(this.selectedPage);
        //refund amount for exception
        /*let amount = (this.pagination.content[this.index].fees * 100) + "";update
                this.trainingService.capturePayment("pay_C5ds9PgrhQadE7", amount).subscribe(
                    response => {
                        alert(JSON.stringify(response));    
                        console.log('Status:', response.statusCode);
                        console.log('Headers:', JSON.stringify(response.headers));
                        console.log('Response:', response.body);
                    }, error => {
                    }  
                );
                this.trainingService.refundMoney("pay_C5ds9PgrhQadE7").subscribe(
                    response => {
                        alert(JSON.stringify(response));    
                        console.log('Status:', response.statusCode);
                        console.log('Headers:', JSON.stringify(response.headers));
                        console.log('Response:', response.body);
                    }, error => {
                    }
                );*/
      }
    );
  }

  private updateRating(index: number) {
    this.training = {
      id: this.pagination.content[index].id,
      rating: this.pagination.content[index].rating
    };
    $("#wait").show();
    this.trainingService.updateTraining(this.training).subscribe(
      apiResponse => {
        $("#wait").hide();
        if (apiResponse.status == 200) {
          alert("Rate poseted successfully");
          this.findByUserIdAndStatus(this.selectedPage);
        } else alert(apiResponse.message);
      },
      error => {
        $("#wait").hide();
      }
    );
  }

  getTrainingStatus(event: Event) {
    this.selectElementText =
      event.target["options"][event.target["options"].selectedIndex].text;
  }

  getEnableDate(event: Event) {
    this.enableDate =
      event.target[0].enableDate.text;
  }

  updateTrainingStatus(index: number) {
    alert("Enable Date is " + $("#enableDate").val());
    alert(JSON.stringify(this.pagination.content[index]));
    this.enableDate = $("#enableDate").val();
    if (this.selectElementText == "") {
      alert("Please select Training Status");
      return;
    }
    if (this.enableDate == "") {
      alert("Please select Enable Date");
      return;
    }
    this.training = {
      id: this.pagination.content[index].id,
      status: this.selectElementText,
      enableDate: this.enableDate
    };
    
    $("#wait").show();
    this.trainingService.updateTraining(this.training).subscribe(
      apiResponse => {
        $("#wait").hide();
        alert(apiResponse.message);
        if (apiResponse.status == 200)
          this.findByUserIdAndStatus(this.selectedPage);
      },
      error => {
        $("#wait").hide();
      }
    );
  }
}