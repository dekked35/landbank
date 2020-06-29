import { NgModule, Component, ElementRef, OnDestroy, OnInit, Input, Output, EventEmitter, forwardRef, Renderer2, NgZone, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomHandler } from 'primeng/dom';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

export const SLIDER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CustomSliderComponent),
  multi: true
};

@Component({
  selector: 'app-custom-slider',
  templateUrl: './custom-slider.component.html',
  styleUrls: ['./custom-slider.component.css'],
  providers: [SLIDER_VALUE_ACCESSOR]

})
export class CustomSliderComponent implements OnDestroy, ControlValueAccessor {

  @Input() animate: boolean;

  @Input() disabled: boolean;

  @Input() min: number = 0;

  @Input() max: number = 100;

  @Input() commonValue: number;
  @Input() maxTotal: number;

  @Input() orientation: string = 'horizontal';

  @Input() step: number;

  @Input() range: boolean;

  @Input() style: any;

  @Input() styleClass: string;

  @Input() ariaLabelledBy: string;

  @Input() tabindex: number = 0;

  @Output() onChange: EventEmitter<any> = new EventEmitter();

  @Output() onSlideEnd: EventEmitter<any> = new EventEmitter();

  @ViewChild("sliderHandle", { static: false }) sliderHandle: ElementRef;

  @ViewChild("sliderHandleStart", { static: false }) sliderHandleStart: ElementRef;

  @ViewChild("sliderHandleEnd", { static: false }) sliderHandleEnd: ElementRef;

  public value: number;

  public values: number[];

  public handleValue: number;

  public handleValues: number[] = [];

  public onModelChange: Function = () => { };

  public onModelTouched: Function = () => { };

  public dragging: boolean;

  public dragListener: any;

  public mouseupListener: any;

  public initX: number;

  public initY: number;

  public barWidth: number;

  public barHeight: number;

  public sliderHandleClick: boolean;

  public handleIndex: number = 0;

  public startHandleValue: any;

  public startx: number;

  public starty: number;

  constructor(public el: ElementRef, public renderer: Renderer2, private ngZone: NgZone, public cd: ChangeDetectorRef) { }

  lastPoint = { x: null, y: null };

  detectEvent(event, clientX, clientY) {
    let leftOrRight = (
      clientX > this.lastPoint.x ? 'right'
        : clientX < this.lastPoint.x ? 'left'
          : 'none'
    )

    let upOrDown = (
      clientY > this.lastPoint.y ? 'down'
        : clientY < this.lastPoint.y ? 'up'
          : 'none'
    )
    // console.log("------------------------------")
    // console.log("leftOrRight : " + leftOrRight);
    // console.log("upOrDown : " + upOrDown);
    // console.log("------------------------------")

    this.lastPoint.x = clientX;
    this.lastPoint.y = clientY;
    return { horizental: leftOrRight, vertical: upOrDown };
  }
  isBlockEvent: boolean;
  blockUserEvent(event, clientX, clientY) {
    let side = this.detectEvent(event, clientX, clientY);
    let detectSide = (
      side['horizental'] == "left" && side['vertical'] == "none" ? "left" :
        side['horizental'] == "right" && side['vertical'] == "none" ? "right" :
          "none"
    )
    let isBlockEvent = (this.commonValue >= this.maxTotal) && (side['horizental'] !== "left");
    if (isBlockEvent) {
      // event.preventDefault();
      // event.stopPropagation();
      this.isBlockEvent = true;
      return true;
    }
    this.isBlockEvent = false;
    return false;
  }

  onMouseDown(event, index?: number) {
    if (this.disabled) {
      return;
    }
    // console.log("onMouseDown")
    this.dragging = true;
    this.updateDomData();
    this.sliderHandleClick = true;
    this.handleIndex = index;
    this.bindDragListeners();
    event.target.focus();
    event.preventDefault();
  }

  onTouchStart(event, index?: number) {
    if (this.disabled) {
      return;
    }
    console.log("onTouchStart")
   
    var touchobj = event.changedTouches[0];
    this.startHandleValue = (this.range) ? this.handleValues[index] : this.handleValue;
    this.dragging = true;
    this.handleIndex = index;

    if (this.orientation === 'horizontal') {
      this.startx = parseInt(touchobj.clientX, 10);
      this.barWidth = this.el.nativeElement.children[0].offsetWidth;
    }
    else {
      this.starty = parseInt(touchobj.clientY, 10);
      this.barHeight = this.el.nativeElement.children[0].offsetHeight;
    }

    event.preventDefault();
  }

