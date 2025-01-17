import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-multi-date-picker";
import debounce from 'lodash.debounce';
import "./registerbike.css";
import { AuthContext } from '../../../context/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import MotorbikeSelector from '../motorbikeselector/motorbikeselector.jsx';
import motorcycles from  './motorbike_data_by_year_and_model.json';

async function uploadFileToS3(uniqueKey, file) {
  const url = 'http://localhost:5000/rs-file-storage/'; // Direct URL to your S3 bucket

  const fields = {
    // Example fields required by S3 for direct upload
    key: uniqueKey, // The key (path) under which to store the file in the bucket
    AWSAccessKeyId: 'YOUR_AWS_ACCESS_KEY_ID',
    acl: 'public-read', // Access control list setting
    policy: 'YOUR_BASE64_ENCODED_POLICY_FILE', // Base64 encoded policy
    signature: 'YOUR_POLICY_SIGNATURE', // Signature for the policy
    'Content-Type': file.type // Set the file's content type
  };
  const formData = new FormData();
  Object.entries({ ...fields, file }).forEach(([key, value]) =>
    formData.append(key, value)
  );
  await fetch(url, {
    method: 'POST',
    body: formData,
  });
}

function RegisterBike() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedValues, setSelectedValues] = useState({
    year: '',
    make: '',
    model: '',
    submodel: ''
  });

  const [bikeInfo, setBikeInfo] = useState({
    owner_id: user._id,
    year: '',
    make: '',
    model: '',
    submodel: '',
    registration: '',
    vin: '',
    description: '',
    condition: '',
    parts: [],
    location: { lat: "", lon: "" },
    address: {
      street: "",
      city: "",
      region: "",
      postcode: "",
      country: ""
    },
    price: '',
    img: '',
    unavailable: []
  });

  const addPart = (part) => {
    setBikeInfo(prevState => ({
      ...prevState,
      parts: [...prevState.parts, part] // Add the new part to the parts array
    }));
  };

  const removePart = (index) => {
    const updatedParts = [...bikeInfo.parts];
    updatedParts.splice(index, 1); // Remove the part at the specified index
    setBikeInfo(prevState => ({
      ...prevState,
      parts: updatedParts
    }));
  };

  const [newPart, setNewPart] = useState('');

  const handleAddPart = (e) => {
    e.preventDefault(); // Prevent form submission
    addPart(newPart); // Add the new part
    setNewPart(''); // Reset the input field
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [file, setFile] = useState([]);
  const [values, setValues] = useState();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadFile = async (uniqueKey) => {
    if (!file) return;
    await uploadFileToS3(uniqueKey, file);
  };

  const handleMotorcycleChange = (selected) => {
    setSelectedValues(selected);
  };

  const handleChange = (e) => {
    setBikeInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const uniqueKey = `${uuidv4()}`;
    const updatedBikeInfo = {
      ...bikeInfo,
      year: selectedValues.year,
      make: selectedValues.make,
      model: selectedValues.model,
      submodel: selectedValues.submodel,
      img: uniqueKey,
      unavailable: values ? values.map(value => value) : []
    };
    try {
      const res = await axios.post("/bikes", updatedBikeInfo);
      if (file) {
        uploadFile(uniqueKey);
      }
      setLoading(false);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      setLoading(false);
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  const debouncedSearch = debounce((query) => {
    handleSearch(query);
  }, 300);

  const handleSearch = async (query) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1&limit=10&countrycodes=nz`
      );
      const formattedResults = response.data.map((result) => ({
        street: result.address.road || '',
        number: result.address.house_number || '',
        city: result.address.city || result.address.town || '',
        region: result.address.county || result.address.state || '',
        postcode: result.address.postcode || '',
        country: result.address.country || '',
        lat: result.lat,
        lon: result.lon,
      }));
      setResults(formattedResults);
    } catch (error) {
      console.error('Error fetching data:', error);
      setResults([]);
    }
  };

  const handleChanging = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    if (value.length > 2) {
      debouncedSearch(value);
    } else {
      setResults([]);
    }
  };

  const handleSelectAddress = (address) => {
    const selectedAddress = `${address.number || ''} ${address.street || ''}, ${address.city || ''}, ${address.region || ''}`;
    setSearchTerm(selectedAddress);
    setResults([]);
    const { lat, lon } = address;
    setBikeInfo(prevBikeInfo => ({
      ...prevBikeInfo,
      address: {
        street: address.street || '',
        city: address.city || '',
        region: address.region || '',
        country: address.country || '',
        postcode: address.postcode || '',
      },
      location: {
        lat: lat,
        lon: lon,
      }
    }));
  };

  return (
    <div className="registerBikePage">
      <div className="rbContainer">
        <h2>Register Your Bike</h2>
        <h1>Motorcycle Selector</h1>
        <MotorbikeSelector motorcycles={motorcycles} onChange={handleMotorcycleChange} />
        <input type="text" placeholder="Registration" name="registration" onChange={handleChange} className="rbInput" />
        <input type="text" placeholder="Vin number" name="vin" onChange={handleChange} className="rbInput" />
        <input type="text" placeholder="Description" name="description" onChange={handleChange} className="rbInput" />
        <input type="text" placeholder="Condition" name="condition" onChange={handleChange} className="rbInput" />
        <form onSubmit={handleAddPart}>
          <input
            type="text"
            value={newPart}
            onChange={(e) => setNewPart(e.target.value)}
            placeholder="Enter a part"
            className="rbInput-part"
          />
          <button type="submit">Add Part</button>
        </form>
        {/* Display the parts */}
        <ul className="parts-list">
          {bikeInfo.parts.map((part, index) => (
            <li key={index}>
              {part}
              <button className="remove-button" onClick={() => removePart(index)}>Remove</button>
            </li>
          ))}
        </ul>
        <input
          type="text"
          value={searchTerm}
          onChange={handleChanging}
          placeholder="Enter an address"
          className="rbInput"
        />
        <ul className='searchResults'>
          {results.map((result, index) => (
            <li key={index} onClick={() => handleSelectAddress(result)}>
              {result.number} {result.street} {result.city} {result.region}
            </li>
          ))}
        </ul>
        <input type="text" placeholder="Price" name="price" onChange={handleChange} className="rbInput" />
        <DatePicker 
          multiple
          value={values} 
          format="MM/DD/YYYY"
          onChange={setValues}
        />
        <div>
          <input type="file" onChange={handleFileChange} />
        </div>
        <button disabled={loading} onClick={handleSubmit} className="rbButton">
          Register Bike
        </button>
        {error && <span className="error">{error}</span>}
      </div>
    </div>
  );
}

export default RegisterBike;
