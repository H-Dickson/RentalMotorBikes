import React, { useState } from 'react';
import './motorbikeselector.css'

const MotorbikeSelector = ({ motorcycles, onChange }) => {
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedSubmodel, setSelectedSubmodel] = useState('');

  const handleYearChange = (event) => {
    const year = event.target.value;
    setSelectedYear(year);
    setSelectedMake('');
    setSelectedModel('');
    setSelectedSubmodel('');
    onChange({ year: year, make: '', model: '', submodel: '' });
  };

  const handleMakeChange = (event) => {
    const make = event.target.value;
    setSelectedMake(make);
    setSelectedModel('');
    setSelectedSubmodel('');
    onChange({ year: selectedYear, make: make, model: '', submodel: '' });
  };

  const handleModelChange = (event) => {
    const model = event.target.value;
    setSelectedModel(model);
    setSelectedSubmodel('');
    onChange({ year: selectedYear, make: selectedMake, model: model, submodel: '' });
  };

  const handleSubmodelChange = (event) => {
    const submodel = event.target.value;
    setSelectedSubmodel(submodel);
    onChange({ year: selectedYear, make: selectedMake, model: selectedModel, submodel: submodel });
  };

  return (
    <div>
      <label htmlFor="yearSelect">Select Year:</label>
      <select id="yearSelect" value={selectedYear} onChange={handleYearChange}>
        <option value="">Select Year</option>
        {Object.keys(motorcycles).reverse().map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
      

      {selectedYear && (
         <div className="selector-section">
      <label htmlFor="makeSelect">Select Make:</label>
      <select id="makeSelect" value={selectedMake} onChange={handleMakeChange} disabled={!selectedYear}>
        <option value="">Select Make</option>
        {selectedYear && motorcycles[selectedYear] &&
          Object.keys(motorcycles[selectedYear]).map(make => (
            <option key={make} value={make}>{make}</option>
          ))
        }
      </select>
      </div>
      )}

     {selectedMake && ( <div>
      <label htmlFor="modelSelect">Select Model:</label>
      <select id="modelSelect" value={selectedModel} onChange={handleModelChange} disabled={!selectedMake}>
        <option value="">Select Model</option>
        {selectedYear && selectedMake && motorcycles[selectedYear][selectedMake] &&
          Object.keys(motorcycles[selectedYear][selectedMake]).map(model => (
            <option key={model} value={model}>{model}</option>
          ))
        }
      </select>
      </div>
      )}
      { selectedModel && (<div>
      <label htmlFor="submodelSelect">Select Submodel:</label>
      <select id="submodelSelect" value={selectedSubmodel} onChange={handleSubmodelChange} disabled={!selectedModel}>
        <option value="">Select Submodel</option>
        {selectedYear && selectedMake && selectedModel && motorcycles[selectedYear][selectedMake][selectedModel] &&
          <option value={motorcycles[selectedYear][selectedMake][selectedModel].submodel}>
            {motorcycles[selectedYear][selectedMake][selectedModel].submodel}
          </option>
        }
      </select>
      </div>
      )}
    </div>
  );
};

export default MotorbikeSelector;
