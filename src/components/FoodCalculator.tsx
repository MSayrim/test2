import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { foodItems } from '../data/foodItems';
import { CalcItem } from '../types';
import QuantitySelector from './QuantitySelector';
import { ShoppingCart } from 'lucide-react';

const FoodCalculator: React.FC = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState<CalcItem[]>(foodItems);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  const categories = [
    { id: 'all', name: t('food.categories.all') },
    { id: 'main', name: t('food.categories.main') },
    { id: 'side', name: t('food.categories.side') },
    { id: 'drink', name: t('food.categories.drink') },
    { id: 'dessert', name: t('food.categories.dessert') }
  ];
  
  const filteredItems = activeCategory === 'all' 
    ? items 
    : items.filter(item => item.category === activeCategory);
    
  const selectedItems = items.filter(item => item.quantity > 0);
  
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const handleIncreaseQuantity = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };
  
  const handleDecreaseQuantity = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id && item.quantity > 0 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${activeCategory === category.id 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }
              `}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredItems.map(item => (
            <div 
              key={item.id} 
              className={`
                bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600
                ${item.quantity > 0 ? 'ring-2 ring-green-500 dark:ring-green-400' : ''}
                transition-all duration-200 hover:shadow-md
              `}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-800 dark:text-gray-200">{item.name}</h3>
                <span className="text-green-600 dark:text-green-400 font-semibold">{item.price}₺</span>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{item.category}</span>
                <QuantitySelector 
                  quantity={item.quantity}
                  onIncrease={() => handleIncreaseQuantity(item.id)}
                  onDecrease={() => handleDecreaseQuantity(item.id)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 h-fit">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t('food.calculation.title')}</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">{t('calculator.types.food')}</span>
        </div>
        
        {selectedItems.length > 0 ? (
          <>
            <div className="space-y-4 mb-6">
              {selectedItems.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-md text-xs mr-2">
                      x{item.quantity}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">{item.name}</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {item.price * item.quantity}₺
                  </span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 dark:text-gray-400">{t('food.calculation.subtotal')}</span>
                <span className="font-medium">{totalAmount}₺</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">{t('food.calculation.tax')}</span>
                <span className="font-medium">{(totalAmount * 0.08).toFixed(2)}₺</span>
              </div>
            </div>
            
            <div className="border-t-2 border-green-500 dark:border-green-400 mt-4 pt-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg text-gray-800 dark:text-white">{t('food.calculation.total')}</span>
                <span className="font-bold text-xl text-green-600 dark:text-green-400">
                  {(totalAmount * 1.08).toFixed(2)}₺
                </span>
              </div>
            </div>
            
            <button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg mt-6 transition-colors flex items-center justify-center gap-2">
              <ShoppingCart size={18} />
              {t('food.calculation.save')}
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500 dark:text-gray-400">
            <ShoppingCart size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
            <p className="mb-2">{t('food.calculation.empty')}</p>
            <p className="text-sm">{t('food.calculation.addItems')}</p>
          </div>
        )}
        
        <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">{t('food.calculation.compare')}</h3>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 dark:text-gray-300">{t('food.calculation.avgMealCost')}</span>
            <span className="font-medium text-yellow-600 dark:text-yellow-400">450₺</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-700 dark:text-gray-300">{t('food.calculation.typicalDinner')}</span>
            <span className="font-medium text-yellow-600 dark:text-yellow-400">690₺</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCalculator;