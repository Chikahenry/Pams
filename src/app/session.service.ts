import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  // months: { monthId: string; monthName: string; }[];
  months: { monthId: string; monthName: string; } [] = [];

  constructor(private router: Router) { }

  validtoken: any;

  public checkLogin() {
    this.validtoken = localStorage.getItem('access_token');

    // tslint:disable-next-line: triple-equals
    if (this.validtoken == '' || this.validtoken === null) {
      this.router.navigate(['/signup']);
    }
  }

  public logOut() {
    localStorage.clear();
    this.router.navigate(['/login']);
    // this.router.navigate(['/signup']);
  }

  public islogin() {
    this.validtoken = localStorage.getItem('access_token');
    // alert(this.validtoken);

    if (this.validtoken != null) {
      this.router.navigate(['/dashboard']);
    }
  }


  getAllMonths() {
    this.months = [ { monthId: "01", monthName: "January" }, 
                    { monthId: "02", monthName: "February" }, 
                    { monthId: "03", monthName: "March" },
                    { monthId: "04", monthName: "April" },
                    { monthId: "05", monthName: "May" },
                    { monthId: "06", monthName: "June" },
                    { monthId: "07", monthName: "July" },
                    { monthId: "08", monthName: "August" },
                    { monthId: "09", monthName: "Septempter" },
                    { monthId: "10", monthName: "October" },
                    { monthId: "11", monthName: "November" },
                    { monthId: "12", monthName: "December" },
                  ]
  }

  getMonthName(monthId: string): string {
    var monthName = this.months.filter(m => m.monthId == monthId)[0].monthName;
    return monthName;
  }
  
}
