import React from 'react';
import { TextField } from '@shopify/polaris';

const Filter = ({ filterProducts, setFilterProducts }) => {
    return (
        <TextField
            value={filterProducts}
            onChange={(value) => setFilterProducts(value)}
            label="Filter by name or category"
            placeholder="Enter name or category"
            autoComplete="off"
        />
    );
};

export default Filter;
