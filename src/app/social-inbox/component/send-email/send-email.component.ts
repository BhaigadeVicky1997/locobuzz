import { Component, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.scss']
})
export class SendEmailComponent implements OnInit {
  public Editor = ClassicEditor;
  CKEditorConfig = { toolbar: [ 'heading', '|', 'bold', 'italic', 'link', 'Undo', 'Redo' ] };

  editorConfig = {
                        toolbar: {
                          items: [
                            'bold',
                            'italic',
                            'underline',
                            'link',
                            'bulletedList',
                            'numberedList',
                            '|',
                            'indent',
                            'outdent',
                            '|',
                            'imageUpload',
                            'blockQuote',
                            'insertTable',
                            'undo',
                            'redo',
                          ]
                        },
                        image: {
                          toolbar: [
                            'imageStyle:full',
                            'imageStyle:side',
                            '|',
                            'imageTextAlternative'
                          ]
                        },
                        table: {
                          contentToolbar: [
                            'tableColumn',
                            'tableRow',
                            'mergeTableCells'
                          ]
                        },
                        // This value must be kept in sync with the language defined in webpack.config.js.
                        language: 'en'
                      };
  constructor() { }

  ngOnInit(): void {
  }

}
