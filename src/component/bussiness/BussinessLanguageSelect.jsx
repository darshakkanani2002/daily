import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { Test_Api } from '../Config';

export default function BussinessLanguageSelect({ selectedLanguage, handleBusinessLanguageSelect }) {
    const [options, setOptions] = useState([]);

    useEffect(() => {
        loadOptions();
    }, []);

    // Fetch language options from the API
    const loadOptions = async () => {
        try {
            const response = await axios.get(`${Test_Api}businessCat/details`);
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
        <div>
            <Select
                value={selectedLanguage}
                onChange={handleBusinessLanguageSelect}
                options={options}
                required
            />
        </div>
    )
}
