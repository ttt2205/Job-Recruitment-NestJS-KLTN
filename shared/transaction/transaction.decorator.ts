import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

/*
Checklist trước khi dùng decorator này

 + MongoDB đang chạy replica set.

 + Inject @InjectConnection() trong các service dùng decorator.

 + Method gốc nhận session?: ClientSession và dùng { session } khi gọi Mongoose operations.

 + Quyết định propagation: cần share session giữa service không? (nếu có, dùng phiên bản decorator có kiểm tra session hiện có).

 + Xử lý logging và retry khi commit thất bại (tuỳ hệ thống).
*/
export function Transactional() {
  return function (
    target: any, // prototype của class
    propertyKey: string, // tên method (vd: 'createUser')
    descriptor: PropertyDescriptor, // thông tin mô tả method
  ) {
    const original = descriptor.value; // lấy hàm gốc

    descriptor.value = async function (...args: any[]) {
      const connection: Connection = this.connection ?? this['connection'];
      const session = await connection.startSession();
      session.startTransaction();

      try {
        const result = await original.apply(this, [...args, session]);
        await session.commitTransaction();
        return result;
      } catch (err) {
        await session.abortTransaction();
        throw err;
      } finally {
        session.endSession();
      }
    };

    return descriptor;
  };
}
