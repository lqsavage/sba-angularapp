import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  private links = new Array<{ text: string, path: string, sublinks: any[] }>();
  private isLoggedIn = new Subject<boolean>();

  constructor() {
    this.isLoggedIn.next(false);
  }

  getLinks() {
    return this.links;
  }

  getLoginStatus() {
    return this.isLoggedIn;
  }

  updateLoginStatus(status: boolean) {
    this.isLoggedIn.next(status);
    if (!status) {
      this.clearAllItems();
    }
  }

  updateNavAfterAuth(role: string): void {
    if (role === 'ADMIN') {
      this.addItem({ text: 'Technology Management', path: 'technology', subLinks: [] });
      var subLinks1 = new Array<{ text: string, path: string }>();
      this.addChildItem(subLinks1, { text: 'Block/Unblock User', path: 'users' });
      this.addItem({ text: 'User Management', path: 'users', subLinks: subLinks1 });
      var subLinks2 = new Array<{ text: string, path: string }>();
      this.addChildItem(subLinks2, { text: 'All Registered Training(s)', path: 'allTrainings' });
      this.addItem({ text: 'Training Management', path: '', subLinks: subLinks2 });
      var subLinks3 = new Array<{ text: string, path: string }>();
      this.addChildItem(subLinks3, { text: 'Payment Report', path: 'payments' });
      this.addChildItem(subLinks3, { text: 'Payment Commission', path: 'paymentCommission' });
      this.addItem({ text: 'Payment Management', path: 'payments', subLinks: subLinks3 });
    } else if (role === 'USER') {
      var subLinks1 = new Array<{ text: string, path: string }>();
      this.addChildItem(subLinks1, { text: 'Rate Mentor', path: 'rateMentor' });
      this.addChildItem(subLinks1, { text: 'Update Training Status', path: 'updateTrainingStatus' });
      this.addChildItem(subLinks1, { text: 'All Proposed Training(s)', path: 'finalizeProposal' });      
      this.addChildItem(subLinks1, { text: 'All In-Progress Training(s)', path: 'inprogressTraining' });
      this.addChildItem(subLinks1, { text: 'All Completed Training(s)', path: 'completedTraining' });
      this.addItem({ text: 'Training Management', path: '', subLinks: subLinks1 });
    } else if (role === 'MENTOR') {
      this.addItem({ text: 'Skill Management', path: 'mentorSkill', subLinks: [] });
      var subLinks1 = new Array<{ text: string, path: string }>();
      this.addChildItem(subLinks1, { text: 'All Proposed Training(s)', path: 'receivedProposl' });
      this.addChildItem(subLinks1, { text: 'All In-Progress Training(s)', path: 'inprogressTraining' });
      this.addChildItem(subLinks1, { text: 'All Completed Training(s)', path: 'completedTraining' });
      this.addItem({ text: 'Training Management', path: '', subLinks: subLinks1 });
      this.addItem({ text: 'Calendar Management', path: 'mentorCalendar', subLinks: [] });
      this.addItem({ text: 'Payment Management', path: 'payments', subLinks: [] });
    }
  }

  addChildItem(subLinks, { text, path }) {
    subLinks.push({ text: text, path: path });
  }
  addItem({ text, path, subLinks }) {
    this.links.push({ text: text, path: path, sublinks: subLinks });
  }

  removeItem({ text }) {
    this.links.forEach((link, index) => {
      if (link.text === text) {
        this.links.splice(index, 1);
      }
    });
  }

  clearAllItems() {
    this.links.length = 0;
  }
}
