import React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { COUNTRY_CODES } from '../utils/CountryCodeList';

const CountryCodeList = ({ onSelectChange, countryCode }) => {
  return (
    <Autocomplete
      id="country-code"
      options={COUNTRY_CODES}
      getOptionLabel={(option) => `${option.flag} ${option.value}`}
      value={countryCode}
      onChange={(event, newValue) => onSelectChange(newValue)}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      clearOnEscape={false}
      clearIcon={false}
      renderOption={(props, option) => (
        <li {...props}>
          {option.flag} {option.value}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Country Code"
          variant="outlined"
        />
      )}
    />
  );
};

export default CountryCodeList;
