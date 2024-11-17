import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import { X, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import { Property } from '../types';

interface InfoModalProps {
  property: Property;
  open: boolean;
  onClose: () => void;
}

export default function InfoModal({ property, open, onClose }: InfoModalProps) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (open && property.fotos) {
      setLoading(true);
      const photoUrls = property.fotos
        .split('https://')
        .filter(Boolean)
        .map(url => `https://${url}`);
      setPhotos(photoUrls);
      setCurrentPhotoIndex(0);
      setImageError({});
      setLoading(false);
    }
  }, [open, property.fotos]);

  const handlePrevious = () => {
    setCurrentPhotoIndex(prev => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentPhotoIndex(prev => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const handleImageError = (index: number) => {
    setImageError(prev => ({ ...prev, [index]: true }));
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[900px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white shadow-lg overflow-y-auto">
          <Dialog.Title className="sr-only">
            Detalhes do imóvel {property.referencia}
          </Dialog.Title>
          
          <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 z-50">
            <X size={24} />
          </Dialog.Close>

          <Tabs.Root defaultValue="photos" className="outline-none">
            <Tabs.List className="flex border-b border-gray-200 sticky top-0 bg-white z-10">
              <Tabs.Trigger
                value="photos"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600"
              >
                Fotos
              </Tabs.Trigger>
              <Tabs.Trigger
                value="info"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600"
              >
                Informações do imóvel
              </Tabs.Trigger>
              <Tabs.Trigger
                value="queue"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600"
              >
                Fila
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="photos" className="p-4">
              {loading ? (
                <div className="flex items-center justify-center h-[400px]">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : photos.length > 0 ? (
                <div className="relative">
                  <div className="aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden">
                    {!imageError[currentPhotoIndex] ? (
                      <img
                        src={photos[currentPhotoIndex]}
                        alt={`Foto ${currentPhotoIndex + 1}`}
                        className="w-full h-full object-contain"
                        onError={() => handleImageError(currentPhotoIndex)}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                        <ImageIcon size={48} />
                        <p className="mt-2">Imagem não disponível</p>
                      </div>
                    )}
                  </div>
                  
                  {photos.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevious}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                        aria-label="Foto anterior"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        onClick={handleNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                        aria-label="Próxima foto"
                      >
                        <ChevronRight size={24} />
                      </button>
                    </>
                  )}
                  
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {currentPhotoIndex + 1} / {photos.length}
                  </div>

                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {photos.map((photo, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPhotoIndex(index)}
                        className={`aspect-square rounded-lg overflow-hidden ${
                          index === currentPhotoIndex ? 'ring-2 ring-blue-500' : ''
                        }`}
                      >
                        {!imageError[index] ? (
                          <img
                            src={photo}
                            alt={`Miniatura ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={() => handleImageError(index)}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <ImageIcon className="text-gray-400" size={24} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-gray-500">
                  <ImageIcon size={48} className="mb-4" />
                  <p>Nenhuma foto disponível</p>
                </div>
              )}
            </Tabs.Content>

            <Tabs.Content value="info" className="p-4">
              <p className="text-gray-500">Informações do imóvel em breve...</p>
            </Tabs.Content>

            <Tabs.Content value="queue" className="p-4">
              <p className="text-gray-500">Informações da fila em breve...</p>
            </Tabs.Content>
          </Tabs.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}