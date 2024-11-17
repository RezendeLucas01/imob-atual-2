import React from 'react';
import { SearchFilters } from '../types';
import { Search } from 'lucide-react';

interface SearchFormProps {
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  onSearch: () => void;
  categories: string[];
}

const regioes = ['Central', 'Norte', 'Sul', 'Leste', 'Oeste'];
const modalidades = ['Aluguel', 'Venda'];

export default function SearchForm({ filters, setFilters, onSearch, categories }: SearchFormProps) {
  const handleCheckboxChange = (field: keyof SearchFilters, value: string) => {
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [field]: prev[field].includes(value)
          ? prev[field].filter(v => v !== value)
          : [...prev[field], value]
      };
      console.log(`Updated ${field}:`, newFilters[field]);
      return newFilters;
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rua</label>
          <input
            type="text"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={filters.rua}
            onChange={e => setFilters(prev => ({ ...prev, rua: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Referência</label>
          <input
            type="text"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={filters.referencia}
            onChange={e => setFilters(prev => ({ ...prev, referencia: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
          <input
            type="text"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={filters.bairro}
            onChange={e => setFilters(prev => ({ ...prev, bairro: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Valor Mínimo</label>
          <input
            type="number"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={filters.valorMinimo}
            onChange={e => setFilters(prev => ({ ...prev, valorMinimo: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Valor Máximo</label>
          <input
            type="number"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={filters.valorMaximo}
            onChange={e => setFilters(prev => ({ ...prev, valorMaximo: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <input
            type="text"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={filters.descricao}
            onChange={e => setFilters(prev => ({ ...prev, descricao: e.target.value }))}
          />
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="pb-4 border-b border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">Regiões</label>
          <div className="flex flex-wrap gap-4">
            {regioes.map(regiao => (
              <label key={regiao} className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  checked={filters.regioes.includes(regiao)}
                  onChange={() => handleCheckboxChange('regioes', regiao)}
                />
                <span className="ml-2">{regiao}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="py-4 border-b border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">Modalidades</label>
          <div className="flex flex-wrap gap-4">
            {modalidades.map(modalidade => (
              <label key={modalidade} className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  checked={filters.modalidades.includes(modalidade)}
                  onChange={() => handleCheckboxChange('modalidades', modalidade)}
                />
                <span className="ml-2">{modalidade}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Categorias</label>
          <div className="flex flex-wrap gap-4">
            {categories.map(categoria => (
              <label key={categoria} className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  checked={filters.categorias.includes(categoria)}
                  onChange={() => handleCheckboxChange('categorias', categoria)}
                />
                <span className="ml-2">{categoria}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={onSearch}
        className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors"
      >
        <Search size={20} />
        Buscar Imóveis
      </button>
    </div>
  );
}