import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-waiver-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" *ngIf="isVisible" (click)="onOverlayClick($event)">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Liability Waiver - {{ gymName }}</h2>
          <button class="close-button" (click)="closeModal()">&times;</button>
        </div>
        
        <div class="modal-body">
          <div class="waiver-text">
            <div class="waiver-content">
              {{ waiverText }}
            </div>
          </div>
          
          <div class="signature-section">
            <h3>Digital Signature</h3>
            <p>Please sign below to acknowledge that you have read and agree to the terms:</p>
            
            <div class="signature-pad-container">
              <canvas 
                #signatureCanvas 
                class="signature-pad"
                width="400" 
                height="150"
                (mousedown)="startDrawing($event)"
                (mousemove)="draw($event)"
                (mouseup)="stopDrawing()"
                (mouseleave)="stopDrawing()"
                (touchstart)="startDrawing($event)"
                (touchmove)="draw($event)"
                (touchend)="stopDrawing()">
              </canvas>
            </div>
            
            <div class="signature-controls">
              <button type="button" (click)="clearSignature()" class="clear-button">Clear Signature</button>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button 
            type="button" 
            (click)="signWaiver()" 
            [disabled]="!hasSignature || isSubmitting"
            class="sign-button">
            {{ isSubmitting ? 'Signing...' : 'Sign Waiver & Join Gym' }}
          </button>
          <button type="button" (click)="closeModal()" class="cancel-button">Cancel</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    
    .modal-content {
      background: white;
      border-radius: 12px;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid #eee;
    }
    
    .modal-header h2 {
      margin: 0;
      color: #2a2d34;
      font-size: 1.5rem;
    }
    
    .close-button {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #666;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .close-button:hover {
      color: #333;
    }
    
    .modal-body {
      padding: 24px;
    }
    
    .waiver-text {
      margin-bottom: 24px;
    }
    
    .waiver-content {
      background: #f8f9fa;
      padding: 16px;
      border-radius: 8px;
      border: 1px solid #dee2e6;
      max-height: 200px;
      overflow-y: auto;
      font-size: 0.9rem;
      line-height: 1.5;
      white-space: pre-wrap;
    }
    
    .signature-section h3 {
      color: #2a2d34;
      margin-bottom: 8px;
    }
    
    .signature-section p {
      color: #666;
      margin-bottom: 16px;
    }
    
    .signature-pad-container {
      border: 2px solid #dee2e6;
      border-radius: 8px;
      display: inline-block;
      background: white;
    }
    
    .signature-pad {
      display: block;
      cursor: crosshair;
    }
    
    .signature-controls {
      margin-top: 12px;
    }
    
    .clear-button {
      background: #6c757d;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 8px 16px;
      cursor: pointer;
      font-size: 0.9rem;
    }
    
    .clear-button:hover {
      background: #5a6268;
    }
    
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 20px 24px;
      border-top: 1px solid #eee;
    }
    
    .sign-button {
      background: #28a745;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 12px 24px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
    }
    
    .sign-button:hover:not(:disabled) {
      background: #218838;
    }
    
    .sign-button:disabled {
      background: #6c757d;
      cursor: not-allowed;
    }
    
    .cancel-button {
      background: #6c757d;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 12px 24px;
      cursor: pointer;
      font-size: 1rem;
    }
    
    .cancel-button:hover {
      background: #5a6268;
    }
  `]
})
export class WaiverModalComponent implements AfterViewInit, OnChanges {
  @Input() isVisible = false;
  @Input() gymId: number = 0;
  @Input() gymName: string = '';
  @Input() userId: number = 0;

  @Input() waiverText: string = '';
  
  @Output() waiverSigned = new EventEmitter<void>();
  @Output() modalClosed = new EventEmitter<void>();
  
  @ViewChild('signatureCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private ctx!: CanvasRenderingContext2D;
  private isDrawing = false;
  hasSignature = false;
  isSubmitting = false;

  constructor(private apiService: ApiService) {}

  ngAfterViewInit() {
    if (this.isVisible && this.canvasRef) {
      this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
      this.setupCanvas();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isVisible'] && this.isVisible) {
      setTimeout(() => {
        if (this.canvasRef) {
          this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
          this.setupCanvas();
        }
      });
    }
  }

  setupCanvas() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    
    // Set canvas background to white
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  startDrawing(event: MouseEvent | TouchEvent) {
    if (!this.ctx) return;
    this.isDrawing = true;
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = (event instanceof MouseEvent ? event.clientX : event.touches[0].clientX) - rect.left;
    const y = (event instanceof MouseEvent ? event.clientY : event.touches[0].clientY) - rect.top;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    event.preventDefault();
  }

  draw(event: MouseEvent | TouchEvent) {
    if (!this.isDrawing || !this.ctx) return;
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = (event instanceof MouseEvent ? event.clientX : event.touches[0].clientX) - rect.left;
    const y = (event instanceof MouseEvent ? event.clientY : event.touches[0].clientY) - rect.top;
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.hasSignature = true;
    event.preventDefault();
  }

  stopDrawing() {
    this.isDrawing = false;
  }

  clearSignature() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.hasSignature = false;
  }

  signWaiver() {
    if (!this.hasSignature || this.isSubmitting) return;
    
    this.isSubmitting = true;
    const signatureData = this.canvasRef.nativeElement.toDataURL();
    
    const waiver = {
      userId: this.userId,
      gymId: this.gymId,
      signatureData: signatureData,
      waiverText: this.waiverText
    };

    this.apiService.signWaiver(waiver).subscribe({
      next: () => {
        this.waiverSigned.emit();
        this.closeModal();
      },
      error: (err) => {
        console.error('Failed to sign waiver:', err);
        alert('Failed to sign waiver. Please try again.');
        this.isSubmitting = false;
      }
    });
  }

  closeModal() {
    this.isVisible = false;
    this.isSubmitting = false;
    this.modalClosed.emit();
  }

  onOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }
} 