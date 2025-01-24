import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private bucketName: string;
  private endpoint: string;

  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.getOrThrow<string>('s3.bucketName');
    this.endpoint = this.configService.getOrThrow<string>('s3.endpoint');
    this.s3Client = new S3Client({
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('s3.accessKey'),
        secretAccessKey:
          this.configService.getOrThrow<string>('s3.secretAccessKey'),
      },
      endpoint: this.endpoint,
      region: 'ru-central1',
    });
  }

  async uploadBase64Image(base64Image: string) {
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const contentType = base64Image.match(/^data:(image\/\w+);base64,/)![1];
    const fileName = `${Date.now().toString()}-${uuidv4()}.jpg`;
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
      Body: buffer,
      ContentType: contentType,
    });

    await this.s3Client.send(command);

    return `${this.endpoint}/${this.bucketName}/${fileName}`;
  }
}
