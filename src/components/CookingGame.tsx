import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChefHat, Flame, Check, X } from 'lucide-react';

interface Props {
  onComplete: (meal: string) => void;
  onCancel: () => void;
}

export default function CookingGame({ onComplete, onCancel }: Props) {
  const [step, setStep] = useState(0);
  const [mealType, setMealType] = useState<'veg' | 'non-veg' | null>(null);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [spices, setSpices] = useState<string[]>([]);

  const vegOptions = ['🍅 Tomatoes', '🧅 Onions', '🥔 Potatoes', '🥕 Carrots', '🥦 Broccoli'];
  const nonVegOptions = ['🍗 Chicken', '🥚 Eggs', '🥩 Meat', '🧅 Onions', '🍅 Tomatoes'];
  const spiceOptions = ['🧂 Salt', '🌶️ Chili Powder', '🌿 Mixed Herbs', '🧄 Garlic Paste', '🟡 Turmeric'];

  const currentOptions = mealType === 'veg' ? vegOptions : nonVegOptions;

  const handleCook = () => {
    setStep(3);
    setTimeout(() => {
      setStep(4);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
      >
        <div className="bg-orange-500 p-4 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ChefHat /> Cooking Simulator
          </h2>
          <button onClick={onCancel} className="hover:bg-orange-600 p-1 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 min-h-[300px] flex flex-col">
          {step === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center space-y-6">
              <h3 className="text-xl font-bold text-slate-800">What are we cooking today?</h3>
              <div className="flex gap-4 w-full">
                <button 
                  onClick={() => { setMealType('veg'); setStep(1); }}
                  className="flex-1 bg-emerald-100 hover:bg-emerald-200 border-2 border-emerald-500 text-emerald-800 p-4 rounded-2xl font-bold text-lg transition-transform hover:scale-105"
                >
                  🥗 Vegetarian
                </button>
                <button 
                  onClick={() => { setMealType('non-veg'); setStep(1); }}
                  className="flex-1 bg-rose-100 hover:bg-rose-200 border-2 border-rose-500 text-rose-800 p-4 rounded-2xl font-bold text-lg transition-transform hover:scale-105"
                >
                  🍗 Non-Veg
                </button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="flex-1 flex flex-col space-y-4">
              <h3 className="text-lg font-bold text-slate-800">Step 1: Select Ingredients</h3>
              <div className="grid grid-cols-2 gap-3">
                {currentOptions.map(item => (
                  <button
                    key={item}
                    onClick={() => {
                      if (ingredients.includes(item)) {
                        setIngredients(ingredients.filter(i => i !== item));
                      } else {
                        setIngredients([...ingredients, item]);
                      }
                    }}
                    className={`p-3 rounded-xl border-2 font-medium transition-all ${
                      ingredients.includes(item) 
                        ? 'bg-orange-100 border-orange-500 text-orange-800' 
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-orange-300'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <button 
                disabled={ingredients.length === 0}
                onClick={() => setStep(2)}
                className="mt-auto w-full bg-orange-500 text-white font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors"
              >
                Next: Add Spices
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="flex-1 flex flex-col space-y-4">
              <h3 className="text-lg font-bold text-slate-800">Step 2: Add Spices</h3>
              <div className="grid grid-cols-2 gap-3">
                {spiceOptions.map(item => (
                  <button
                    key={item}
                    onClick={() => {
                      if (spices.includes(item)) {
                        setSpices(spices.filter(i => i !== item));
                      } else {
                        setSpices([...spices, item]);
                      }
                    }}
                    className={`p-3 rounded-xl border-2 font-medium transition-all ${
                      spices.includes(item) 
                        ? 'bg-orange-100 border-orange-500 text-orange-800' 
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-orange-300'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <button 
                disabled={spices.length === 0}
                onClick={handleCook}
                className="mt-auto w-full bg-orange-500 text-white font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
              >
                <Flame /> Start Cooking!
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="flex-1 flex flex-col items-center justify-center space-y-6">
              <motion.div 
                animate={{ 
                  rotate: [0, -5, 5, -5, 5, 0],
                  y: [0, -10, 0]
                }}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className="text-8xl"
              >
                🍲
              </motion.div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-slate-800">Cooking in progress...</h3>
                <p className="text-slate-500 mt-2">Mixing {ingredients.length} ingredients and {spices.length} spices.</p>
              </div>
              <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 4, ease: "linear" }}
                  className="h-full bg-orange-500"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="flex-1 flex flex-col items-center justify-center space-y-6">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                type="spring"
                className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center"
              >
                <Check size={48} />
              </motion.div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-slate-800">Food is Ready!</h3>
                <p className="text-slate-500 mt-2">You made a delicious {mealType === 'veg' ? 'Vegetarian' : 'Non-Veg'} meal.</p>
              </div>
              <button 
                onClick={() => onComplete(`${mealType === 'veg' ? 'Veg' : 'Non-Veg'} Meal`)}
                className="w-full bg-emerald-500 text-white font-bold py-3 rounded-xl hover:bg-emerald-600 transition-colors"
              >
                Serve Food
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
