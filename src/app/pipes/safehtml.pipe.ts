import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safehtml',
  standalone: true,
})
export class SafehtmlPipe implements PipeTransform {
  constructor(private domSanitizer: DomSanitizer) {}
  transform(html: string): unknown {
    return this.domSanitizer.bypassSecurityTrustHtml(html);
  }
}
