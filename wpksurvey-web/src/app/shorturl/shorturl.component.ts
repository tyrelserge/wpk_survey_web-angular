import { Component, OnInit } from '@angular/core';
import {PublishService} from "../services/publish.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-shorturl',
  templateUrl: './shorturl.component.html',
  styleUrls: ['./shorturl.component.css']
})
export class ShorturlComponent implements OnInit {

  constructor(private publishService: PublishService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {

    let publishedCode = this.route.snapshot.params['publishCode'];

    if (publishedCode) {
      this.publishService.getClientsShortUrl(publishedCode, (shortUrl) => {
        let url: string | undefined = shortUrl?.fullUrl;
        if (url) {
          this.router.navigate([url]);
        } else {
          this.router.navigate(['/page/not-found'])
        }
      });
    }


  }

}
