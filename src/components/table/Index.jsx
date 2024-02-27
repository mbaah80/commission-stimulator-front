import React from 'react';
import {IndexTable, Text, TextField} from '@shopify/polaris';

const Table = ({
                   selectedResources,
                   allResourcesSelected,
                   filterProductsData,
                   resourceName,
                   onSelectionChange,
                   rowMarkup
}) => {
    return (
        <IndexTable
            resourceName={resourceName}
            itemCount={filterProductsData.length}
            selectedItemsCount={
                allResourcesSelected ? 'All' : selectedResources.length
            }
            onSelectionChange={onSelectionChange}
            headings={[
                {title: 'Name'},
                {title: 'Category'},
                {title: 'Price'},
                {title: ''},
            ]}
        >
            {rowMarkup}
        </IndexTable>
    );
};

export default Table;