  onTouchMove(event, index?: number) {
    if (this.disabled) {
      return;
    }
    console.log("onTouchMove")



    var touchobj = event.changedTouches[0],
      handleValue = 0;
    if (this.blockUserEvent(event, touchobj.clientX, touchobj.clientY)) {
      return;
    }
    if (this.orientation === 'horizontal') {
      handleValue = Math.floor(((parseInt(touchobj.clientX, 10) - this.startx) * 100) / (this.barWidth)) + this.startHandleValue;
    }
    else {
      handleValue = Math.floor(((this.starty - parseInt(touchobj.clientY, 10)) * 100) / (this.barHeight)) + this.startHandleValue;
    }

    this.setValueFromHandle(event, handleValue);

    event.preventDefault();
  }

  onTouchEnd(event, index?: number) {
    if (this.disabled) {
      return;
    }
    console.log("onTouchEnd")
    this.dragging = false;
    var touchobj = event.changedTouches[0]
    if (this.blockUserEvent(event, touchobj.clientX, touchobj.clientY)) {
      this.commonValue = 100;
      return;
    }
    if (this.range)
      this.onSlideEnd.emit({ originalEvent: event, values: this.values });
    else
      this.onSlideEnd.emit({ originalEvent: event, value: this.value });

    event.preventDefault();
  }

  onBarClick(event) {
    if (this.disabled) {
      return;
    }
    console.log("onBarClick");
    if (!this.sliderHandleClick) {
      this.updateDomData();
      this.handleChange(event);
    }

    this.sliderHandleClick = false;
  }

  onHandleKeydown(event, handleIndex?: number) {
    if (event.which == 38 || event.which == 39) {
      this.spin(event, 1, handleIndex);
    }
    else if (event.which == 37 || event.which == 40) {
      this.spin(event, -1, handleIndex);
    }
  }

  spin(event, dir: number, handleIndex?: number) {
    let step = (this.step || 1) * dir;
    console.log("Spin action");
    if (this.range) {
      this.handleIndex = handleIndex;
      this.updateValue(this.values[this.handleIndex] + step);
      this.updateHandleValue();
    }
    else {
      this.updateValue(this.value + step);
      this.updateHandleValue();
    }

    event.preventDefault();
  }

  handleChange(event: Event) {
    let handleValue = this.calculateHandleValue(event);
    this.setValueFromHandle(event, handleValue);
  }

  bindDragListeners() {
    this.ngZone.runOutsideAngular(() => {
      if (!this.dragListener) {
        this.dragListener = this.renderer.listen('document', 'mousemove', (event) => {
          if (this.blockUserEvent(event, event.clientX, event.clientY)) {
            return;
          }
          if (this.dragging) {
            this.ngZone.run(() => {
                this.handleChange(event);
            });
          }
        });
      }

      if (!this.mouseupListener) {
        this.mouseupListener = this.renderer.listen('document', 'mouseup', (event) => {
          if (this.dragging) {
            this.dragging = false;
            this.ngZone.run(() => {
              if (this.range) {
                this.onSlideEnd.emit({ originalEvent: event, values: this.values });
              } else {
                this.onSlideEnd.emit({ originalEvent: event, value: this.value });
              }
            });
          }
        });
      }
    });
  }

  unbindDragListeners() {
    if (this.dragListener) {
      this.dragListener();
    }

    if (this.mouseupListener) {
      this.mouseupListener();
    }
  }

  setValueFromHandle(event: Event, handleValue: any) {
    let newValue = this.getValueFromHandle(handleValue);
    if (this.range) {
      if (this.step) {
        this.handleStepChange(newValue, this.values[this.handleIndex]);
      }
      else {
        this.handleValues[this.handleIndex] = handleValue;
        this.updateValue(newValue, event);
      }
    }
    else {
      if (this.step) {
        this.handleStepChange(newValue, this.value);
      }
      else {
        this.handleValue = handleValue;
        this.updateValue(newValue, event);
      }
    }
  }

  handleStepChange(newValue: number, oldValue: number) {
    let diff = (newValue - oldValue);
    let val = oldValue;

    if (diff < 0) {
      val = oldValue + Math.ceil(newValue / this.step - oldValue / this.step) * this.step;
    }
    else if (diff > 0) {
      val = oldValue + Math.floor(newValue / this.step - oldValue / this.step) * this.step;
    }

    this.updateValue(val);
    this.updateHandleValue();
  }

