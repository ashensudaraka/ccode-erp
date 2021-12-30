import { Component, OnInit } from '@angular/core';
import { } from 'jquery';
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.clickedNavColor();
    this.navBarSubMenu();
  }

  //Changing navbar position color
  clickedNavColor() {
    $('.nav-link').click(function () {
      $('.nav-link').css("color", "");
      $('.nav-link').css("background-color", "");
      $(this).css("color", "black");
      $(this).css("background-color", "#D3E5F3");
    });

  }

  //NavBar dropdown sub-menu
  navBarSubMenu() {
    $('.dropdown-menu a.dropdown-toggle').on('click', function (e) {
      if (!$(this).next().hasClass('show')) {
        $(this).parents('.dropdown-menu').first().find('.show').removeClass('show');
      }
      var $subMenu = $(this).next('.dropdown-menu');
      $subMenu.toggleClass('show');

      $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function (e) {
        $('.dropdown-submenu .show').removeClass('show');
      });

      return false;
    })
  }

}
