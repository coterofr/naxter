import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import Swiper from 'swiper';
import { Post } from '../../model/post';

@Component({
  selector: 'app-post-slider',
  templateUrl: './post-slider.component.html',
  styleUrls: ['./post-slider.component.scss']
})
export class PostSliderComponent implements OnInit, AfterViewInit {

  @Input() posts: Post[];
  
  swiper!: Swiper;

  constructor() {
    this.posts = [];
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.swiper = new Swiper('.swiper-container', { 
      loop: true
    });

    setTimeout(() => this.swiper.update(), 3500);
  }

  prev(): void {
    this.swiper.slidePrev();
  }

  next(): void {
    this.swiper.slideNext();
  }
}
