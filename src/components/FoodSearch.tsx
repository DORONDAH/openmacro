import { useState } from 'react';
import { Search, Scan, Plus, Loader2, ArrowLeft, Utensils } from 'lucide-react';
import { searchProducts, getProductByBarcode, type OFFProduct } from '../api/off';
import BarcodeScanner from './Scanner/BarcodeScanner';
import FoodEntryModal from './FoodEntryModal';

const FoodSearch: React.FC<{ onBack: () => void; onAdded: () => void }> = ({ onBack, onAdded }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<OFFProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<OFFProduct | null>(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    const { data, error } = await searchProducts(query);
    if (error) {
      alert(error);
    } else {
      setResults(data || []);
    }
    setLoading(false);
  };

  const handleBarcodeScan = async (barcode: string) => {
    setShowScanner(false);
    setLoading(true);
    const { data, error } = await getProductByBarcode(barcode);
    if (data) {
      setSelectedProduct(data);
    } else {
      alert(error || 'Product not found');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-bold">Add Food</h2>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search food or brand..."
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowScanner(true)}
          className="p-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl hover:bg-gray-200 transition-colors"
        >
          <Scan size={20} />
        </button>
      </form>

      <div className="space-y-3">
        {loading && (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-blue-500" size={32} />
          </div>
        )}

        {!loading && results.map((product) => (
          <div key={product.id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-xl bg-gray-50" />
            ) : (
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                <Utensils size={24} className="text-gray-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-bold truncate">{product.name}</h4>
              <p className="text-sm text-gray-500">{product.brand || 'Generic'}</p>
              <div className="flex gap-3 mt-1 text-xs font-medium">
                <span className="text-blue-600">{product.calories} kcal</span>
                <span className="text-orange-600">P: {product.protein}g</span>
                <span className="text-green-600">C: {product.carbs}g</span>
                <span className="text-yellow-600">F: {product.fat}g</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedProduct(product)}
              className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
        ))}

        {!loading && query && results.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No products found. Try a different search or add a custom food.
          </div>
        )}
      </div>

      {showScanner && (
        <BarcodeScanner
          onScan={handleBarcodeScan}
          onClose={() => setShowScanner(false)}
        />
      )}

      {selectedProduct && (
        <FoodEntryModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSave={onAdded}
        />
      )}

      {showQuickAdd && (
        <FoodEntryModal
          onClose={() => setShowQuickAdd(false)}
          onSave={onAdded}
        />
      )}

      {/* Quick Add Button */}
      <button
        onClick={() => setShowQuickAdd(true)}
        className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-all flex items-center justify-center gap-2"
      >
        <Plus size={18} />
        Quick Add Calories/Macros
      </button>
    </div>
  );
};

export default FoodSearch;
