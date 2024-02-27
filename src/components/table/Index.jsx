import React from 'react';
import { IndexTable, Text } from '@shopify/polaris';

const Table = ({ products, selectedResources, allResourcesSelected, handleSelectionChange }) => {
    const rowMarkup = products.map(({ id, name, price, category, commissionPercentage }, index) => (
        <IndexTable.Row
            id={id}
            key={id}
            selected={selectedResources.includes(id)}
            position={index}
            // Add any other necessary props
        >
            <IndexTable.Cell>
                <Text as="span">{name}</Text>
            </IndexTable.Cell>
            <IndexTable.Cell>
                <Text as="span">{category}</Text>
            </IndexTable.Cell>
            <IndexTable.Cell>
                <Text as="span">{price}</Text>
            </IndexTable.Cell>
            <IndexTable.Cell>
                {/* Your commission input field */}
            </IndexTable.Cell>
        </IndexTable.Row>
    ));

    return (
        <IndexTable
            resourceName={{ singular: 'product', plural: 'products' }}
            itemCount={products.length}
            selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
            onSelectionChange={handleSelectionChange}
            headings={[
                { title: 'Name' },
                { title: 'Category' },
                { title: 'Price' },
                { title: 'Commission' }, // Add the commission header
            ]}
        >
            {rowMarkup}
        </IndexTable>
    );
};

export default Table;