  writeValue(value: any): void {
    if (this.range)
      this.values = value || [0, 0];
    else
      this.value = value || 0;

    this.updateHandleValue();
    this.cd.markForCheck();
  }

  registerOnChange(fn: Function): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onModelTouched = fn;
  }

  setDisabledState(val: boolean): void {
    this.disabled = val;
  }

  get rangeStartLeft() {
    return this.isVertical() ? 'auto' : this.handleValues[0] + '%';
  }

  get rangeStartBottom() {
    return this.isVertical() ? this.handleValues[0] + '%' : 'auto';
  }

  get rangeEndLeft() {
    return this.isVertical() ? 'auto' : this.handleValues[1] + '%';
  }

  get rangeEndBottom() {
    return this.isVertical() ? this.handleValues[1] + '%' : 'auto';
  }

  isVertical(): boolean {
    return this.orientation === 'vertical';
  }

  updateDomData(): void {
    let rect = this.el.nativeElement.children[0].getBoundingClientRect();
    this.initX = rect.left + DomHandler.getWindowScrollLeft();
    this.initY = rect.top + DomHandler.getWindowScrollTop();
    this.barWidth = this.el.nativeElement.children[0].offsetWidth;
    this.barHeight = this.el.nativeElement.children[0].offsetHeight;
  }

  calculateHandleValue(event): number {
    if (this.orientation === 'horizontal')
      return ((event.pageX - this.initX) * 100) / (this.barWidth);
    else
      return (((this.initY + this.barHeight) - event.pageY) * 100) / (this.barHeight);
  }

  updateHandleValue(): void {
    if (this.range) {
      this.handleValues[0] = (this.values[0] < this.min ? 0 : this.values[0] - this.min) * 100 / (this.max - this.min);
      this.handleValues[1] = (this.values[1] > this.max ? 100 : this.values[1] - this.min) * 100 / (this.max - this.min);
    }
    else {
      if (this.value < this.min)
        this.handleValue = 0;
      else if (this.value > this.max)
        this.handleValue = 100;
      else
        this.handleValue = (this.value - this.min) * 100 / (this.max - this.min);
    }
  }

  updateValue(val: number, event?: Event): void {
    if (this.range) {
      let value = val;

      if (this.handleIndex == 0) {
        if (value < this.min) {
          value = this.min;
          this.handleValues[0] = 0;
        }
        else if (value > this.values[1]) {
          value = this.values[1];
          this.handleValues[0] = this.handleValues[1];
        }

        this.sliderHandleStart.nativeElement.focus();
      }
      else {
        if (value > this.max) {
          value = this.max;
          this.handleValues[1] = 100;
        }
        else if (value < this.values[0]) {
          value = this.values[0];
          this.handleValues[1] = this.handleValues[0];
        }

        this.sliderHandleEnd.nativeElement.focus();
      }

      this.values[this.handleIndex] = this.getNormalizedValue(value);
      this.onModelChange(this.values);
      this.onChange.emit({ event: event, values: this.values });
    }
    else {
      if (val < this.min) {
        val = this.min;
        this.handleValue = 0;
      }
      else if (val > this.max) {
        val = this.max;
        this.handleValue = 100;
      }

      // if (this.submax && (val >= this.maxTotal)) {

      // if(this.commonValue > 100){
      //   event.preventDefault();
      //   return;
      // } else {
      this.value = this.getNormalizedValue(val);
      this.onModelChange(this.value);
      this.onChange.emit({ event: event, value: this.value });
      this.sliderHandle.nativeElement.focus();
      // }

      // }

    }
  }

  getValueFromHandle(handleValue: number): number {
    return (this.max - this.min) * (handleValue / 100) + this.min;
  }

  getDecimalsCount(value: number): number {
    if (value && Math.floor(value) !== value)
      return value.toString().split(".")[1].length || 0;
    return 0;
  }

  getNormalizedValue(val: number): number {
    let decimalsCount = this.getDecimalsCount(this.step);
    if (decimalsCount > 0) {
      return +val.toFixed(decimalsCount);
    }
    else {
      return Math.floor(val);
    }
  }

  ngOnDestroy() {
    this.unbindDragListeners();
  }
}
