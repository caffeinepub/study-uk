import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Link as LinkIcon } from 'lucide-react';
import { useUploadWallpaper } from '../../hooks/useQueries';
import { ExternalBlob } from '../../backend';
import { toast } from 'sonner';

export default function WallpaperUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const uploadWallpaperMutation = useUploadWallpaper();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUrl('');
    }
  };

  const handleFileUpload = async () => {
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      const name = `custom-${Date.now()}`;
      await uploadWallpaperMutation.mutateAsync({ name, blob });
      
      toast.success('Wallpaper uploaded successfully!');
      setFile(null);
      setUploadProgress(0);
    } catch (error) {
      toast.error('Failed to upload wallpaper');
      setUploadProgress(0);
    }
  };

  const handleUrlUpload = async () => {
    if (!url) return;

    try {
      const blob = ExternalBlob.fromURL(url);
      const name = `custom-${Date.now()}`;
      await uploadWallpaperMutation.mutateAsync({ name, blob });
      
      toast.success('Wallpaper added successfully!');
      setUrl('');
    } catch (error) {
      toast.error('Failed to add wallpaper');
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="file-upload" className="text-white">Upload from File</Label>
        <div className="flex gap-2">
          <Input
            id="file-upload"
            type="file"
            accept="image/*,video/mp4,video/webm"
            onChange={handleFileChange}
            className="text-white"
          />
          <Button
            onClick={handleFileUpload}
            disabled={!file || uploadWallpaperMutation.isPending}
            className="text-white hover:text-white/80"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>
        {uploadProgress > 0 && uploadProgress < 100 && (
          <p className="text-sm text-white/70">Uploading: {uploadProgress}%</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="url-upload" className="text-white">Add from URL</Label>
        <div className="flex gap-2">
          <Input
            id="url-upload"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="text-white"
          />
          <Button
            onClick={handleUrlUpload}
            disabled={!url || uploadWallpaperMutation.isPending}
            className="text-white hover:text-white/80"
          >
            <LinkIcon className="mr-2 h-4 w-4" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
