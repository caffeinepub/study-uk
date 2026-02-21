import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Loader2, Link as LinkIcon } from 'lucide-react';
import { useUploadWallpaper, useWallpapers } from '../../hooks/useQueries';
import { ExternalBlob } from '../../backend';
import { toast } from 'sonner';
import { useWallpaper } from '../../hooks/useWallpaper';

export default function WallpaperUploader() {
  const [name, setName] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadWallpaperMutation = useUploadWallpaper();
  const { data: customWallpapers = [] } = useWallpapers();
  const { setSelectedWallpaper } = useWallpaper();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (!name.trim()) {
      toast.error('Please enter a name for your wallpaper');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      await uploadWallpaperMutation.mutateAsync({ name: name.trim(), blob });
      
      toast.success('Wallpaper uploaded successfully!');
      setName('');
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload wallpaper');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlUpload = async () => {
    if (!urlInput.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    if (!name.trim()) {
      toast.error('Please enter a name for your wallpaper');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const blob = ExternalBlob.fromURL(urlInput.trim()).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      await uploadWallpaperMutation.mutateAsync({ name: name.trim(), blob });
      
      toast.success('Wallpaper uploaded successfully!');
      setName('');
      setUrlInput('');
      setUploadProgress(0);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload wallpaper');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="wallpaper-name" className="text-white drop-shadow-lg">Wallpaper Name</Label>
        <Input
          id="wallpaper-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Custom Wallpaper"
          disabled={isUploading}
          className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="wallpaper-file" className="text-white drop-shadow-lg">Upload from Device</Label>
        <div className="flex gap-2">
          <Input
            id="wallpaper-file"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isUploading}
            className="flex-1 bg-white/10 backdrop-blur-sm border-white/20 text-white file:text-white"
          />
          <Button
            variant="outline"
            size="icon"
            disabled={isUploading || !name.trim()}
            onClick={() => fileInputRef.current?.click()}
            className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="wallpaper-url" className="text-white drop-shadow-lg">Or Enter Image URL</Label>
        <div className="flex gap-2">
          <Input
            id="wallpaper-url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            disabled={isUploading}
            className="flex-1 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50"
          />
          <Button
            variant="outline"
            size="icon"
            disabled={isUploading || !name.trim() || !urlInput.trim()}
            onClick={handleUrlUpload}
            className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LinkIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {isUploading && (
        <div className="space-y-1">
          <div className="w-full bg-white/20 backdrop-blur-sm rounded-full h-2 overflow-hidden">
            <div
              className="bg-white h-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-xs text-white drop-shadow-lg text-center">
            Uploading... {uploadProgress}%
          </p>
        </div>
      )}

      {customWallpapers.length > 0 && (
        <div className="pt-4 border-t border-white/20">
          <h4 className="text-xs font-medium mb-2 text-white drop-shadow-lg">Your Uploads</h4>
          <div className="grid grid-cols-2 gap-2">
            {customWallpapers.map(([wallpaperName, blob]) => (
              <button
                key={wallpaperName}
                onClick={() => setSelectedWallpaper(`custom-${wallpaperName}`)}
                className="relative aspect-video rounded-lg overflow-hidden border-2 border-white/20 hover:border-white/50 transition-all hover:scale-105"
              >
                <img
                  src={blob.getDirectURL()}
                  alt={wallpaperName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                  <p className="text-xs text-white font-medium truncate">{wallpaperName}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
