'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useUploadFiles } from 'better-upload/client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UploadDropzone } from './ui/upload-dropzone';
import { Loader2 } from 'lucide-react';
const formSchema = z.object({
  folderName: z.string().min(1),
  files: z.array(z.instanceof(File)).min(1), // for Zod v4: z.array(z.file()).min(1),
});

export function FormUploader() {
  const {
    upload,
    control: uploadControl,
    isPending: isUploading,
    averageProgress: averageProgress,
  } = useUploadFiles({
    route: 'form',
    onError: (error) => {
      form.setError('files', {
        message: error.message || 'An error occurred',
      });
    },
    onUploadComplete: () => {
      form.reset();
    }
  });

 
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      folderName: '',
      files: [],
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const { files } = await upload(data.files, {
      metadata: {
        folderName: data.folderName,
      },
    });

    // call your API here
    console.log({
      folderName: data.folderName,
      objectKeys: files.map((file) => file.objectKey),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="folderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Folder name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch('files').length > 0 ? (
          <div className="flex flex-col">
            {form.watch('files').map((file, i) => (
              <p key={i}>{file.name}</p>
            ))}
          </div>
        ) : (
          <FormField
            control={form.control}
            name="files"
            render={() => (
              <FormItem>
                <FormLabel>Files</FormLabel>
                <FormControl>
                  <UploadDropzone
                    control={uploadControl}
                    description={{
                        maxFiles: 5,
                        maxFileSize: "20MB"
                    }}
                    uploadOverride={(files) => {
                      form.setValue('files', Array.from(files));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" disabled={isUploading}>
          {isUploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading... {(averageProgress * 100).toFixed(1)}%</> : "Submit"}
        </Button>
      </form>
    </Form>
  );
}