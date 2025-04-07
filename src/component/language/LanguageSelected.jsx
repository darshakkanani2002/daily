// components/LanguageSelect.jsx
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { Test_Api } from '../Config';

const LanguageSelect = ({ selectedLanguage, handleLanguageSelect }) => {
    const [options, setOptions] = useState([]);

    useEffect(() => {
        loadOptions();
    }, []);

    // Fetch language options from the API
    const loadOptions = async () => {
        try {
            const response = await axios.get(`${Test_Api}language/details`);
            const data = response.data.data.map(language => ({
                label: language.vName,
                value: language._id,
                id: language._id,
            }));
            setOptions(data);
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    };

    return (
        <Select
            value={selectedLanguage}
            onChange={handleLanguageSelect}
            options={options}
            required
        />
    );
};

export default LanguageSelect;
