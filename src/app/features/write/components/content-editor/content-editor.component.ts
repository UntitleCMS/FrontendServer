import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Delimiter from '@editorjs/delimiter';
import Table from '@editorjs/table';
import InlineCode from '@editorjs/inline-code';
import NestedList from '@editorjs/nested-list';
import CodeBlock, { CodeBlockConfig } from 'src/app/core/tools/code-block';
import { CodeModel } from 'src/app/core/tools/code-model';
import ImageBlock, { ImageBlockConfig } from 'src/app/core/tools/image-block';
import { ImageRepositoryService } from 'src/app/core/repository/image-repository.service';
import { TokenService } from 'src/app/core/auth/token.service';

@Component({
  selector: 'ContentEditor',
  templateUrl: './content-editor.component.html',
  styleUrls: ['./content-editor.component.scss'],
})
export class ContentEditorComponent implements OnDestroy, OnChanges {
  @Input() content = '';
  @Output() contentChange = new EventEmitter<string>();

  editor!: EditorJS;
  isEditorInitialized = false;

  autoSave!: any;

  code: CodeModel | null = null;
  isShowCodePage: boolean = true;

  constructor(private tokenService: TokenService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.renderFirstValidContent(changes);
  }

  ngOnInit(): void {
    this.initEditorJS();
  }

  ngOnDestroy(): void {
    this.editor.isReady.then(() => {
      this.editor.destroy();
    });
  }

  onExecuteCode(data: string) {
    // console.log('receive input : ', data);
  }

  onReceiveResponse() {
    // this.IO$.next({ type: IOType.OUTPUT, data: 'Output' });
  }

  getCodeFromEditor() {}

  initEditorJS() {
    let codeBlockConfig: CodeBlockConfig = {
      name: 'code-block',
      event: this.getCodeData,
    };

    let imageBlockConfig: ImageBlockConfig = {
      token: this.tokenService.token
    };

    this.editor = new EditorJS({
      holder: 'editorjs',
      placeholder: 'สร้างสรรค์ไอเดียสุดบรรเจิด...',
      tools: {
        header: Header,
        delimiter: Delimiter,
        table: Table,
        inlineCode: InlineCode,
        nestedList: NestedList,
        codeBlock: {
          class: CodeBlock as any,
          config: codeBlockConfig,
        },
        image: {
          class: ImageBlock as any,
          config: imageBlockConfig,
        },
      },
      onChange: () => {
        clearTimeout(this.autoSave);
        this.autoSave = setTimeout(
          () =>
            this.editor.save().then((output) => {
              this.contentChange.emit(JSON.stringify(output));
            }),
          1000
        );
      },
    });
  }

  getCodeData = (code: CodeModel) => {
    this.openCodePage();
    this.code = code;
  };

  openCodePage() {
    this.isShowCodePage = true;
  }

  closeCodePage() {
    this.isShowCodePage = false;
  }

  private tryRender() {
    try {
      console.log("rendering");
      this.editor?.isReady.then(()=>{
        console.log("rendered");
        this.editor.render(JSON.parse(this.content));
      });
    } catch (error) {
      if (error instanceof Error)
        console.error(error.message);
      console.error(error);
    }
  }

  private renderFirstValidContent(changes:SimpleChanges){
    const content = changes['content'];

    console.log(content);

    const isPreviousValid = !!content.previousValue && content.previousValue?.length !== 0;
    const isCurrentValid = !!content.currentValue && content.currentValue?.length !== 0;

    console.debug(content);
    console.debug("isPreviousValid : ", isPreviousValid);
    console.debug("isCurrentValid : ", isCurrentValid);

    if (!isPreviousValid && isCurrentValid){
      const blocks:unknown[] = JSON.parse(content.currentValue).blocks
      console.log(blocks.length);
      if (blocks.length > 0 )
        this.tryRender();
    }
  }
}
