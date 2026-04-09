import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Scan, Plus, Loader2, ArrowLeft, Utensils } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchProducts, getProductByBarcode, type OFFProduct } from '../api/off';
import BarcodeScanner from './Scanner/BarcodeScanner';
import FoodEntryModal from './FoodEntryModal';

const FoodSearch: React.FC<{ onBack: () => void; onAdded: () => void }> = ({ onBack, onAdded }) => {
  const { t } = useTranslation();
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  } as const;

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  } as const;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10 pb-32 px-2"
    >
      <div className="flex items-center gap-6 mb-8 px-2">
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="p-4 glass-card rounded-2xl text-white/50 hover:text-white transition-all shadow-xl"
        >
          <ArrowLeft size={20} />
        </motion.button>
        <div className="flex flex-col gap-1">
          <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-1">{t('search_page.db_search')}</div>
          <h2 className="text-4xl font-black text-white tracking-tighter">{t('search_page.add_entry')}</h2>
          <div className="h-1 w-12 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
        </div>
      </div>

      <motion.form
        variants={itemVariants}
        onSubmit={handleSearch}
        className="flex gap-4 px-2"
      >
        <div className="relative flex-1 group">
          <Search className="absolute start-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search_page.placeholder')}
            className="w-full ps-16 pe-8 py-6 bg-white/5 border border-white/10 rounded-[2.5rem] text-white placeholder:text-white/20 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-bold text-lg shadow-inner"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={() => setShowScanner(true)}
          className="p-6 glass-card rounded-[2rem] hover:bg-white/10 transition-colors text-blue-500 shadow-xl"
        >
          <Scan size={28} />
        </motion.button>
      </motion.form>

      <div className="space-y-4 px-2">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 gap-4"
            >
              <div className="relative">
                <Loader2 className="animate-spin text-blue-500" size={48} />
                <div className="absolute inset-0 blur-xl bg-blue-500/20 animate-pulse rounded-full" />
              </div>
              <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">{t('search_page.querying')}</div>
            </motion.div>
          ) : (
            results.map((product, idx) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * idx }}
                className="glass-card p-6 rounded-[3.5rem] flex items-center gap-6 shadow-2xl hover:bg-white/10 transition-all group cursor-pointer border border-white/5 hover:border-blue-500/30 relative overflow-hidden"
                onClick={() => setSelectedProduct(product)}
              >
                {/* Netflix-style hover glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/5 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div className="relative shrink-0 z-10">
                  {product.image ? (
                    <div className="relative">
                      <img src={product.image} alt={product.name} className="w-28 h-28 object-cover rounded-[2.5rem] bg-black/40 ring-1 ring-white/10 group-hover:scale-105 transition-transform duration-700 shadow-2xl" />
                      <div className="absolute inset-0 rounded-[2.5rem] ring-1 ring-inset ring-white/20" />
                    </div>
                  ) : (
                    <div className="w-28 h-28 bg-white/5 rounded-[2.5rem] flex items-center justify-center ring-1 ring-white/10 group-hover:bg-white/10 transition-colors shadow-inner">
                      <Utensils size={40} className="text-white/10 group-hover:text-blue-500/50 transition-colors" />
                    </div>
                  )}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1.1 }}
                    className="absolute -top-2 -end-2 p-3 bg-blue-600 rounded-2xl shadow-xl opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0"
                  >
                    <Plus size={18} className="text-white" />
                  </motion.div>
                </div>

                <div className="flex-1 min-w-0 z-10 text-start">
                  <h4 className="font-black text-2xl text-white truncate tracking-tighter group-hover:text-blue-400 transition-colors mb-1">
                    {product.name}
                  </h4>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[10px] font-black text-blue-500/80 uppercase tracking-[0.2em] italic">
                      {product.brand || t('search_page.original_source')}
                    </span>
                    <div className="h-1 w-1 bg-white/20 rounded-full" />
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                      85% {t('search_page.match_rate')}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    {[
                      { val: product.calories, label: 'kcal', color: 'text-blue-500', bg: 'bg-blue-500/10' },
                      { val: product.protein, label: 'P', color: 'text-white/40', bg: 'bg-white/5' },
                    ].map((stat, i) => (
                      <div key={i} className={`px-4 py-2 ${stat.bg} rounded-xl flex items-center gap-2 border border-white/5`}>
                        <span className={`text-xs font-black tracking-tighter ${stat.color}`}>{Math.round(stat.val)}</span>
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">{stat.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="absolute end-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 rtl:group-hover:-translate-x-0 rtl:-translate-x-4 transition-all duration-500 text-blue-500">
                  <Plus size={24} />
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>

        {!loading && query && results.length === 0 && (
          <motion.div
            variants={itemVariants}
            className="text-center py-24 text-white/10 font-black uppercase tracking-[0.4em] text-[10px] italic flex flex-col items-center gap-4"
          >
            <div className="w-12 h-1 bg-white/5 rounded-full" />
            {t('search_page.no_results')}
          </motion.div>
        )}
      </div>

      {!loading && (
        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowQuickAdd(true)}
          className="mx-2 py-10 border-2 border-dashed border-white/5 rounded-[3.5rem] text-white/20 hover:border-blue-500/50 hover:text-blue-500 transition-all flex flex-col items-center justify-center gap-4 bg-white/5 group shadow-xl"
        >
          <div className="p-4 bg-blue-500/10 rounded-[1.5rem] group-hover:bg-blue-500/20 group-hover:scale-110 transition-all shadow-inner">
            <Plus size={28} />
          </div>
          <span className="font-black uppercase tracking-[0.3em] text-[10px]">{t('search_page.custom_entry')}</span>
        </motion.button>
      )}

      {showScanner && (
        <BarcodeScanner
          onScan={handleBarcodeScan}
          onClose={() => setShowScanner(false)}
        />
      )}

      <AnimatePresence>
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
      </AnimatePresence>
    </motion.div>
  );
};

export default FoodSearch;
