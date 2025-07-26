import {
  createUploadRouteHandler,
  route,
  type Router,
} from 'better-upload/server';

import { S3Client } from '@aws-sdk/client-s3';

type ClientMetadata = {
  folderName: string;
}

const client = new S3Client({
   region: process.env.S3_REGION!,
   endpoint: process.env.S3_ENDPOINT!,
   credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
   }
});
    
const router: Router = {
  client,
  bucketName: 'youtube',
  routes: {
    form: route({
      multipleFiles: true,
      maxFileSize: 1024 * 1024 * 20,
      maxFiles: 5,
      onBeforeUpload(data) {
        const metadata = data.clientMetadata as ClientMetadata;
        return {
          generateObjectKey: ({ file }) => `${metadata.folderName}/${file.name}`,
        };
      },
    }),
  },
};

export const { POST } = createUploadRouteHandler(router);