import {ExcelComponent} from '@core/ExcelComponent';

export class Header extends ExcelComponent {
  static className = 'excel__header'
  toHTML() {
    return `<input type="text" value="New table" class="input"/>
            <div>

                <div class="button">
                    <span class="material-icons">clear</span>
                </div>

                <div class="button">
                    <span class="material-icons">exit_to_app</span>
                </div>

            </div>`
  }
}
