import React, { useState, useEffect } from 'react';
import { Property } from './types';
import SearchForm from './components/SearchForm';
import PropertyCard from './components/PropertyCard';
import { Toaster } from 'react-hot-toast';

interface SearchFilters {
  rua: string;
  referencia: string;
  bairro: string;
  descricao: string;
  valorMinimo: string;
  valorMaximo: string;
  regioes: string[];
  modalidades: string[];
  categorias: string[];
  disponivelAluguel: boolean;
  disponivelVenda: boolean;
}

const initialFilters: SearchFilters = {
  rua: '',
  referencia: '',
  bairro: '',
  descricao: '',
  valorMinimo: '',
  valorMaximo: '',
  regioes: [],
  modalidades: ['Aluguel'],
  categorias: ['Casa Residencial', 'Apartamento'],
  disponivelAluguel: false,
  disponivelVenda: false,
};

function App() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://imobiliaria-atual-default-rtdb.firebaseio.com/data.json');
      const data = await response.json();
      
      const uniqueCategories = [...new Set(Object.values(data).map((prop: any) => prop.Categoria))];
      setCategories(uniqueCategories);

      const propertiesList = Object.keys(data).map(key => {
        return {
          id: key,
          referencia: data[key].Referencia || '',
          categoria: data[key].Categoria || '',
          valor_aluguel: parseFloat(data[key]['Valor aluguel'] || 0),
          valor_condominio: parseFloat(data[key]['Valor condominio'] || 0),
          valor_venda: parseFloat(data[key]['Valor venda'] || 0),
          rua: data[key].Rua || '',
          bairro: data[key].Bairro || '',
          regiao: data[key].Regiao || '',
          quartos: parseInt(data[key].Quartos || 0),
          garagem: parseInt(data[key].Garagem || 0),
          descricao: data[key].Descricao || '',
          fotos: data[key].Fotos || '',
          disponivel_locacao: data[key]['Disponivel Locacao'] || '',
          disponivel_venda: data[key]['Disponivel Venda'] || '',
          modalidade: data[key].Modalidade || ''
        };
      });

      setProperties(propertiesList);
      handleSearch(propertiesList);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (propertyList = properties) => {
    setHasSearched(true);
    const filtered = propertyList.filter(property => {
      if (filters.rua && !property.rua.toLowerCase().includes(filters.rua.toLowerCase())) return false;
      if (filters.referencia && !property.referencia.toLowerCase().includes(filters.referencia.toLowerCase())) return false;
      if (filters.bairro && !property.bairro.toLowerCase().includes(filters.bairro.toLowerCase())) return false;
      if (filters.descricao && !property.descricao.toLowerCase().includes(filters.descricao.toLowerCase())) return false;

      const minValue = parseFloat(filters.valorMinimo);
      const maxValue = parseFloat(filters.valorMaximo);
      
      if (!isNaN(minValue)) {
        if (property.valor_aluguel > 0 && property.valor_aluguel < minValue) return false;
        if (property.valor_venda > 0 && property.valor_venda < minValue) return false;
      }
      
      if (!isNaN(maxValue)) {
        if (property.valor_aluguel > 0 && property.valor_aluguel > maxValue) return false;
        if (property.valor_venda > 0 && property.valor_venda > maxValue) return false;
      }

      if (filters.regioes.length > 0 && !filters.regioes.includes(property.regiao)) return false;

      if (filters.modalidades.length > 0) {
        const modalidadeMatches = filters.modalidades.some(modalidade => {
          if (modalidade === 'Aluguel') {
            return property.modalidade === 'Aluguel' || property.modalidade === 'Sale/Rent';
          }
          if (modalidade === 'Venda') {
            return property.modalidade === 'Venda' || property.modalidade === 'Sale/Rent';
          }
          return false;
        });
        if (!modalidadeMatches) return false;
      }

      if (filters.categorias.length > 0 && !filters.categorias.includes(property.categoria)) return false;

      if (filters.disponivelAluguel && property.disponivel_locacao !== 'D') return false;
      if (filters.disponivelVenda && property.disponivel_venda !== 'D') return false;

      return true;
    });

    setFilteredProperties(filtered);
  };

  useEffect(() => {
    // Load categories on initial mount
    const loadCategories = async () => {
      try {
        const response = await fetch('https://imobiliaria-atual-default-rtdb.firebaseio.com/data.json');
        const data = await response.json();
        const uniqueCategories = [...new Set(Object.values(data).map((prop: any) => prop.Categoria))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    loadCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Busca de Imóveis</h1>
        
        <SearchForm
          filters={filters}
          setFilters={setFilters}
          onSearch={fetchProperties}
          categories={categories}
        />

        {hasSearched && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}

        {hasSearched && filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum imóvel encontrado com os filtros selecionados.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;