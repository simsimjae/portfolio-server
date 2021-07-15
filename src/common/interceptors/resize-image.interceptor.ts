import { classToPlain } from 'class-transformer';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {}

@Injectable()
export class ResizeImageInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<Response<T>> {
    console.log(4444, context);
    return next.handle().pipe(
      map((data) => {
        const obj = classToPlain(data);
        console.log(123123, obj);
        return obj;
      }),
    );
  }
}
