import React, { useState, useEffect } from 'react';
import { Pill, Utensils, Plus, Check, Clock, AlertCircle, Trash2, Calendar, Coffee, Apple } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CarePortal = () => {
  const [activeTab, setActiveTab] = useState('meds'); // 'meds' or 'diet'
  const [meds, setMeds] = useState([]);
  const [meals, setMeals] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEntry, setNewEntry] = useState({ name: '', dosage: '', time: '', type: 'pill' });

  useEffect(() => {
    const savedMeds = localStorage.getItem('care_meds');
    if (savedMeds) setMeds(JSON.parse(savedMeds));

    const savedMeals = localStorage.getItem('care_meals');
    if (savedMeals) setMeals(JSON.parse(savedMeals));
  }, []);

  const saveToLocal = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const handleAddEntry = () => {
    if (activeTab === 'meds') {
      const updated = [...meds, { ...newEntry, id: Date.now(), taken: false }];
      setMeds(updated);
      saveToLocal('care_meds', updated);
    } else {
      const updated = [...meals, { ...newEntry, id: Date.now(), timestamp: new Date().toISOString() }];
      setMeals(updated);
      saveToLocal('care_meals', updated);
    }
    setShowAddModal(false);
    setNewEntry({ name: '', dosage: '', time: '', type: 'pill' });
  };

  const toggleMed = (id) => {
    const updated = meds.map(m => m.id === id ? { ...m, taken: !m.taken } : m);
    setMeds(updated);
    saveToLocal('care_meds', updated);
  };

  const deleteEntry = (id, type) => {
    if (type === 'meds') {
      const updated = meds.filter(m => m.id !== id);
      setMeds(updated);
      saveToLocal('care_meds', updated);
    } else {
      const updated = meals.filter(m => m.id !== id);
      setMeals(updated);
      saveToLocal('care_meals', updated);
    }
  };

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">Care Portal</h1>
          <p className="text-xl text-slate-500 font-medium mt-2">Manage daily health, medication, and nutrition.</p>
        </div>
        <div className="flex bg-slate-100 p-2 rounded-[2rem] shadow-inner">
          <button 
            onClick={() => setActiveTab('meds')}
            className={`px-8 py-4 rounded-[1.5rem] font-bold text-lg transition-all ${activeTab === 'meds' ? 'bg-white text-indigo-600 shadow-md scale-[1.05]' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Medications
          </button>
          <button 
            onClick={() => setActiveTab('diet')}
            className={`px-8 py-4 rounded-[1.5rem] font-bold text-lg transition-all ${activeTab === 'diet' ? 'bg-white text-emerald-600 shadow-md scale-[1.05]' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Nutrition
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] shadow-xl border-2 border-slate-50">
            <div className="flex items-center gap-5">
              <div className={`p-4 rounded-2xl ${activeTab === 'meds' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                {activeTab === 'meds' ? <Pill size={32} /> : <Utensils size={32} />}
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">
                  {activeTab === 'meds' ? 'Daily Medications' : 'Meal Logs'}
                </h2>
                <p className="text-slate-500 font-bold">Today, {new Date().toLocaleDateString('en-US', { weekday: 'long' })}</p>
              </div>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className={`p-4 rounded-full text-white shadow-lg transition-transform hover:scale-110 active:scale-95 ${activeTab === 'meds' ? 'bg-indigo-600' : 'bg-emerald-600'}`}
            >
              <Plus size={32} />
            </button>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {activeTab === 'meds' ? (
                meds.length === 0 ? (
                  <div className="bg-slate-50 py-20 rounded-[3rem] border-2 border-dashed border-slate-200 text-center">
                    <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-xl font-bold text-slate-500">No medications scheduled yet.</p>
                  </div>
                ) : (
                  meds.map((med) => (
                    <motion.div 
                      key={med.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`p-6 rounded-3xl bg-white border-2 flex items-center justify-between transition-all ${med.taken ? 'border-indigo-100 opacity-60' : 'border-slate-50 shadow-lg shadow-slate-200/50'}`}
                    >
                      <div className="flex items-center gap-6">
                        <button 
                          onClick={() => toggleMed(med.id)}
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${med.taken ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-50'}`}
                        >
                          <Check size={24} />
                        </button>
                        <div>
                          <p className={`text-2xl font-black ${med.taken ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{med.name}</p>
                          <div className="flex items-center gap-3 mt-1">
                             <span className="text-sm font-bold text-indigo-500 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-lg">{med.dosage}</span>
                             <span className="flex items-center gap-1 text-slate-400 text-sm font-medium">
                               <Clock size={14} /> {med.time}
                             </span>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => deleteEntry(med.id, 'meds')} className="text-slate-300 hover:text-red-500 transition-colors">
                        <Trash2 size={24} />
                      </button>
                    </motion.div>
                  ))
                )
              ) : (
                meals.length === 0 ? (
                  <div className="bg-slate-50 py-20 rounded-[3rem] border-2 border-dashed border-slate-200 text-center">
                    <Apple className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-xl font-bold text-slate-500">No meals logged for today.</p>
                  </div>
                ) : (
                  meals.map((meal) => (
                    <motion.div 
                      key={meal.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="p-6 rounded-3xl bg-white border-2 border-slate-50 shadow-lg shadow-slate-200/50 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                          <Coffee size={24} />
                        </div>
                        <div>
                          <p className="text-2xl font-black text-slate-800">{meal.name}</p>
                          <p className="text-slate-400 text-sm font-medium flex items-center gap-2 mt-1">
                            <Clock size={14} /> {new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <button onClick={() => deleteEntry(meal.id, 'diet')} className="text-slate-300 hover:text-red-500 transition-colors">
                        <Trash2 size={24} />
                      </button>
                    </motion.div>
                  ))
                )
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar Info Panels */}
        <div className="space-y-8">
           <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10">
                <Calendar size={120} />
             </div>
             <div className="relative z-10">
                <h3 className="text-2xl font-black uppercase tracking-widest mb-4">Care Insights</h3>
                <div className="space-y-6">
                   <div className="bg-white/10 p-5 rounded-2xl border border-white/10">
                      <p className="text-sky-400 text-xs font-black uppercase mb-1">Weekly Compliancy</p>
                      <p className="text-4xl font-black">94%</p>
                   </div>
                   <div className="p-5 border-2 border-white/5 rounded-2xl italic text-slate-400 leading-relaxed text-sm bg-white/5">
                     "Consistency in medication timing is critical for CP comfort and progress. You're doing great!"
                   </div>
                </div>
             </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-xl shadow-slate-200/50">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-3">
                 <AlertCircle size={24} className="text-amber-500" />
                 Dietary Tips
              </h3>
              <ul className="space-y-4">
                 {[
                   "Prioritize high-fiber purees",
                   "Add extra protein to morning meals",
                   "Maintain hydration between exercises"
                 ].map((tip, i) => (
                   <li key={i} className="flex items-center gap-4 text-slate-600 font-bold text-sm">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      {tip}
                   </li>
                 ))}
              </ul>
           </div>
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[3rem] p-10 w-full max-w-lg shadow-2xl border-4 border-slate-100"
            >
              <h3 className="text-3xl font-black text-slate-900 mb-8">
                {activeTab === 'meds' ? 'Add Medication' : 'Log Meal'}
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2 px-2">Name / Description</label>
                  <input 
                    type="text" 
                    value={newEntry.name}
                    onChange={(e) => setNewEntry({...newEntry, name: e.target.value})}
                    placeholder={activeTab === 'meds' ? "e.g. Baclofen" : "e.g. Fruit Puree"}
                    className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl font-bold focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all"
                  />
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2 px-2">
                       {activeTab === 'meds' ? 'Dosage' : 'Portion'}
                    </label>
                    <input 
                      type="text" 
                      value={newEntry.dosage}
                      onChange={(e) => setNewEntry({...newEntry, dosage: e.target.value})}
                      placeholder="e.g. 5mg"
                      className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl font-bold focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2 px-2">Time</label>
                    <input 
                      type="time" 
                      value={newEntry.time}
                      onChange={(e) => setNewEntry({...newEntry, time: e.target.value})}
                      className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl font-bold focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-10">
                  <button 
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-5 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAddEntry}
                    disabled={!newEntry.name}
                    className={`flex-1 py-5 text-white font-black rounded-2xl shadow-lg transition-all active:scale-95 ${activeTab === 'meds' ? 'bg-indigo-600' : 'bg-emerald-600'} disabled:opacity-50`}
                  >
                    Save Entry
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CarePortal;
