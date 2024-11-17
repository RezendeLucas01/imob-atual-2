import React, { useState } from 'react';
import { Copy, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { Property } from '../types';
import InfoModal from './InfoModal';

interface PropertyCardProps {
  property: Property;
}

const regionColors: Record<string, { bg: string; text: string }> = {
  Central: { bg: 'bg-purple-100', text: 'text-purple-800' },
  Norte: { bg: 'bg-red-100', text: 'text-red-800' },
  Sul: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  Leste: { bg: 'bg-indigo-100', text: 'text-indigo-800' },
  Oeste: { bg: 'bg-emerald-100', text: 'text-emerald-800' }
};

export default function PropertyCard({ property }: PropertyCardProps) {
  const [showInfo, setShowInfo] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const generatePropertyUrl = (reference: string) => {
    const id = reference.split('.')[0];
    return `https://www.imobiliariaatual.com.br/imovel/?id=${id}&ref=${reference}&search=0`;
  };

  const copyToClipboard = () => {
    const propertyUrl = generatePropertyUrl(property.referencia);
    const text = [
      `*Referência:* ${property.referencia}`,
      `*Endereço:* ${property.rua}, ${property.bairro}`,
      `*Quartos:* ${property.quartos}, *Vagas de garagem:* ${property.garagem}`,
      `*Modalidade:* ${property.modalidade}, *Categoria:* ${property.categoria}`,
      property.disponivel_locacao === 'D' ? `*Valor Aluguel:* ${formatCurrency(property.valor_aluguel)}` : '',
      property.disponivel_venda === 'D' ? `*Valor Venda:* ${formatCurrency(property.valor_venda)}` : '',
      property.valor_condominio ? `*Valor condomínio:* ${formatCurrency(property.valor_condominio)}` : '',
      '',
      propertyUrl
    ].filter(Boolean).join('\n');

    navigator.clipboard.writeText(text);
    toast.success('Informações copiadas!');
  };

  const regionStyle = regionColors[property.regiao] || { bg: 'bg-gray-100', text: 'text-gray-800' };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-lg font-semibold">Ref: {property.referencia}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={copyToClipboard}
                className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-colors"
                title="Copiar informações"
              >
                <Copy size={20} />
              </button>
              <button
                onClick={() => setShowInfo(true)}
                className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-colors"
                title="Ver informações"
              >
                <Info size={20} />
              </button>
              {property.disponivel_locacao === 'D' && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  Locação
                </span>
              )}
              {property.disponivel_venda === 'D' && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  Venda
                </span>
              )}
            </div>
          </div>

          <p className="text-gray-700 mb-2">{property.rua}, {property.bairro}</p>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
              {property.categoria}
            </span>
            <span className={`px-2 py-1 ${regionStyle.bg} ${regionStyle.text} text-xs font-medium rounded-full`}>
              {property.regiao}
            </span>
          </div>
          
          <div className="border-b border-gray-200 pb-3 mb-3">
            <p className="text-gray-700">
              {property.quartos} {property.quartos === 1 ? 'quarto' : 'quartos'} - {' '}
              {property.garagem} {property.garagem === 1 ? 'vaga' : 'vagas'} de garagem
            </p>
          </div>

          <div className="space-y-1">
            {property.disponivel_locacao === 'D' && (
              <p className="text-gray-800">
                Aluguel: <span className="font-semibold">{formatCurrency(property.valor_aluguel)}</span>
              </p>
            )}
            {property.disponivel_venda === 'D' && (
              <p className="text-gray-800">
                Venda: <span className="font-semibold">{formatCurrency(property.valor_venda)}</span>
              </p>
            )}
            {property.valor_condominio > 0 && (
              <p className="text-gray-800">
                Condomínio: <span className="font-semibold">{formatCurrency(property.valor_condominio)}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      <InfoModal
        property={property}
        open={showInfo}
        onClose={() => setShowInfo(false)}
      />
    </>
  );
}