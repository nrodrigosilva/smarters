import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommentService } from '../../services/comment.service';
import { Comment } from '../../models/comment.model';

@Component({
  selector: 'app-comment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss'],
})
export class CommentFormComponent {
  @Input() postId!: number;
  @Output() commentAdded = new EventEmitter<Comment>();

  commentForm: FormGroup;
  submitting = false;
  success = false;

  constructor(private fb: FormBuilder, private commentService: CommentService) {
    this.commentForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      body: ['', Validators.required],
    });
  }

  isInvalid(field: string): boolean {
    const control = this.commentForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit(): void {
    if (this.commentForm.invalid) {
      this.commentForm.markAllAsTouched();
      return;
    }

    this.submitting = true;

    const comment = {
      postId: this.postId,
      ...this.commentForm.value,
    };

    this.commentService.addComment(comment).subscribe({
      next: (response) => {
        this.submitting = false;
        this.success = true;
        this.commentForm.reset();

        setTimeout(() => {
          this.success = false;
        }, 3000);

        this.commentAdded.emit(response);
      },
      error: (error) => {
        console.error('Error adding comment:', error);
        this.submitting = false;
      },
    });
  }
}
